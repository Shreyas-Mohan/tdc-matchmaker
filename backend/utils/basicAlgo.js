import { rankWithBasicAI } from './aiService.js';

export const runBasicAlgorithm = async (user, basePool) => {
  if (basePool.length === 0) return [];

  // 1. Pass raw pool directly to Groq to invent scores
  const aiRankings = await rankWithBasicAI(user, basePool);

  // 2. Map AI generated scores back to the profiles
  return basePool.map(candidate => {
    const aiInsight = aiRankings.find(r => r.candidateId === candidate._id.toString());
    return {
      ...candidate,
      matchScore: aiInsight ? aiInsight.score : 70,
      reasoningTag: aiInsight ? aiInsight.reasoningTag : 'Standard Match',
      explanation: aiInsight ? aiInsight.explanation : 'Demographic parameters align successfully.'
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
};