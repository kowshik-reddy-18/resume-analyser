const express = require('express');
const multer = require('multer');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('resume'), resumeController.uploadResume);
router.get('/', resumeController.getAllResumes);
router.get('/:id', resumeController.getResumeById);

module.exports = router;