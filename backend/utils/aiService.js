import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const aiClient = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
  timeout: 10000, // 10 seconds timeout to prevent hanging requests
});

// Basic Matching Algorithm
export const rankWithBasicAI = async (primaryCustomer, candidateProfiles) => {
  if (!candidateProfiles || candidateProfiles.length === 0) return [];

  const systemPrompt = `You are a matchmaking AI. Analyze the primary profile against the candidates.
Return a JSON object containing a "rankings" array. Each object must have:
- "candidateId": String (the _id)
- "score": Number (1-100)
- "reasoningTag": String (e.g. "Demographic Match")
- "explanation": String (1 sentence why they match).`;

  const userContent = JSON.stringify({ primary: primaryCustomer, candidates: candidateProfiles });

  try {
    const response = await aiClient.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userContent }],
      response_format: { type: 'json_object' },
      temperature: 0.3
    });
    return JSON.parse(response.choices[0].message.content).rankings || [];
  } catch (error) {
    console.error(`Basic AI failed: ${error.message}`);
    return [];
  }
};

// Advanced Match Explanation
export const explainAdvancedMathScores = async (primaryCustomer, mathematicallyScoredCandidates) => {
  if (!mathematicallyScoredCandidates || mathematicallyScoredCandidates.length === 0) return [];

  const systemPrompt = `You are an expert matchmaking analyst. I have already mathematically scored these candidates out of 100 based on strict compatibility weights (Diet, Family, Income). 
Your job is NOT to change the score. Your job is to read their profiles and generate a deeply human 1-sentence "explanation" and a 2-word "reasoningTag" for WHY this mathematical score makes sense.
Return a JSON object containing an "insights" array with: "candidateId", "reasoningTag", and "explanation".`;

  const userContent = JSON.stringify({ primary: primaryCustomer, scoredCandidates: mathematicallyScoredCandidates });

  try {
    const response = await aiClient.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userContent }],
      response_format: { type: 'json_object' },
      temperature: 0.5
    });
    return JSON.parse(response.choices[0].message.content).insights || [];
  } catch (error) {
    console.error(`Advanced AI explanation failed: ${error.message}`);
    return [];
  }
};

// Match Introduction Email Generator
export const generatePersonalizedIntro = async (primaryCustomer, matchCandidate) => {
  const prompt = `Draft a compelling personalized introduction email (3 sentences max) from a matchmaker introducing ${matchCandidate.firstName} to ${primaryCustomer.firstName}. Highlight common values like their ${matchCandidate.familyType} family preference or ${matchCandidate.dietaryPreference} diet. Keep it professional.`;

  try {
    const response = await aiClient.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    });
    return response.choices[0].message.content.trim();
  } catch (error) {
    return `Hello ${primaryCustomer.firstName}, I highly recommend reviewing ${matchCandidate.firstName}'s profile as your lifestyle parameters align closely.`;
  }
};