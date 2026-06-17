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
import { alertNewMessage } from './services/notifier';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

const ADMIN_UID = 'zEsmnrVMPBMKPzhjV6MmVng65Qi1';

const auth = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    let decoded: any = null;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      // Try decoding as a Firebase ID token
      const parsed = jwt.decode(token) as any;
      if (parsed && (parsed.uid === ADMIN_UID || parsed.sub === ADMIN_UID || parsed.user_id === ADMIN_UID)) {
        decoded = parsed;
      } else {
        throw e;
      }
    }
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

// Contact triggers
router.post('/contact/notify', async (req: any, res: any) => {
  try {
    const { id, name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required message parameters' });
    }
    const result = await alertNewMessage({ id, name, email, message });
    res.json({ ...result, success: true });
  } catch (error) {
    console.error('Failed to process message notification webhook:', error);
    res.status(500).json({ error: 'Failed to process message notification' });
  }
});

export default router;
