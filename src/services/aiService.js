import { GoogleGenAI, Type } from '@google/genai';

function getAiInstance() {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('API Key Gemini tidak ditemukan.');
  }

  // Tambahkan options apiVersion: 'v1'
  return new GoogleGenAI({ 
    apiKey,
    options: { apiVersion: 'v1' } 
  });
}

export async function generateQuizFromAI(skills, jobDescription) {
  const ai = getAiInstance();

  const prompt = `
Buatkan kuis pilihan ganda sebanyak ${skills.length || 2} soal untuk menguji pemahaman teknis/praktis pelamar.
Daftar Keahlian: ${skills.map((s) => s.name).join(', ')}
Target Pekerjaan: ${jobDescription}
`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            skill: { type: Type.STRING },
            question: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            correct: { type: Type.INTEGER },
          },
          required: ['skill', 'question', 'options', 'correct'],
        },
      },
    },
  });

  return JSON.parse(response.text);
}

export async function generateCvSummaryFromAI(personalInfo, skills, jobDescription, score) {
  const ai = getAiInstance();

  const prompt = `
Kamu adalah profesional pembuat CV ATS berpengalaman.
Buatkan ringkasan profesional (Professional Summary) 3-4 kalimat dalam bahasa Indonesia yang ringkas, persuasif, dan kaya kata kunci (keywords) sesuai deskripsi pekerjaan berikut:
"${jobDescription}"

Data Pengguna:
- Nama: ${personalInfo.fullName}
- Skill Utama: ${skills.map((s) => s.name).join(', ')}
- Hasil Validasi Kuis Skill: ${score}/100

Kembalikan respon HANYA dalam bentuk teks paragraf ringkasan tanpa tanda petik atau teks pembuka.
`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
    },
  });

  return response.text.trim();
}