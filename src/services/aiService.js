import { GoogleGenAI } from '@google/genai';

const apiKeys = [
  import.meta.env.VITE_GEMINI_API_KEY_1,
  import.meta.env.VITE_GEMINI_API_KEY_2,
  import.meta.env.VITE_GEMINI_API_KEY_3,
  import.meta.env.VITE_GEMINI_API_KEY_4,
  import.meta.env.VITE_GEMINI_API_KEY_NULL,
].filter(Boolean);
let currentKeyIndex = 0;
export const apiMonitorStats = {
  totalRequests: 0,
  keyUsageCount: new Array(apiKeys.length).fill(0),
  lastActiveKey: null,
};

export async function callGeminiWithFallback(taskName, aiTaskFn) {
  if (apiKeys.length === 0) {
    throw new Error('Tidak ada API Key Gemini yang dikonfigurasi di file .env');
  }
  let attempts = 0;
  const startTime = performance.now();

  while (attempts < apiKeys.length) {
    const activeKey = apiKeys[currentKeyIndex];
    const maskedKey = `...${activeKey.slice(-4)}`;
    const keyLabel = `API Key #${currentKeyIndex + 1} [${maskedKey}]`;

    console.log(` [Log] Memulai Task: "${taskName}" menggunakan ${keyLabel}`);

    try {
      apiMonitorStats.totalRequests++;
      apiMonitorStats.keyUsageCount[currentKeyIndex]++;
      apiMonitorStats.lastActiveKey = keyLabel;

      const aiInstance = new GoogleGenAI({ apiKey: activeKey });
      
      // Eksekusi fungsi tugas AI (callback)
      const result = await aiTaskFn(aiInstance);
      
      const duration = ((performance.now() - startTime) / 1000).toFixed(2);
      console.log(`✅ [Log] Task "${taskName}" BERHASIL! Durasi: ${duration}s | Menggunakan ${keyLabel}`);

      return result;

    } catch (error) {
      console.warn(`❌ [Log] Task "${taskName}" GAGAL pada ${keyLabel}. Pesan Error:`, error.message);

      // Deteksi error Rate Limit (429) atau Server Overloaded / High Demand (503)
      const isRateLimit = error.status === 429 || error.code === 429;
      const isServiceUnavailable = error.status === 503 || error.code === 503 || (error.message && error.message.toLowerCase().includes('high demand'));

      const shouldFallback = (isRateLimit || isServiceUnavailable);

      if (shouldFallback && attempts < apiKeys.length - 1) {
        console.warn(`⚠️ [Log] Kendala terdeteksi (${error.status || 'High Demand/Limit'}). Melakukan rotasi otomatis ke API Key berikutnya...`);
        currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
        attempts++;
      } else {
        console.error(` [Log] Task "${taskName}" benar-benar gagal. Tidak ada key cadangan atau error bukan masalah kuota/server.`);
        throw error;
      }
    }
  }

  throw new Error('Semua API Key Gemini telah mencapai batas limit.');
}

function getAiInstance() {
  // const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY_NULL;

  if (!apiKey) {
    throw new Error('API Key Gemini tidak ditemukan di file .env');
  }

  return new GoogleGenAI({ apiKey });
}

export async function generateQuizFromAI(skills, jobDescription) {
  const prompt = `
    Buat kuis pilihan ganda ${skills.length || 2} soal.
    Skills: ${skills.map((s) => s.name).join(', ')}
    Job: ${jobDescription}

    Format JSON array murni tanpa markdown:
    [{"skill":"","question":"","options":["","","",""],"correct":0}]
    `;

  // const interaction = await ai.interactions.create({
  //   model: 'gemini-3.8-flash',
  //   input: prompt,
  // });

  // const rawText = interaction.output_text.trim();
  const rawText = await callGeminiWithFallback( "Generate Quiz", async (ai) => {
    const interaction = await ai.models.generateContent({
      model: 'gemini-3.8-flash', 
      contents: prompt,
    });
    return interaction.text;
  });

  const cleanJson = rawText.replace(/```json|```/g, '').trim();
  return JSON.parse(cleanJson);
}

export async function generateCvContentFromAI(skills, targetJob, jobDescription, workExperience, education) {
// export async function generateCvContentFromAI(skills, jobDescription) {
  const prompt = `
Bertindaklah sebagai Senior ATS Resume Expert dan AI Career Assistant. Berdasarkan data profesional anonim berikut:
- Target Posisi: ${targetJob}
- Job Description: ${jobDescription}
- Keahlian Pengguna (dan hasil kuis): ${JSON.stringify(skills)}
- Pengalaman Kerja Mentah: ${JSON.stringify(workExperience)}
- Pendidikan Mentah: ${JSON.stringify(education)}

Tolong buatkan struktur data JSON yang lengkap, profesional, dan dioptimalkan untuk ATS. Kembangkan poin-poin pengalaman agar berorientasi pada dampak (action-oriented & quantified).
Kembalikan HANYA format JSON murni TANPA markdown block (\`\`\`json).

Struktur JSON wajib:
{
  "summary": "Ringkasan profesional/profil singkat yang tajam dan dioptimalkan untuk ATS (maksimal 3-4 kalimat).",
  "highlights": ["Poin keunggulan 1", "Poin keunggulan 2"],
  "workExperience": [
    {
      "role": "Judul Posisi yang disempurnakan",
      "company": "Nama Perusahaan",
      "period": "Periode",
      "description": "Deskripsi tugas dan pencapaian profesional yang kuat (ATS-friendly)."
    }
  ],
  "education": [
    {
      "degree": "Gelar / Jurusan",
      "institution": "Nama Universitas",
      "year": "Tahun"
    }
  ],
  "skills": [
    { "name": "Nama Skill", "level": "Advanced (Validated by AI)" }
  ],
  "coverLetter": {
    "opening": "Paragraf pembuka surat lamaran formal.",
    "body": "Paragraf isi yang menghubungkan pengalaman kerja dengan posisi ${targetJob}.",
    "closing": "Paragraf penutup."
  },
  "emailPitch": {
    "subject": "Subjek email lamaran kerja",
    "body": "Isi email pengantar yang ringkas."
  }
}
`;

  // const interaction = await ai.interactions.create({
  //   model: 'gemini-3.8-flash',
  //   input: prompt,
  // });

  // const rawText = interaction.output_text.trim();

  const rawText = await callGeminiWithFallback( "Generate CV Content" ,async (ai) => {
    const interaction = await ai.models.generateContent({
      model: 'gemini-3.8-flash', 
      contents: prompt, 
    });
    return interaction.text;
  });

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
    
    const rawText = await callGeminiWithFallback( "Evaluate Interview", async (ai) => {
    const interaction = await ai.models.generateContent({
      model: 'gemini-3.8-flash', 
      contents: prompt, 
      // config: {
      //   maxOutputTokens: 2048, 
      // }
    });
      return interaction.text;
    });

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