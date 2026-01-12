import { NextRequest, NextResponse } from 'next/server';
import { db } from '@repo/database'; // Pour récupérer le projet/librairie si besoin
import { auth } from '@/auth'; // Pour l'utilisateur
// import OpenAI from 'openai'; // Ou tout autre SDK de LLM

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY }); // Configurer la clé API

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authentification requise pour le chat IA." }, { status: 401 });
  }

  const { message, context } = await req.json(); // message: question, context: page, projectId, etc.

  // 1. Enrichir le contexte (Base de données)
  let projectData = null;
  let libraryData = null;
  if (context.projectId) {
    projectData = await db.project.findUnique({ where: { id: context.projectId } });
    if (projectData) {
        libraryData = await db.libraryItem.findMany({ where: { domain: projectData.domain } });
    }
  }

  // 2. Construire le Prompt (Contextualisé)
  let systemPrompt = `Vous êtes Quantum AI, un assistant expert en ingénierie industrielle. Répondez aux questions sur la simulation, les équipements et la chimie.`;
  
  let userPrompt = `Je suis sur la page "${context.page}". Mon projet est "${projectData?.name || 'Inconnu'}" (ID: ${context.projectId || 'N/A'}). Ma question: "${message}"`;

  if (libraryData && libraryData.length > 0) {
    userPrompt += `\n\nContexte de la Librairie: ${JSON.stringify(libraryData.slice(0, 5).map(item => item.name))}`; // Limiter pour éviter les tokens
  }
  if (projectData) {
    userPrompt += `\n\nParamètres du Projet: ${JSON.stringify(projectData.properties)}`;
  }
  // Ajouter d'autres détails de la page si pertinents (ex: la liste des noeuds du graphe)

  try {
    // 3. Appel à l'API LLM (Exemple avec OpenAI)
    // const chatCompletion = await openai.chat.completions.create({
    //   model: "gpt-4-turbo-preview", // Ou autre modèle
    //   messages: [
    //     { role: "system", content: systemPrompt },
    //     { role: "user", content: userPrompt }
    //   ],
    //   stream: false, // Pour l'instant pas de streaming pour simplifier
    // });

    // const aiResponse = chatCompletion.choices[0].message.content;
    const aiResponse = `Je suis une IA factice. Contexte reçu: ${userPrompt.slice(0, 200)}...`; // Réponse mockée

    await recordAuditLog("AI_CHAT", projectData?.domain, { context, message, aiResponse: aiResponse.slice(0, 100) });

    return NextResponse.json({ response: aiResponse });

  } catch (error: any) {
    console.error("AI Chat API Error:", error);
    await recordAuditLog("AI_CHAT_ERROR", projectData?.domain, { context, message, error: error.message });
    return NextResponse.json({ error: "Erreur de communication avec l'IA." }, { status: 500 });
  }
}