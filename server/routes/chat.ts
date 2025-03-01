import { Express } from "express";
import OpenAI from "openai";

// Log para debug da chave da API
console.log('Verificando status da chave OpenAI:', process.env.OPENAI_API_KEY ? 'Presente' : 'Ausente');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const INITIAL_SYSTEM_MESSAGE = `Você é um assistente virtual amigável e profissional para uma plataforma de contratação de serviços.
Suas principais responsabilidades são:
1. Ajudar usuários com dúvidas sobre o processo de contratação
2. Explicar como funciona o sistema de matching
3. Auxiliar com questões técnicas básicas
4. Fornecer informações sobre pagamentos e uso de criptomoedas
5. Manter um tom profissional mas acolhedor

Responda sempre em português de forma clara e concisa.`;

export function setupChatRoutes(app: Express) {
  try {
    app.post("/api/chat", async (req, res) => {
      try {
        const { message } = req.body;
        console.log('Recebida mensagem do chat:', message);

        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            { role: "system", content: INITIAL_SYSTEM_MESSAGE },
            { role: "user", content: message }
          ],
          temperature: 0.7,
          max_tokens: 500,
        });

        console.log('Resposta gerada com sucesso');
        res.json({ message: response.choices[0].message.content });
      } catch (error) {
        console.error("Erro no processamento do chat:", error);
        res.status(500).json({ error: "Erro ao processar mensagem" });
      }
    });
    console.log('Rotas do chat configuradas com sucesso');
  } catch (error) {
    console.error('Erro na configuração das rotas do chat:', error);
    throw error;
  }
}