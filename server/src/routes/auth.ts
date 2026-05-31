import { Router, Request, Response } from 'express';
import { getUserByUsername, createUser, hashPassword } from '../db/database';
import { User } from '../types';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, password, name, email } = req.body;
    if (!username || !password || !name) {
      return res.status(400).json({ error: 'Missing username, password, or name' });
    }

    const exists = await getUserByUsername(username);
    if (exists) {
      return res.status(400).json({ error: 'Username is already taken' });
    }

    const newUser: User = {
      username: username.trim(),
      passwordHash: hashPassword(password),
      name: name.trim(),
      email: (email || '').trim()
    };

    await createUser(newUser);

    res.status(201).json({ 
      success: true, 
      user: { username: newUser.username, name: newUser.name, email: newUser.email } 
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Registration failed', message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Missing username or password' });
    }

    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const expectedHash = hashPassword(password);
    if (user.passwordHash !== expectedHash) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    res.json({
      success: true,
      user: { username: user.username, name: user.name, email: user.email }
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Login failed', message: err.message });
  }
});

export default router;
