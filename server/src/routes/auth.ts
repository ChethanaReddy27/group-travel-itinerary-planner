import { Router, Request, Response } from 'express';
import { readDb, writeDb, hashPassword } from '../db/database';
import { User } from '../types';

const router = Router();

// POST /api/auth/register
router.post('/register', (req: Request, res: Response) => {
  const { username, password, name, email } = req.body;
  if (!username || !password || !name) {
    return res.status(400).json({ error: 'Missing username, password, or name' });
  }

  const db = readDb();
  const exists = db.users.some(u => u.username.toLowerCase() === username.toLowerCase().trim());
  if (exists) {
    return res.status(400).json({ error: 'Username is already taken' });
  }

  const newUser: User = {
    username: username.trim(),
    passwordHash: hashPassword(password),
    name: name.trim(),
    email: (email || '').trim()
  };

  db.users.push(newUser);
  writeDb(db);

  res.status(201).json({ 
    success: true, 
    user: { username: newUser.username, name: newUser.name, email: newUser.email } 
  });
});

// POST /api/auth/login
router.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Missing username or password' });
  }

  const db = readDb();
  const user = db.users.find(u => u.username.toLowerCase() === username.toLowerCase().trim());
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
});

export default router;
