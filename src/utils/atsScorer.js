function tokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)           
    .filter((word) => word.length > 2); 
}

export function calculateAtsScore(jobDescription, cvContent) {
  if (!jobDescription || !cvContent) {
    return { score: 0, matchedKeywords: [] };
  }

  const jobTokens = tokenize(jobDescription);
  const cvTokens = tokenize(cvContent);

  if (jobTokens.length === 0 || cvTokens.length === 0) {
    return { score: 0, matchedKeywords: [] };
  }

  const vocab = Array.from(new Set([...jobTokens, ...cvTokens]));

  const jobVector = vocab.map((word) =>
    jobTokens.filter((token) => token === word).length
  );
  const cvVector = vocab.map((word) =>
    cvTokens.filter((token) => token === word).length
  );

  let dotProduct = 0;
  let jobMagnitude = 0;
  let cvMagnitude = 0;

  for (let i = 0; i < vocab.length; i++) {
    dotProduct += jobVector[i] * cvVector[i];
    jobMagnitude += jobVector[i] * jobVector[i];
    cvMagnitude += cvVector[i] * cvVector[i];
  }

  jobMagnitude = Math.sqrt(jobMagnitude);
  cvMagnitude = Math.sqrt(cvMagnitude);

  // Cosine Similarity: (A · B) / (||A|| * ||B||)
  if (jobMagnitude === 0 || cvMagnitude === 0) {
    return { score: 0, matchedKeywords: [] };
  }

  const similarity = dotProduct / (jobMagnitude * cvMagnitude);
  const percentageScore = Math.min(Math.round(similarity * 100 * 1.5), 100);

  
  const matchedKeywords = Array.from(
    new Set(jobTokens.filter((token) => cvTokens.includes(token)))
  );

  return {
    score: percentageScore,
    matchedKeywords,
  };
}