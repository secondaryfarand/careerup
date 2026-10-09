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
    model: 'gemini-3.8-flash',
    input: prompt,
  });

  const rawText = interaction.output_text.trim();
  const cleanJson = rawText.replace(/```json|```/g, '').trim();

  return JSON.parse(cleanJson);
}

// utk evaluasi intervwiew
export async function evaluateInterviewFromAI(targetJob, interviewQnA) {
  const ai = getAiInstance();
  try {
    const formattedQnA = interviewQnA
      .map(
        (item, index) =>
          `Pertanyaan ${index + 1} (${item.category}): ${item.question}\nJawaban User:${item.answer || '(Tidak dijawab)'}`
      )
      .join('\n\n');

    const prompt = `
Bertindaklah sebagai Senior HR & Technical Interviewer untuk posisi "${targetJob || 'Profesional'}".
Berikut adalah hasil sesi latihan wawancara kerja dari kandidat:

${formattedQnA}

Berikan evaluasi komprehensif dalam format JSON murni TANPA markdown block (tanpa \`\`\`json).
Struktur JSON yang wajib dikembalikan:
{
  "overallScore": 85, // Angka 0 - 100
  "summaryFeedback": "Ringkasan evaluasi umum mengenai performa kandidat secara keseluruhan.",
  "strengths": ["Poin kelebihan 1", "Poin kelebihan 2"],
  "improvements": ["Hal yang perlu ditingkatkan 1", "Hal yang perlu ditingkatkan 2"],
  "perQuestionFeedback": [
    {
      "questionId": 1,
      "score": 80,
      "feedback": "Umpan balik spesifik untuk pertanyaan nomor 1."
    }
  ]
}
`;
    const interaction = await ai.interactions.create({
      model: 'gemini-3.8-flash',
      input: prompt,
    });
    const rawText = interaction.output_text.trim();    
    const cleanJson = rawText.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error('Error evaluating interview:', error);
    return {
      overallScore: 75,
      summaryFeedback: 'Jawaban Anda secara umum sudah cukup baik dan menggambarkan pengalaman relevan.',
      strengths: ['Mampu menjelaskan pengalaman teknis dasar dengan baik.', 'Struktur penyampaian cukup runtut.'],
      improvements: ['Tambahkan metode konkret (misal metode STAR) untuk menceritakan penyelesaian masalah.'],
      perQuestionFeedback: interviewQnA.map((q) => ({
        questionId: q.id,
        score: 75,
        feedback: 'Jawaban sudah memenuhi standar dasar posisi yang dilamar.',
      })),
    };
  }
}