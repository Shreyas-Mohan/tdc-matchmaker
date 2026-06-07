import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import Customer from '../models/Customer.js';

dotenv.config();

// Configuration arrays for realistic demographic distribution
const INDIAN_CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata', 'Ahmedabad'];
const RELIGIONS = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain'];
const CASTES = ['Agarwal', 'Sharma', 'Iyer', 'Nair', 'Verma', 'Gupta', 'Reddy', 'Joshi', 'General'];
const LANGUAGES = ['Hindi', 'English', 'Bengali', 'Telugu', 'Marathi', 'Tamil', 'Gujarati', 'Kannada'];
const DEGREES = ['B.Tech', 'M.Tech', 'MBA', 'MBBS', 'B.Com', 'MCA', 'BBA', 'MS'];
const COLLEGES = ['IIT', 'NIT', 'BITS Pilani', 'IIM', 'Delhi University', 'SRM', 'VIT', 'BITS', 'Local State University'];

const DESIGNATIONS = {
  Engineering: ['Software Engineer', 'Senior Software Engineer', 'Engineering Manager', 'Data Scientist', 'DevOps Engineer'],
  Management: ['Product Manager', 'Business Analyst', 'Consultant', 'Financial Analyst', 'HR Manager'],
  Medical: ['General Physician', 'Resident Doctor', 'Dentist']
};

const COMPANIES = ['Google', 'Microsoft', 'TCS', 'Infosys', 'Accenture', 'Deloitte', 'Amazon', 'McKinsey', 'Apollo Hospitals'];

/**
 * Helper to compute an absolute date based on a target age range
 */
const generateDOB = (minAge, maxAge) => {
  const currentYear = new Date().getFullYear();
  const targetAge = faker.number.int({ min: minAge, max: maxAge });
  const birthYear = currentYear - targetAge;
  const month = faker.number.int({ min: 0, max: 11 });
  const day = faker.number.int({ min: 1, max: 28 });
  return new Date(birthYear, month, day);
};

/**
 * Generates data arrays matching the database schema
 */
const generateProfiles = (count, gender) => {
  const profiles = [];

  for (let i = 0; i < count; i++) {
    const isMale = gender === 'Male';
    
    // Establishing statistically sound ranges for the initial matching baseline
    const dob = isMale ? generateDOB(26, 34) : generateDOB(22, 30);
    const heightCm = isMale ? faker.number.int({ min: 165, max: 188 }) : faker.number.int({ min: 150, max: 172 });
    const incomeLPA = isMale ? faker.number.int({ min: 12, max: 45 }) : faker.number.int({ min: 6, max: 35 });

    const jobCategory = faker.helpers.arrayElement(['Engineering', 'Management', 'Medical']);
    const designation = faker.helpers.arrayElement(DESIGNATIONS[jobCategory]);

    const religion = faker.helpers.arrayElement(RELIGIONS);
    const caste = religion === 'Hindu' ? faker.helpers.arrayElement(CASTES) : 'Not Applicable';

    const firstName = isMale ? faker.person.firstName('male') : faker.person.firstName('female');
    const lastName = faker.person.lastName();

    profiles.push({
      firstName,
      lastName,
      gender,
      dob,
      heightCm,
      maritalStatus: faker.helpers.arrayElement(['Never Married', 'Divorced']),
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      phone: faker.string.numeric({ length: 10, allowLeadingZeros: false }),
      country: 'India',
      city: faker.helpers.arrayElement(INDIAN_CITIES),
      undergradCollege: faker.helpers.arrayElement(COLLEGES),
      degree: faker.helpers.arrayElement(DEGREES),
      currentCompany: faker.helpers.arrayElement(COMPANIES),
      designation,
      incomeLPA,
      languagesKnown: faker.helpers.arrayElements(LANGUAGES, { min: 2, max: 4 }),
      siblings: faker.number.int({ min: 0, max: 3 }),
      religion,
      caste,
      wantKids: faker.helpers.arrayElement(['Yes', 'No', 'Maybe']),
      openToRelocate: faker.helpers.arrayElement(['Yes', 'No', 'Maybe']),
      openToPets: faker.helpers.arrayElement(['Yes', 'No', 'Maybe']),
      dietaryPreference: faker.helpers.arrayElement(['Vegetarian', 'Non-Vegetarian', 'Eggetarian']),
      familyType: faker.helpers.arrayElement(['Nuclear', 'Joint', 'Flexible']),
      motherTongue: faker.helpers.arrayElement(LANGUAGES),
      statusTag: 'Active'
    });
  }

  return profiles;
};

/**
 * Main execution block to flush and seed the collection
 */
const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Database connection established for seeding.');

    // Clear existing customer data to avoid unique index constraints on email
    await Customer.deleteMany({});
    console.log('Existing customer records cleared.');

    const maleProfiles = generateProfiles(50, 'Male');
    const femaleProfiles = generateProfiles(50, 'Female');
    const totalRecords = [...maleProfiles, ...femaleProfiles];

    await Customer.insertMany(totalRecords);
    console.log(`Database seeding completed successfully. Inserted ${totalRecords.length} profiles.`);
    
    process.exit(0);
  } catch (error) {
    console.error(`Seeding execution failed: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();