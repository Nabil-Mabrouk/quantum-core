import { NextRequest, NextResponse } from 'next/server';
import { db } from '@repo/database';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { domain, projectId } = body;

  const engineUrl = process.env.ENGINE_URL;
  const secret = process.env.INTERNAL_API_SECRET;
  
  if (!engineUrl || !secret) {
    return NextResponse.json({ error: "Configuration serveur incomplète: ENGINE_URL ou SECRET manquant." }, { status: 500 });
  }

  try {
    // 1. CHARGEMENT DES DONNÉES (Bibliothèque + Projet)
    // On récupère tout ce qui manque au moteur Python (qui est un service stateless)
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

    // 3. CALCUL DES SETTINGS PROJET (Simplifié pour le core)
    let projectSettings = {};
    if (project) {
        // NOTE: Ceci est une version simplifiée et ne correspond pas au payload complet de simulation.ts,
        // mais nous laissons la logique existante ici car elle était dans le fichier.
        const productionHours = (project.hoursPerDay || 8) * (project.daysPerWeek || 5) * (project.weeksPerYear || 47);
        projectSettings = {
            profiles: {
                production: productionHours,
                heating: 8760, // Par défaut 24/7
                maintenance: 52 // ex: 1h/semaine
            }
        };
    }

    // 4. CONSTRUCTION DU PAYLOAD COMPLET
    const enrichedBody = {
        ...body,
        library: formattedLibrary,        // On ajoute la bibliothèque
        project_settings: projectSettings // On ajoute les settings
    };

    // 5. APPEL AU MOTEUR PYTHON
    const response = await fetch(`${engineUrl}/simulate-stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-internal-secret': secret,
      },
      body: JSON.stringify(enrichedBody),
      // @ts-ignore - Pour le mode streaming dans fetch
      duplex: 'half', 
    });

    if (!response.ok) {
        // 🚩 CORRECTION CRITIQUE: Si le solveur Python renvoie un code d'erreur (400, 500),
        // on lit le corps du message d'erreur de FastAPI et on le propage au client.
        const errorBody = await response.text();
        
        // On retourne la réponse d'erreur au client avec le statut correct.
        // Cela évite le ERR_INCOMPLETE_CHUNKED_ENCODING côté client.
        return new NextResponse(errorBody, {
             status: response.status,
             headers: { 
                 'Content-Type': response.headers.get('content-type') || 'application/json' 
             }
        });
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