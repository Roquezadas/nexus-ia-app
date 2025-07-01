// api/summarize.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { loadEnv } from 'vite';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // Carrega as variáveis de ambiente usando a função do Vite
  const env = loadEnv(process.env.NODE_ENV as string, process.cwd(), '');
  const API_KEY = env.VITE_GEMINI_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: 'Chave da API do Gemini não foi encontrada no servidor.' });
  }

  const genAI = new GoogleGenerativeAI(API_KEY);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { headlines } = req.body;

    if (!headlines || !Array.isArray(headlines) || headlines.length === 0) {
      return res.status(400).json({ error: 'Lista de manchetes é obrigatória.' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

    const prompt = `
      Você é o "Núcleo Nexus", um analista de notícias expert e conciso. 
      Sua tarefa é ler a lista de manchetes a seguir e criar um único parágrafo coeso e fluente em português do Brasil que resuma os eventos mais importantes. 
      Não faça uma lista, crie uma narrativa curta.
      Manchetes:
      - ${headlines.join('\n- ')}
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const summary = response.text();

    return res.status(200).json({ summary });

  } catch (error: any) {
    console.error('[API_ERROR /api/summarize]', error);
    return res.status(500).json({ error: 'Falha ao gerar o resumo com a IA.' });
  }
}