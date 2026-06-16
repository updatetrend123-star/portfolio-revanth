import { getUserByEmail } from '../db.ts';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export const login = async (req: any, res: any) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    console.log(`Auth request for: ${email}`);
    const user = await getUserByEmail(email) as any;
    
    if (!user) {
      console.warn(`Auth failed: User not found (${email})`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.warn(`Auth failed: Incorrect password for ${email}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    console.log(`Auth successful: ${email}`);
    res.json({ 
      token, 
      user: { 
        email: user.email, 
        name: user.name 
      } 
    });
  } catch (error) {
    console.error('Login controller error:', error);
    res.status(500).json({ error: 'Internal server error during authentication' });
  }
};
