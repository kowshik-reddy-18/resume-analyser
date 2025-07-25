const pool = require('../db');
const { analyzeResume } = require('../services/analysisService');

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const parsedData = await analyzeResume(req.file.buffer);
    const result = await pool.query(
      `INSERT INTO resumes (file_name, name, email, phone, linkedin_url, portfolio_url, summary, work_experience, education, technical_skills, soft_skills, projects, certifications, resume_rating, improvement_areas, upskill_suggestions)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *`,
      [req.file.originalname, parsedData.name, parsedData.email, parsedData.phone, parsedData.linkedin_url, parsedData.portfolio_url, parsedData.summary, JSON.stringify(parsedData.work_experience), JSON.stringify(parsedData.education), JSON.stringify(parsedData.technical_skills), JSON.stringify(parsedData.soft_skills), JSON.stringify(parsedData.projects), JSON.stringify(parsedData.certifications), parsedData.resume_rating, parsedData.improvement_areas, JSON.stringify(parsedData.upskill_suggestions)]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Resume analysis failed' });
  }
};

exports.getAllResumes = async (req, res) => {
  const result = await pool.query('SELECT id, name, email, resume_rating, uploaded_at FROM resumes ORDER BY uploaded_at DESC');
  res.json(result.rows);
};

exports.getResumeById = async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM resumes WHERE id = $1', [id]);
  res.json(result.rows[0]);
};