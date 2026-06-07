import { explainAdvancedMathScores } from './aiService.js';

const calculateMathScore = (primary, candidate) => {
  let score = 0;

  // 1. Dietary Alignment (Weight: 35%)
  if (primary.dietaryPreference === candidate.dietaryPreference) {
    score += 35;
  } else if ((primary.dietaryPreference === 'Vegetarian' && candidate.dietaryPreference === 'Eggetarian') || 
             (primary.dietaryPreference === 'Eggetarian' && candidate.dietaryPreference === 'Vegetarian')) {
    score += 15; // Partial compatibility
  }

  // 2. Family Setup Alignment (Weight: 25%)
  if (primary.familyType === candidate.familyType) {
    score += 25;
  } else if (primary.familyType === 'Flexible' || candidate.familyType === 'Flexible') {
    score += 15; // Flexible adapts to anything
  }

  // 3. Relocation & City (Weight: 20%)
  if (primary.city === candidate.city) {
    score += 20;
  } else if (candidate.openToRelocate === 'Yes') {
    score += 15;
  }

  // 4. Base Core Values (Weight: 20%)
  if (primary.wantKids === candidate.wantKids) score += 10;
  if (primary.religion === candidate.religion) score += 10;

  // Apply minimum baseline score threshold
  return Math.max(score, 40); 
};

export const runAdvancedAlgorithm = async (user, basePool) => {
  if (basePool.length === 0) return [];

  // 1. Calculate deterministic math scores
  const scoredCandidates = basePool.map(candidate => ({
    ...candidate,
    matchScore: calculateMathScore(user, candidate)
  }));

  // Sort by highest math score first, take the top 10
  const topCandidates = scoredCandidates.sort((a, b) => b.matchScore - a.matchScore).slice(0, 10);

  // 2. Generate explanations for math scores
  const aiInsights = await explainAdvancedMathScores(user, topCandidates);

  // 3. Merge textual reasoning with math score
  return topCandidates.map(candidate => {
    const insight = aiInsights.find(r => r.candidateId === candidate._id.toString());
    return {
      ...candidate,
      reasoningTag: insight ? insight.reasoningTag : 'High Compatibility',
      explanation: insight ? insight.explanation : `Mathematically aligned based on ${candidate.dietaryPreference} diet and Family setup.`
    };
  });
};