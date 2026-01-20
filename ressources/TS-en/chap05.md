---
title: "Chapter 5: The Surface Treatment Solver—Coding the Engineering Brain"
slug: "st-tutorial-ch5-python-solver"
published: true
tags: "Python, NumPy, Solver, Surface Treatment, Mathematical Modeling"
---

# Chapter 5: The Python Solver Implementation

In this chapter, we translate the physical and operational rules defined in the previous chapters into a high-performance Python solver. This logic lives in `apps/engine/domains/surface_treatment/solver.py`.

The solver's mission is to resolve the **Water Balance** and the **Ionic Balance** simultaneously, accounting for the "24h operation paradox" and the logistics of the transporter.

---

## Data Pre-processing: Aggregating Logistics

A specific tank might be part of multiple production sequences (e.g., "Sequence Zinc" and "Sequence Nickel"). The total **Drag-out** leaving a tank is the sum of the volumes moved by every sequence passing through it.

```python
# Aggregate drag-out from all sequences
drag_outs = np.zeros((N, N)) # Matrix of flows in L/h

for seq in sequences:
    p = seq.get('properties', {})
    # Hourly drag-out for this specific sequence
    q_drag_seq = float(p.get('cadence', 0)) * \
                 float(p.get('surfacePerPart', 1)) * \
                 float(p.get('dragOutSpecific', 0.1))
    
    steps = seq.get('steps', [])
    for i in range(len(steps) - 1):
        src_idx = node_map.get(steps[i])
        dst_idx = node_map.get(steps[i+1])
        if src_idx is not None and dst_idx is not None:
            # We add to the matrix (summing sequences)
            drag_outs[src_idx, dst_idx] += q_drag_seq
```

---

## Calculating the Thermodynamic Loss (Evaporation)

Evaporation is calculated using the geometry and temperature of the tank, influenced by the workshop's ambient conditions and agitation level.

```python
def get_evaporation_rate(node, project_settings):
    p = node['properties']
    # Surface Area in m2
    area = (float(p.get('length', 0)) * float(p.get('width', 0))) / 1_000_000
    t_bath = float(p.get('temp', 20))
    t_air = float(project_settings.get('workshopTemp', 20))
    hum = float(project_settings.get('workshopHumidity', 60))
    
    # Simplified evaporation model (L/h)
    # Rate increases with Temperature and Agitation
    agitation_coeff = 1.5 if p.get('agitation') == 'AIR' else 1.0
    evap = area * (0.02 * (t_bath - t_air)) * agitation_coeff
    
    # Reduction if covers are used
    if p.get('hasCover'):
        evap *= 0.1 # 90% reduction
        
    return max(0, evap)
```

---

## Resolving the Hydraulic Balance (The 24h Paradox)

As we defined, evaporation ($Q_e$) happens **168h/week**, but compensation ($Q_c$) happens only during **Working Hours** ($WH$). 

To solve this, we normalize the evaporation to an **Effective Hourly Rate** during production:
$$Q_{e\_eff} = \frac{Q_e \times 168}{WH}$$

### Automatic Spray Logic
If a `PROCESS_BATH` has `hasSpray = True`, the solver automatically injects water into the bath at a rate exactly equal to $Q_{e\_eff}$. This water is "pulled" from the `spraySourceId` (usually the first rinse).

```python
# Hydraulic Calculation
working_hours_week = float(settings.get('hoursPerDay', 8)) * float(settings.get('daysPerWeek', 5))

for node in nodes:
    node_id = node['id']
    q_evap = get_evaporation_rate(node, settings)
    effective_evap = (q_evap * 168) / working_hours_week
    
    if node['type'] == 'PROCESS_BATH' and node['properties'].get('hasSpray'):
        source_id = node['properties'].get('spraySourceId')
        # Record a pumped transfer from Source -> Bath
        water_flows[node_map[source_id], node_map[node_id]] = effective_evap
```

---

## The Ionic Matrix: Solving $Ax = b$

We solve one matrix for every unique ion (e.g., $Ni^{2+}$, $Cl^-$, $NaOH$).

### 1. The Dirichlet Condition (Process Baths)

For a `PROCESS_BATH`, the concentration is a **constant** (setpoint). 
*   We force $A[i, i] = 1$ and $b[i] = TargetConcentration$.

### 2. The Equilibrium Condition (Rinse Tanks)
For a `RINSE_TANK`, the concentration depends on what comes in.
*   **Diagonal $A[i, i]$:** Sum of all outflows (Drag-out + Overflow to Drain/Rinse + Pumped out to Spray).
*   **Off-Diagonal $A[i, j]$:** Negative sum of all inflows from tank $j$.

```python
# For each chemical species
for chem_id in unique_ions:
    A = np.zeros((N, N))
    b = np.zeros(N)

    for i, node in enumerate(nodes):
        if node['type'] == 'PROCESS_BATH':
            # Rule: Fixed Concentration
            A[i, i] = 1.0
            b[i] = get_target(node, chem_id)
        else:
            # Rule: Mass Balance (In = Out)
            q_out_total = sum(drag_outs[i, :]) + sum(water_flows[i, :])
            A[i, i] = max(q_out_total, 1e-9) # Prevent div by zero
            
            for j in range(N):
                # Negative inflow from tank j
                if drag_outs[j, i] > 0:
                    A[i, j] -= drag_outs[j, i]
                if water_flows[j, i] > 0:
                    A[i, j] -= water_flows[j, i]

    # Solve the system
    concentrations = np.linalg.solve(A, b)
```

---

## Environmental Impact: Drains and WWTP

Finally, the solver calculates the load on the effluent treatment system.

1.  **Continuous Load ($L/h$):** Sum of all overflows (`overflowTargetId`) hitting a `DRAIN` node.
2.  **Batch Load ($L/year$):** Calculated by $Volume \times DumpingFrequency$.
3.  **Pollution Load ($g/h$):** Calculated by $Q_{overflow} \times C_{i}$.

This data is crucial for the factory to ensure their Waste Water Treatment Plant (WWTP) is correctly sized for the peak pollution coming from the line.

---

## Summary of Chapter 5

The Python brain is now complete. It respects:

*   **Multi-sequence summing** (Complex logistics).
*   **Thermodynamic evaporation** (Physical reality).
*   **The 168h/WH conversion** (Operational reality).
*   **Pumped vs Gravity flows** (Engineering constraints).

