---
title: "The Engineering Specification: Quantum Core Physics Engine"
slug: "solver-suraface-treatment"
published: true
tags: "solver, engineering, chemistry"
---
# The Engineering Specification: Quantum Core Physics Engine

The solver's primary goal is to determine the **Steady State** concentration of ions in an industrial line. To do this, it must solve two interdependent systems: the **Hydraulic Balance** (Water) and the **Ionic Balance** (Chemistry).

## 1. The Temporal Normalization (The "24/7 Paradox")
In a factory, evaporation is a continuous physical process, but compensation is a discrete operational process.

**The Logic:**
If a tank evaporates $E$ Liters/hour over 168 hours a week, the total volume lost is $V_{total} = E \times 168$. If the production only runs for 40 hours, the water inlet must "catch up."

**The Code Implementation:**
```python
# Calculate how much we must over-feed during production hours 
# to compensate for the evaporation that happened while the factory was closed.
hours_day = safe_float(project_settings.get('hoursPerDay', 8))
days_week = safe_float(project_settings.get('daysPerWeek', 5))
working_hours_week = hours_day * days_week

# time_ratio is typically 4.2 (168/40)
time_ratio = 168.0 / working_hours_week if working_hours_week > 0 else 1.0
```
*   **Verification:** If `time_ratio` is ignored, the solver would underestimate the required water flow by 75%, leading to dry tanks in real life.

---

## 2. Logistic Topology (Transfer by Transporter)
Unlike a standard pipe, a crane moving parts from Tank A to Tank B creates a "virtual pipe" where the flow rate is determined by production cadence.

**The Logic:**
For every step in a sequence:
$$Q_{drag} = \text{Cadence} (\text{parts/h}) \times \text{Surface area} (m^2/\text{part}) \times \text{Drag-out rate} (L/m^2)$$

**The Code Implementation:**
```python
# Constructing the Drag-out Matrix (N x N)
for seq in sequences:
    # Hourly flow caused by parts movement
    q_d = safe_float(props.get('productionRate')) * safe_float(props.get('dragOutSpecific'))
    
    steps = seq.get('steps', [])
    for i in range(len(steps) - 1):
        src, dst = node_map.get(steps[i]), node_map.get(steps[i+1])
        if src is not None and dst is not None:
            # We add to the matrix (multiple sequences can pass through the same tanks)
            drag_outs[src, dst] += q_d
```

---

## 3. Chemical Flattening (Recursive BOM)
The solver must convert "Commercial Products" into "Calculated Ions." This is a recursive Bill of Materials (BOM) resolution.

**The Code Implementation:**
```python
# Breaking down: Commercial Product -> Reagents -> Ions
for link in product.get('composition', []):
    child = lib_map.get(link['childId'])
    if child and child['category'] == 'ION':
        # Direct ion (e.g., H+)
        ionic_targets[node_id][ion_id] += (consigne * coefficient)
    elif child: 
        # Intermediate reagent (e.g., NaOH contains Na+)
        for sub_link in child.get('composition', []):
            ionic_targets[node_id][ion_id] += (consigne * coeff1 * coeff2)
```

---

## 4. Hydraulic Stabilization (Mass Balance)
Water flows through gravity overflows (cascades). If Rinse 3 overflows into Rinse 2, and Rinse 2 into Rinse 1, the flows are interdependent. The solver uses an iterative approach to ensure convergence.

**The Code Implementation:**
```python
# Iterative loop to stabilize the cascade flows
for _ in range(N): 
    changed = False
    for n in nodes:
        if n['type'] == 'RINSE_TANK':
            # Sum of all incoming water (Makeup + Overflows from other tanks)
            q_in = sum(water_flows[:, idx]) + manual_inlet
            # Subtract evaporation loss
            q_out = max(0, q_in - (evaporation * time_ratio))
            
            # Map the output to the target tank (Gravity pipe)
            target_id = n['properties'].get('overflowTargetId')
            if target_id in node_map:
                if abs(water_flows[idx, target_idx] - q_out) > 1e-6:
                    water_flows[idx, target_idx] = q_out
                    changed = True
    if not changed: break # System is balanced
```

---

## 5. The Core Matrix: Solving $Ax = b$
This is where the law of conservation of mass is enforced. For every tank $i$ and every ion, we define:
- **Outflows:** Drag-out to the next tank + Overflow to the drain.
- **Inflows:** Drag-out from the previous tank + Overflow from a previous rinse.

**The Matrix Rules:**
1.  **For a Process Bath:** The concentration is a constant ($x_i = C_{target}$).
2.  **For a Rinse Tank:** The sum of mass entering must equal the sum of mass leaving.

**The Code Implementation:**
```python
for i, n in enumerate(nodes):
    # Total liquid leaving the tank (L/h)
    outflow = sum(drag_outs[i, :]) + sum(water_flows[i, :])
    
    if n['type'] == 'PROCESS_BATH':
        A[i, i] = 1.0        # Force the variable x_i...
        b[i] = target_value  # ...to be equal to the target.
    else:
        # Mass Balance: [Sum of Outflows] * Ci - [Sum of Inflows * Cj] = 0
        A[i, i] = max(outflow, 1e-9) # Diagonal
        for j in range(N):
            # If tank J flows into tank I, it brings its concentration Cj
            if drag_outs[j, i] > 0:   A[i, j] -= drag_outs[j, i]
            if water_flows[j, i] > 0: A[i, j] -= water_flows[j, i]

# The Final Calculation
x = np.linalg.solve(A, b)
```

---

## 6. Verification & Anti-Corruption Safeguards

To ensure the solver doesn't provide "plausible but wrong" data, we use three levels of validation:

### A. The Singular Matrix Guard
If a user forgets to connect a "Drain" to a tank, the pollution builds up infinitely. The matrix becomes "singular" (unsolvable).
```python
except np.linalg.LinAlgError:
    yield json.dumps({"type": "log", "message": f"⚠️ Instabilité : L'ion {ion_id} ne peut pas être évacué. Vérifiez les rejets."})
```

### B. The Zero-Gravity Check
The solver checks if evaporation is occurring without a water source.
```python
if props.get('hasEvaporation') and not props.get('makeupSourceId'):
    warnings.append(f"⚠️ {n.get('label')} s'évapore mais n'a pas d'appoint d'eau !")
```

### C. Transparency via NDJSON
Every internal step is reported back to the `SimulationConsole` in the Studio. This allows the engineer to see the solver "thinking" and identify exactly where the logic might be stalling.

---

## Conclusion
This solver is not a black box; it is a **linear representation of a physical graph**. By using a centralized matrix approach ($Ax=b$) instead of sequential formulas, Quantum Core can solve even the most complex "circular" cascades that traditional tools like Excel simply cannot handle. 
