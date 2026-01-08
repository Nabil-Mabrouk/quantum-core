def run_water_simulation(nodes, edges):
    warnings = []
    total_volume = 0
    total_capex = 0
    
    # 1. Calcul des flux et volumes
    for node in nodes:
        total_volume += float(node.properties.get("volume", 0))
        total_capex += float(node.properties.get("price", 0))
        
        inflow = sum(float(e.properties.get("flowRate", 0)) for e in edges if e.target == node.id)
        outflow = sum(float(e.properties.get("flowRate", 0)) for e in edges if e.source == node.id)
        
        balance = inflow - outflow
        if abs(balance) > 0.01:
            label = node.properties.get("label", node.id)
            warnings.append(f"Déséquilibre sur '{label}': {balance:+.2f} m3/h")

    # 2. Vérification spécifique (Sizing Pompes)
    for node in [n for n in nodes if n.type == "PUMP"]:
        nominal_flow = float(node.properties.get("flow", 0))
        actual_flow = sum(float(e.properties.get("flowRate", 0)) for e in edges if e.source == node.id)
        if actual_flow > nominal_flow and nominal_flow > 0:
            warnings.append(f"Pompe '{node.properties.get('catalogName')}' surchargée")

    return {
        "status": "success",
        "kpis": [
            {"label": "Investissement", "value": total_capex, "unit": "€", "color": "emerald-600"},
            {"label": "Volume Total", "value": total_volume, "unit": "L", "color": "blue-600"},
            {"label": "Flux Global", "value": sum(float(e.properties.get("flowRate", 0)) for e in edges), "unit": "m3/h", "color": "blue-400"}
        ],
        "warnings": warnings
    }