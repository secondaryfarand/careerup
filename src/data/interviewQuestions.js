export const QUESTION_BANK = [
  {
    id: 1,
    category: 'Teknis',
    type: 'experience',
    getQuestion: (job) =>
      `Ceritakan pengalaman dan keahlian utama Anda di bidang ${job || 'posisi yang anda lamar'}, serta apa saja tanggung jawab utama yang pernah Anda pegang?`,
  },
  {
    id: 2,
    category: 'Teknis',
    type: 'problem_solving',
    getQuestion: (job) =>
      `Apa kendala atau masalah teknis tersulit yang pernah Anda alami saat bekerja di bidang ${job || 'yang anda lamar'}, dan bagaimana langkah-langkah Anda mengatasinya?`,
  },
  {
    id: 3,
    category: 'Teknis',
    type: 'workflow',
    getQuestion: () =>
      'Bagaimana cara Anda memastikan kualitas pekerjaan Anda tetap sesuai dengan prosedur kerja dan standar industri?',
  },

  // 3 Pertanyaan Personal / HR
  {
    id: 4,
    category: 'Personal & Soft Skill',
    type: 'swot',
    getQuestion: () =>
      'Menurut Anda, apa kelebihan utama dan kekurangan terbesar yang sedang Anda berusaha perbaiki saat ini?',
  },
  {
    id: 5,
    category: 'Personal & Soft Skill',
    type: 'softskills',
    getQuestion: () =>
      'Soft skill apa yang paling menunjang performa kerja Anda, dan berikan contoh penerapannya dalam lingkungan kerja!',
  },
  {
    id: 6,
    category: 'Personal & Soft Skill',
    type: 'teamwork',
    getQuestion: () =>
      'Bagaimana cara Anda menyelesaikan perbedaan pendapat atau konflik ketika bekerja sama dalam sebuah tim proyek?',
  },
];

export function getRandomThreeQuestions(targetJob) {
  const shuffled = [...QUESTION_BANK].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 3);

  return selected.map((q) => ({
    id: q.id,
    category: q.category,
    questionText: q.getQuestion(targetJob),
  }));
}