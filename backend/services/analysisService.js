const pdfParse = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function analyzeResume(fileBuffer) {
  let pdfText = '';
try {
  pdfText = (await pdfParse(fileBuffer)).text;
} catch (e) {
  throw new Error('Invalid or corrupted PDF. Unable to extract text.');
}

  const prompt = `You are an expert technical recruiter and career coach. Analyze the following resume text and extract the information into a valid JSON object. The JSON object must conform to the following structure, and all fields must be populated. Do not include any text or markdown formatting before or after the JSON object.

Resume Text:
"""
${pdfText}
"""

JSON Structure:
{
  "name": "string | null",
  "email": "string | null",
  "phone": "string | null",
  "linkedin_url": "string | null",
  "portfolio_url": "string | null",
  "summary": "string | null",
  "work_experience": [{ "role": "string", "company": "string", "duration": "string", "description": ["string"] }],
  "education": [{ "degree": "string", "institution": "string", "graduation_year": "string" }],
  "technical_skills": ["string"],
  "soft_skills": ["string"],
  "resume_rating": "number (1-10)",
  "improvement_areas": "string",
  "upskill_suggestions": ["string"]
}`;

  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return JSON.parse(response.text());
}

module.exports = { analyzeResume };
