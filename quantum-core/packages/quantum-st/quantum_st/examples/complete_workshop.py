"""
Exemple complet : Atelier avec 2 lignes et recyclage inter-lignes.
"""

from quantum_st import (
    Workshop, ProcessingLine, ProcessNode, NodeType,
    Flow, FlowType, ProcessSequence, ProcessStep,
    GlobalSolver
)

def create_complete_workshop():
    """Crée un atelier réaliste avec couplage."""
    
    # === ATELIER ===
    atelier = Workshop("Atelier Traitement de Surface Nord")
    
    # === RESSOURCES PARTAGÉES ===
    atelier.add_node(ProcessNode(
        id="eau_osmosee",
        name="Réservoir eau osmosée centrale",
        node_type=NodeType.SOURCE,
        volume=10000  # Volume du réservoir
    ))
    
    atelier.add_node(ProcessNode(
        id="step_acide",
        name="STEP Eaux Acides",
        node_type=NodeType.SINK,
        volume=0
    ))
    
    atelier.add_node(ProcessNode(
        id="step_cyanure",
        name="STEP Eaux Cyanurées (ségrégation)",
        node_type=NodeType.SINK,
        volume=0
    ))
    
    # === LIGNE 1 : ZINCAGE ===
    ligne_zinc = atelier.create_line(
        "zinc_1", 
        name="Ligne Zincage Automatique",
        operating_hours=16,
        max_surface_rate=80
    )
    
    # Cuves de la ligne zinc
    cuves_zinc = [
        ProcessNode(
            id="z_decapage",
            name="Bain de décapage HCl",
            node_type=NodeType.PROCESS_BATH,
            volume=3000,
            temperature=25,
            is_dirichlet=True,
            fixed_concentrations={"H+": 36.5, "Cl-": 36.5, "Fe2+": 45.0}
        ),
        ProcessNode(
            id="z_rinse1",
            name="Rinçage décapage",
            node_type=NodeType.RINSE,
            volume=1000,
            surface_area=2.5
        ),
        ProcessNode(
            id="z_bain_zinc",
            name="Bain de zinc acide",
            node_type=NodeType.PROCESS_BATH,
            volume=4000,
            temperature=35,
            is_dirichlet=True,
            fixed_concentrations={"Zn2+": 45.0, "Cl-": 120.0}
        ),
        ProcessNode(
            id="z_rinse2",
            name="Rinçage zinc étage 1",
            node_type=NodeType.RINSE,
            volume=800,
            surface_area=2.0
        ),
        ProcessNode(
            id="z_rinse3",
            name="Rinçage zinc étage 2 (propre)",
            node_type=NodeType.RINSE,
            volume=800,
            surface_area=2.0
        ),
    ]
    
    for cuve in cuves_zinc:
        atelier.add_node(cuve, line_id="zinc_1")
    
    # === LIGNE 2 : ANODISATION ===
    ligne_anod = atelier.create_line(
        "anod_1",
        name="Ligne Anodisation Aluminium",
        operating_hours=20,
        max_surface_rate=60
    )
    
    cuves_anod = [
        ProcessNode(
            id="a_degraissage",
            name="Bain dégraissage alcalin",
            node_type=NodeType.PROCESS_BATH,
            volume=2500,
            temperature=60,
            is_dirichlet=True,
            fixed_concentrations={"Na+": 15.0, "OH-": 8.0}
        ),
        ProcessNode(
            id="a_rinse_deg",
            name="Rinçage dégraissage",
            node_type=NodeType.RINSE,
            volume=1000,
            surface_area=3.0
        ),
        ProcessNode(
            id="a_anodisation",
            name="Bain anodisation sulfurique",
            node_type=NodeType.PROCESS_BATH,
            volume=5000,
            temperature=20,
            is_dirichlet=True,
            fixed_concentrations={"H+": 20.0, "SO4--": 98.0, "Al3+": 5.0}
        ),
        ProcessNode(
            id="a_rinse_anod",
            name="Rinçage anodisation",
            node_type=NodeType.RINSE,
            volume=1200,
            surface_area=3.5
        ),
    ]
    
    for cuve in cuves_anod:
        atelier.add_node(cuve, line_id="anod_1")
    
    # === FLUX HYDRAULIQUES LIGNE ZINC (cascade) ===
    atelier.add_flow(Flow(
        source_id="eau_osmosee",
        target_id="z_rinse3",
        flow_type=FlowType.HYDRAULIC,
        flow_rate=200
    ))
    
    atelier.add_flow(Flow(
        source_id="z_rinse3",
        target_id="z_rinse2",
        flow_type=FlowType.HYDRAULIC,
        flow_rate=200
    ))
    
    atelier.add_flow(Flow(
        source_id="z_rinse2",
        target_id="z_rinse1",
        flow_type=FlowType.HYDRAULIC,
        flow_rate=200
    ))
    
    atelier.add_flow(Flow(
        source_id="z_rinse1",
        target_id="step_acide",
        flow_type=FlowType.HYDRAULIC,
        flow_rate=200
    ))
    
    # === FLUX HYDRAULIQUES LIGNE ANODISATION ===
    atelier.add_flow(Flow(
        source_id="eau_osmosee",
        target_id="a_rinse_anod",
        flow_type=FlowType.HYDRAULIC,
        flow_rate=300
    ))
    
    atelier.add_flow(Flow(
        source_id="a_rinse_anod",
        target_id="a_rinse_deg",
        flow_type=FlowType.HYDRAULIC,
        flow_rate=300
    ))
    
    atelier.add_flow(Flow(
        source_id="a_rinse_deg",
        target_id="step_acide",
        flow_type=FlowType.HYDRAULIC,
        flow_rate=300
    ))
    
    # === COUPLAGE INTER-LIGNES (RECYCLAGE) ===
    # L'eau de rinçage propre de zinc (z_rinse3, légèrement chargée)
    # est récupérée pour le rinçage dégraissage anodisation (moins critique)
    atelier.add_flow(Flow(
        source_id="z_rinse3",
        target_id="a_rinse_deg",
        flow_type=FlowType.RECYCLE,
        flow_rate=50,  # 50 L/h de recyclage
        description="Recyclage eau zincage vers anodisation"
    ))
    
    # === GAMMES DE TRAITEMENT ===
    gamme_zinc = ProcessSequence(
        id="zinc_standard",
        name="Zincage acier standard",
        surface_rate=60,  # m²/h
        steps=[
            ProcessStep(tank_id="z_decapage", drag_out_factor=0.8),
            ProcessStep(tank_id="z_rinse1", drag_out_factor=0.3),
            ProcessStep(tank_id="z_bain_zinc", drag_out_factor=1.2),
            ProcessStep(tank_id="z_rinse2", drag_out_factor=0.4),
            ProcessStep(tank_id="z_rinse3", drag_out_factor=0.2),
        ]
    )
    atelier.add_sequence(gamme_zinc, line_id="zinc_1")
    
    gamme_anod = ProcessSequence(
        id="anod_standard",
        name="Anodisation type II",
        surface_rate=40,
        steps=[
            ProcessStep(tank_id="a_degraissage", drag_out_factor=0.6),
            ProcessStep(tank_id="a_rinse_deg", drag_out_factor=0.2),
            ProcessStep(tank_id="a_anodisation", drag_out_factor=0.5),
            ProcessStep(tank_id="a_rinse_anod", drag_out_factor=0.15),
        ]
    )
    atelier.add_sequence(gamme_anod, line_id="anod_1")
    
    return atelier

def main():
    # Création
    atelier = create_complete_workshop()
    
    print("=" * 60)
    print(atelier.get_summary())
    print("=" * 60)
    
    # Validation
    validation = atelier.validate()
    print(f"\nValidation: {'OK' if validation['valid'] else 'ERREURS'}")
    if validation['issues']:
        for issue in validation['issues']:
            print(f"  - {issue}")
    
    # Résolution
    print("\nRésolution du système...")
    solveur = GlobalSolver(atelier)
    
    ions = ["Zn2+", "Cl-", "Fe2+", "Na+", "OH-", "SO4--", "Al3+"]
    results = solveur.solve(ions, method='direct')
    
    # Affichage des résultats
    print("\n" + "=" * 60)
    print("CONCENTRATIONS DANS LES RINÇAGES")
    print("=" * 60)
    
    pivot = results.pivot_table(
        values='concentration_g_l',
        index='node_id',
        columns='ion'
    )
    print(pivot.round(2))
    
    # Flux inter-lignes
    print("\n" + "=" * 60)
    print("FLUX INTER-LIGNES (recyclage)")
    print("=" * 60)
    
    for ion in ["Zn2+", "Cl-", "Na+"]:
        flux_df = solveur.get_inter_line_fluxes(ion)
        if not flux_df.empty:
            print(f"\n{ion}:")
            print(flux_df[['source_line', 'target_line', 'mass_flow_g_h']].to_string(index=False))
    
    # Bilans par ligne
    print("\n" + "=" * 60)
    print("CONTRIBUTIONS PAR LIGNE")
    print("=" * 60)
    
    for ion in ["Zn2+", "Cl-"]:
        print(f"\n{ion}:")
        contrib = solveur.get_line_contributions(ion)
        for line, data in contrib.items():
            print(f"  {line}: entrées={data['entrées_externes_g_h']:.1f} g/h, "
                  f"sorties={data['sorties_externes_g_h']:.1f} g/h")

if __name__ == "__main__":
    main()