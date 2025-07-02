// api/generate-roadmap.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { loadEnv } from 'vite';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { goal } = req.body;
    if (!goal || typeof goal !== 'string') {
      return res.status(400).json({ error: 'Meta é obrigatória.' });
    }

    const env = loadEnv(process.env.NODE_ENV as string, process.cwd(), '');
    const API_KEY = env.VITE_GEMINI_API_KEY;
    if (!API_KEY) throw new Error("Chave da API do Gemini não configurada no servidor.");
    
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

    const prompt = `
      Você é um mentor de carreira e estrategista de aprendizado de classe mundial chamado "Núcleo Nexus".
      Um usuário definiu o seguinte objetivo: "${goal}".
      Sua tarefa é criar um roteiro (roadmap) prático e acionável com 5 a 7 fases para que o usuário alcance esse objetivo.
      Para cada fase, forneça:
      1.  Um "title" (título curto e inspirador).
      2.  Uma "description" (descrição concisa do que fazer nessa fase).
      3.  Uma lista de "keywords" (3 a 4 palavras-chave ou tópicos essenciais para pesquisar e aprender nessa fase).
      
      Formate sua resposta EXCLUSIVAMENTE como um objeto JSON válido, que seja um array de fases. Não inclua nenhuma formatação markdown como \`\`\`json.
    `;

    const result = await model.generateContent(prompt);
    const textResponse = result.response.text();
    
    // --- LÓGICA DE EXTRAÇÃO DE JSON MELHORADA ---
    // Encontra o início e o fim do JSON na resposta da IA
    const jsonStart = textResponse.indexOf('[');
    const jsonEnd = textResponse.lastIndexOf(']') + 1;

    if (jsonStart === -1 || jsonEnd === 0) {
      throw new Error("A IA não retornou um JSON válido.");
    }

    const jsonString = textResponse.substring(jsonStart, jsonEnd);
    const roadmap = JSON.parse(jsonString);
    // -----------------------------------------
    
    return res.status(200).json({ roadmap });

  } catch (error: any) {
    console.error('[API_ERROR /api/generate-roadmap]', error);
    // Devolve uma mensagem de erro mais útil para o frontend
    return res.status(500).json({ error: error.message || 'Falha ao gerar o roteiro com a IA.' });
  }
}