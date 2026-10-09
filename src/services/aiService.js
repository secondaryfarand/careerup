import { GoogleGenAI } from '@google/genai';

function getAiInstance() {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('API Key Gemini tidak ditemukan di file .env');
  }

  return new GoogleGenAI({ apiKey });
}

export async function generateQuizFromAI(skills, jobDescription) {
  const ai = getAiInstance();

  const prompt = `
Buat kuis pilihan ganda ${skills.length || 2} soal.
Skills: ${skills.map((s) => s.name).join(', ')}
Job: ${jobDescription}

Format JSON array murni tanpa markdown:
[{"skill":"","question":"","options":["","","",""],"correct":0}]
`;

  const interaction = await ai.interactions.create({
    model: 'gemini-3.8-flash',
    input: prompt,
  });

  const rawText = interaction.output_text.trim();
  const cleanJson = rawText.replace(/```json|```/g, '').trim();

  return JSON.parse(cleanJson);
}

export async function generateCvContentFromAI(skills, jobDescription) {
  const ai = getAiInstance();

  const prompt = `
Job: "${jobDescription}"
Skills: ${skills.map((s) => s.name).join(', ')}

Buatkan konten CV ATS ringkas berbasis kata kunci job.
Format JSON murni tanpa markdown:
{
  "summary": "Ringkasan profesional 2-3 kalimat yang relevan dengan job.",
  "highlights": [
    "Poin kualifikasi 1 relevan dengan job",
    "Poin kualifikasi 2 relevan dengan job",
    "Poin kualifikasi 3 relevan dengan job"
  ]
}
`;

  const interaction = await ai.interactions.create({
    model: 'gemini-2.5-flash',
    input: prompt,
  });

  const rawText = interaction.output_text.trim();
  const cleanJson = rawText.replace(/```json|```/g, '').trim();

  return JSON.parse(cleanJson);
}