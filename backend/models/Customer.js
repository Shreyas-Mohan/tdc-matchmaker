import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  // Personal Identification & Core Demographics
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  dob: { type: Date, required: true },
  heightCm: { type: Number, required: true },
  maritalStatus: { type: String, enum: ['Never Married', 'Divorced', 'Widowed'], required: true },
  
  // Contact Information
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  
  // Location Data
  country: { type: String, required: true, default: 'India' },
  city: { type: String, required: true, trim: true },
  
  // Professional & Financial Metrics
  undergradCollege: { type: String, trim: true },
  degree: { type: String, trim: true },
  currentCompany: { type: String, trim: true },
  designation: { type: String, trim: true },
  incomeLPA: { type: Number, required: true },
  
  // Background & Core Alignment Fields
  languagesKnown: [{ type: String }],
  siblings: { type: Number, default: 0 },
  religion: { type: String, required: true },
  caste: { type: String, default: 'General' },
  
  // Preferences & Dealbreakers
  wantKids: { type: String, enum: ['Yes', 'No', 'Maybe'], required: true },
  openToRelocate: { type: String, enum: ['Yes', 'No', 'Maybe'], required: true },
  openToPets: { type: String, enum: ['Yes', 'No', 'Maybe'], required: true },
  
  // Cultural Context Factors
  dietaryPreference: { type: String, enum: ['Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Vegan'], required: true },
  familyType: { type: String, enum: ['Nuclear', 'Joint', 'Flexible'], required: true },
  motherTongue: { type: String, required: true },
  
  notes:{type: String, default:''},

  // Operational Pipeline State
  statusTag: { type: String, enum: ['New', 'Active', 'On Hold', 'Matched'], default: 'New' }
}, { 
  timestamps: true 
});

// Indexing critical query fields for optimized matching logic execution
customerSchema.index({ gender: 1, incomeLPA: 1, dob: 1 });

const Customer = mongoose.model('Customer', customerSchema);
export default Customer;