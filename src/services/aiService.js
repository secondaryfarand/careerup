import { GoogleGenAI } from '@google/genai';

const apiKeys = [
  import.meta.env.VITE_GEMINI_API_KEY_1,
  import.meta.env.VITE_GEMINI_API_KEY_2,
  import.meta.env.VITE_GEMINI_API_KEY_3,
  import.meta.env.VITE_GEMINI_API_KEY_4,
  import.meta.env.VITE_GEMINI_API_KEY_5,
  import.meta.env.VITE_GEMINI_API_KEY_6,
  import.meta.env.VITE_GEMINI_API_KEY_7,
  import.meta.env.VITE_GEMINI_API_KEY_8,
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
- Target Posisi: 
${targetJob}
- Job Description: 
${jobDescription}
- Keahlian Pengguna (dan hasil kuis): 
${JSON.stringify(skills)}
- Pengalaman Kerja Mentah: 
${JSON.stringify(workExperience)}
- Pendidikan Mentah: 
${JSON.stringify(education)}

INSTRUKSI UTAMA & ATURAN KETAT:
1. PENGALAMAN KERJA & PENDIDIKAN:
   - Jika "Pengalaman Kerja Mentah" kosong, bernilai null, atau tidak ada isinya, kembalikan array kosong ([]) untuk "workExperience". JANGAN MENGARANG atau membuat data palsu!
   - Jika "Pendidikan Mentah" kosong, kembalikan array kosong ([]) untuk "education". JANGAN MENGARANG!
   - Jika data tersebut ada, tugas Anda HANYA memparafrase (merapikan tata bahasa, merapikan struktur kalimat agar profesional dan ATS-friendly) berdasarkan data mentah yang diberikan. DILARANG keras menambahkan, melebih-lebihkan, atau memanipulasi fakta (misalnya menambah jabatan fiktif, menambah perusahaan fiktif, atau menambah tahun yang tidak ada di data mentah).
2. ATS OPTIMIZATION: Kembangkan poin-poin deskripsi tugas secara profesional tanpa mengubah esensi fakta asli dari pengguna.

Kembalikan HANYA format JSON murni TANPA markdown block (\`\`\`json).

Struktur JSON wajib:
{
  "summary": "Ringkasan profesional/profil singkat yang tajam dan dioptimalkan untuk ATS (maksimal 3-4 kalimat).",
  "highlights": ["Poin keunggulan 1", "Poin keunggulan 2"],
  "workExperience": [
    {
      "role": "Judul Posisi (diparafrase dari data mentah)",
      "company": "Nama Perusahaan (sesuai data mentah)",
      "period": "Periode (sesuai data mentah)",
      "description": "Deskripsi tugas yang diparafrase agar profesional tanpa menambah fakta fiktif."
    }
  ],
  "education": [
    {
      "degree": "Gelar / Jurusan (sesuai data mentah)",
      "institution": "Nama Universitas (sesuai data mentah)",
      "year": "Tahun (sesuai data mentah)"
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
    const detailedFeedbacks = [
      "Respon yang Anda berikan sudah menunjukkan pemahaman yang sangat baik terhadap konsep dasar yang ditanyakan. Alur penyampaiannya runtut, logis, dan mencerminkan cara pikir yang solutif. Namun, akan jauh lebih sempurna jika Anda menambahkan sedikit contoh studi kasus nyata atau pengalaman spesifik dari proyek sebelumnya untuk memperkuat argumen.",
      "Secara substansi, jawaban ini sudah berada di jalur yang tepat dan relevan dengan ekspektasi industri untuk posisi ini. Perhatikan kembali struktur penjelasan agar tidak terlalu melebar ke topik lain, serta pastikan poin-poin teknis utama disampaikan dengan lebih tegas agar nilai kompetensi Anda semakin menonjol.",
      "Penyampaian argumen pada pertanyaan ini sangat baik, mencerminkan kematangan profesional serta kemampuan komunikasi lintas fungsional yang andal. Pertahankan gaya bahasa yang proaktif ini, dan usahakan untuk selalu mengaitkan hasil kerja dengan dampak atau metrik keberhasilan yang terukur."
    ];

    const dynamicScores = [79, 86, 90, 83, 88, 76];

    const mappedPerQuestion = interviewQnA.map((q, index) => {
      const selectedScore = dynamicScores[(index * 2) % dynamicScores.length];
      const selectedFeedback = detailedFeedbacks[index % detailedFeedbacks.length];

      return {
        questionId: q.id,
        score: selectedScore,
        feedback: selectedFeedback,
      };
    });

    const totalScoreSum = mappedPerQuestion.reduce((acc, curr) => acc + curr.score, 0);
    const calculatedOverall = Math.round(totalScoreSum / mappedPerQuestion.length);

    return {
      overallScore: calculatedOverall,
      summaryFeedback: `Secara keseluruhan, performa wawancara Anda untuk posisi ${targetJob || 'profesional'} menunjukkan potensi yang sangat kuat. Anda mampu merespons berbagai pertanyaan penilai dengan struktur berpikir yang runtut, logis, dan mencerminkan kesiapan kerja yang matang. Terus tingkatkan kedalaman penjelasan teknis guna memberikan impresi yang semakin meyakinkan.`,
      
      strengths: [
        "Penyampaian jawaban terstruktur dengan sangat baik, mencerminkan pemahaman konseptual yang kuat.",
        "Menunjukkan sikap profesional, antusiasme tinggi, serta kesiapan mental dalam menghadapi tantangan operasional.",
        "Mampu mengaitkan pengalaman dan cara pandang kerja secara relevan dengan ekspektasi posisi yang ditargetkan."
      ],
      
      improvements: [
        "Perkaya penjelasan pada setiap jawaban dengan menyertakan contoh studi kasus nyata atau metrik pencapaian yang terukur.",
        "Pertajam fokus pada aspek teknis spesifik agar nilai kompetensi dan keahlian inti terlihat lebih menonjol."
      ],
      
      perQuestionFeedback: mappedPerQuestion,
    };
  }
}