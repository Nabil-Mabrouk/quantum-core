import { NextRequest } from 'next/server';
import { db } from '@repo/database';
import { auth } from '@/auth';
import { Groq } from 'groq-sdk';
import { recordAuditLog } from '@/app/[locale]/actions/audit';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  const { message, context } = await req.json();

  try {
    // 1. RÉCUPÉRATION DU CONTEXTE TECHNIQUE
    let projectContext = "Aucune donnée de projet disponible.";
    if (context.projectId) {
      const project = await db.project.findUnique({
        where: { id: context.projectId },
        include: { systems: { include: { nodes: true } } }
      });
      if (project) {
        projectContext = `PROJET: ${project.name} | DOMAINE: ${project.domain}
        UNITÉS PROJET: ${project.systems.map(s => 
          s.nodes.map(n => `- ${n.label} (${n.type}): ${JSON.stringify(n.properties)}`).join('\n')
        ).join('\n')}`;
      }
    }

    // 2. APPEL GROQ EN MODE STREAM
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: `Vous êtes Quantum AI, expert en ingénierie de surface. 
          Analysez le contexte technique suivant pour aider l'utilisateur. 
          Répondez en Markdown de manière concise et technique.` 
        },
        { role: "user", content: `CONTEXTE:\n${projectContext}\n\nQUESTION: ${message}` }
      ],
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      temperature: 0.2,
      stream: true, // Activation du streaming
    });

    // 3. CRÉATION DU FLUX DE RÉPONSE (ReadableStream)
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        for await (const chunk of chatCompletion) {
          const content = chunk.choices[0]?.delta?.content || "";
          controller.enqueue(encoder.encode(content));
        }
        controller.close();
      },
    });

    // Log d'audit (sans attendre la fin pour ne pas bloquer le stream)
    recordAuditLog("AI_CHAT_STREAM", context.domain, { message });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });

  } catch (error: any) {
    console.error("Groq Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}