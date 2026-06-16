import express from 'express';
import { login } from './controllers/AuthController';
import { 
  getPortfolio, 
  updatePersonal, 
  createProject, 
  updateProject, 
  deleteProject,
  updateSkills,
  updateServices,
  updateExperience,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
} from './controllers/PortfolioController';
import jwt from 'jsonwebtoken';
import multer from 'multer';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

const auth = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Auth
router.post('/auth/login', login);

// Portfolio
router.get('/portfolio', getPortfolio);
router.post('/personal', auth, updatePersonal);

// Projects
router.post('/projects', auth, createProject);
router.put('/projects/:id', auth, updateProject);
router.delete('/projects/:id', auth, deleteProject);

// Testimonials
router.post('/testimonials', auth, createTestimonial);
router.put('/testimonials/:id', auth, updateTestimonial);
router.delete('/testimonials/:id', auth, deleteTestimonial);

// Bulk Updates
router.post('/skills', auth, updateSkills);
router.post('/services', auth, updateServices);
router.post('/experience', auth, updateExperience);

// Upload
router.post('/upload', auth, upload.single('file'), (req: any, res) => {
  if (!req.file) return res.status(400).send('No file uploaded');
  res.json({ url: `/uploads/${req.file.filename}` });
});

export default router;
