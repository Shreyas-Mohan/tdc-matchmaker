import Customer from '../models/Customer.js';
import {generatePersonalizedIntro } from '../utils/aiService.js';
import { runBasicAlgorithm } from '../utils/basicAlgo.js';
import { runAdvancedAlgorithm } from '../utils/advancedAlgo.js';
/**
 * Calculates accurate chronological age from DOB string without offset bugs
 */
const calculateAge = (dob) => {
  const diffMs = Date.now() - new Date(dob).getTime();
  const ageDate = new Date(diffMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

/**
 * GET /api/customers
 * Retrieves active dashboard user records managed by the matchmaker
 */
export const getAllCustomers = async (req, res) => {
  // Pulling base fields required for the main dashboard list view
  const customers = await Customer.find({}, 'firstName lastName gender dob city maritalStatus statusTag incomeLPA');
  res.json(customers);
};

/**
 * GET /api/customers/:id
 * Fetches targeted customer detail card profile metrics
 */
export const getCustomerById = async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    return res.status(404).json({ message: 'Customer record not found.' });
  }
  res.json(customer);
};

/**
 * GET /api/customers/:id/matches
 * Executes the core two-stage gender-specific filtering engine
 */
// Cache match results temporarily
const matchCache = new Map();
const CACHE_TTL = 1000 * 60 * 60; // 1 Hour Time-to-Live
export const getPotentialMatches = async (req, res) => {
  const customerId = req.params.id;
  const algoType = req.query.algo || 'basic'; 
  const cacheKey = `${customerId}_${algoType}`;

  if (matchCache.has(cacheKey)) {
    const cachedData = matchCache.get(cacheKey);
    if (Date.now() - cachedData.timestamp < CACHE_TTL) {
      return res.json(cachedData.matches);
    } else {
      matchCache.delete(cacheKey);
    }
  }

  const user = await Customer.findById(customerId);
  if (!user) return res.status(404).json({ message: 'Profile not found.' });

  // 1. Baseline filters
  const queryConditions = {
    gender: user.gender === 'Male' ? 'Female' : 'Male',
    statusTag: 'Active'
  };

  // 2. Apply demographic gating if in 'basic' mode
  if (algoType === 'basic') {
    if (user.gender === 'Male') {
      queryConditions.dob = { $gt: user.dob }; 
      queryConditions.incomeLPA = { $lt: user.incomeLPA }; 
      queryConditions.heightCm = { $lt: user.heightCm }; 
      queryConditions.wantKids = user.wantKids; 
    } else {
      if (user.openToRelocate !== 'Maybe') {
        queryConditions.openToRelocate = { $in: [user.openToRelocate, 'Maybe'] };
      }
      queryConditions.religion = user.religion;
    }
  }

  // 3. Fetch candidates
  const basePool = await Customer.find(queryConditions).limit(20).lean();
  if (basePool.length === 0) return res.json([]);
  
  // 4. Execute matching algorithm
  let finalMatches = [];
  if (algoType === 'advanced') {
    // Advanced algorithm receives the broader pool and uses math to rank them
    finalMatches = await runAdvancedAlgorithm(user, basePool);
  } else {
    // Basic algorithm receives the strictly gated pool and lets Groq guess the scores
    finalMatches = await runBasicAlgorithm(user, basePool);
  }

  matchCache.set(cacheKey, { timestamp: Date.now(), matches: finalMatches });
  res.json(finalMatches);
};

/**
 * POST /api/customers/:id/send-match
 * Compiles a mock matching email body with an automated custom introduction
 */
export const sendMatchAction = async (req, res) => {
  const { candidateId } = req.body;
  
  const user = await Customer.findById(req.params.id);
  const candidate = await Customer.findById(candidateId);

  if (!user || !candidate) {
    return res.status(404).json({ message: 'Involved matching profiles are invalid.' });
  }

  const generatedEmailBody = await generatePersonalizedIntro(user, candidate);

  // Return mock confirmation payload
  res.json({
    success: true,
    recipientEmail: user.email,
    subject: `TDC Matchmaker: Curated Profile Selection - ${candidate.firstName}`,
    emailContent: generatedEmailBody,
    mockedPayload: {
      candidateName: `${candidate.firstName} ${candidate.lastName}`,
      contactPhone: candidate.phone,
      metrics: { age: calculateAge(candidate.dob), income: `${candidate.incomeLPA} LPA`, city: candidate.city }
    }
  });
};

// Update customer notes
export const updateCustomerNotes = async (req, res) => {
  try {
    const customerId = req.params.id;
    const { notes } = req.body;

    const updatedCustomer = await Customer.findByIdAndUpdate(
      customerId,
      { notes: notes },
      { returnDocument: 'after' } // Returns the updated document
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Profile not found.' });
    }

    res.json({ message: 'Notes saved successfully', notes: updatedCustomer.notes });
  } catch (error) {
    console.error(`Failed to save notes: ${error.message}`);
    res.status(500).json({ message: 'Server error while saving notes.' });
  }
};