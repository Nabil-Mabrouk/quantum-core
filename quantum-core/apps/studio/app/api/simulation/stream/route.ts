import { NextRequest, NextResponse } from 'next/server';
import { db } from '@repo/database';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { domain, projectId } = body;

  const engineUrl = process.env.ENGINE_URL || 'http://127.0.0.1:8000';
  const secret = process.env.INTERNAL_API_SECRET || 'super-secret-quantum-key-2026';

  try {
    // 1. CHARGEMENT DES DONNÉES (Bibliothèque + Projet)
    // On récupère tout ce qui manque au moteur Python
    const [libraryItems, project] = await Promise.all([
        db.libraryItem.findMany({
            where: { domain },
            include: { components: { include: { child: true } } }
        }),
        projectId ? db.project.findUnique({ where: { id: projectId } }) : null
    ]);

    // 2. FORMATAGE DE LA BIBLIOTHÈQUE (Format attendu par Python)
    const formattedLibrary = {
        referenceItems: libraryItems.map(item => ({
            id: item.id,
            name: item.name,
            category: item.category,
            properties: item.properties,
            composition: item.components.map(c => ({
                baseUnitId: c.childId,
                coefficient: c.quantity
            }))
        })),
        baseUnits: libraryItems.filter(i => i.category === 'ION').map(i => ({
            id: i.id,
            properties: i.properties
        }))
    };

    // 3. CALCUL DES SETTINGS PROJET
    // On construit l'objet profiles attendu par le solveur
    let projectSettings = {};
    if (project) {
        // Conversion des champs plats de la DB en structure profiles
        const productionHours = (project.hoursPerDay || 8) * (project.daysPerWeek || 5) * (project.weeksPerYear || 47);
        projectSettings = {
            profiles: {
                production: productionHours,
                heating: 8760, // Par défaut 24/7, ou à ajouter dans le schéma Project
                maintenance: 52 // ex: 1h/semaine
            }
        };
    }

    // 4. CONSTRUCTION DU PAYLOAD COMPLET
    const enrichedBody = {
        ...body,
        library: formattedLibrary,        // On remplace le null
        project_settings: projectSettings // On remplace le {}
    };

    // 5. APPEL AU MOTEUR PYTHON
    const response = await fetch(`${engineUrl}/simulate-stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-internal-secret': secret,
      },
      body: JSON.stringify(enrichedBody),
      // @ts-ignore
      duplex: 'half', 
    });

    if (!response.ok) {
        // On essaie de lire l'erreur JSON renvoyée par FastAPI
        const errorText = await response.text();
        throw new Error(`Engine Error (${response.status}): ${errorText}`);
    }

    // 6. STREAMING DE LA RÉPONSE VERS LE CLIENT
    return new NextResponse(response.body, {
        headers: { 'Content-Type': 'application/x-ndjson' }
    });

  } catch (error: any) {
    console.error("Stream API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}