import { Router, Request, Response } from 'express';
import { readDb, writeDb } from '../db/database';
import { GroupTrip, ItineraryItem, Expense, Message, Vote } from '../types';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// GET /api/groups - Get list of all group trips
router.get('/', (req: Request, res: Response) => {
  const db = readDb();
  // Return key overview details of trips
  res.json(db.groups);
});

// POST /api/groups - Create a new group trip
router.post('/', (req: Request, res: Response) => {
  const { name, destination, startDate, endDate, members } = req.body;
  if (!name || !destination || !startDate || !endDate) {
    return res.status(400).json({ error: 'Missing required trip parameters' });
  }

  const db = readDb();
  const newTrip: GroupTrip = {
    id: uuidv4(),
    name,
    destination,
    startDate,
    endDate,
    members: Array.isArray(members) && members.length > 0 ? members : ['Alex', 'Jordan', 'Taylor'],
    itinerary: [],
    votes: [],
    expenses: [],
    messages: []
  };

  db.groups.push(newTrip);
  writeDb(db);
  res.status(201).json(newTrip);
});

// GET /api/groups/:id - Get details of a specific group trip
router.get('/:id', (req: Request, res: Response) => {
  const db = readDb();
  const trip = db.groups.find(g => g.id === req.params.id);
  if (!trip) {
    return res.status(404).json({ error: 'Trip not found' });
  }
  res.json(trip);
});

// POST /api/groups/:id/itinerary - Add item to itinerary
router.post('/:id/itinerary', (req: Request, res: Response) => {
  const { type, title, provider, dateTime, price, details, addedBy } = req.body;
  if (!type || !title || !dateTime || !addedBy) {
    return res.status(400).json({ error: 'Missing required itinerary item parameters' });
  }

  const db = readDb();
  const tripIndex = db.groups.findIndex(g => g.id === req.params.id);
  if (tripIndex === -1) {
    return res.status(404).json({ error: 'Trip not found' });
  }

  const newItem: ItineraryItem = {
    id: uuidv4(),
    type,
    title,
    provider: provider || 'Custom',
    dateTime,
    price: Number(price) || 0,
    details: details || {},
    addedBy
  };

  db.groups[tripIndex].itinerary.push(newItem);
  writeDb(db);
  res.status(201).json(db.groups[tripIndex]);
});

// DELETE /api/groups/:id/itinerary/:itemId - Remove item from itinerary
router.delete('/:id/itinerary/:itemId', (req: Request, res: Response) => {
  const db = readDb();
  const tripIndex = db.groups.findIndex(g => g.id === req.params.id);
  if (tripIndex === -1) {
    return res.status(404).json({ error: 'Trip not found' });
  }

  const trip = db.groups[tripIndex];
  trip.itinerary = trip.itinerary.filter(item => item.id !== req.params.itemId);
  // Clean up associated votes as well
  trip.votes = trip.votes.filter(v => v.itemId !== req.params.itemId);

  writeDb(db);
  res.json(trip);
});

// POST /api/groups/:id/votes - Add/update a vote
router.post('/:id/votes', (req: Request, res: Response) => {
  const { itemId, user, vote } = req.body; // vote: 1 or -1
  if (!itemId || !user || vote === undefined) {
    return res.status(400).json({ error: 'Missing voting parameters' });
  }

  const db = readDb();
  const tripIndex = db.groups.findIndex(g => g.id === req.params.id);
  if (tripIndex === -1) {
    return res.status(404).json({ error: 'Trip not found' });
  }

  const trip = db.groups[tripIndex];
  // Check if item exists in itinerary
  const itemExists = trip.itinerary.some(item => item.id === itemId);
  if (!itemExists) {
    return res.status(404).json({ error: 'Itinerary item not found' });
  }

  // Remove existing vote by this user for this item
  trip.votes = trip.votes.filter(v => !(v.itemId === itemId && v.user === user));

  // Add new vote if it's 1 or -1
  if (vote === 1 || vote === -1) {
    trip.votes.push({ itemId, user, vote });
  }

  writeDb(db);
  res.json(trip);
});

// POST /api/groups/:id/expenses - Add an expense
router.post('/:id/expenses', (req: Request, res: Response) => {
  const { description, amount, paidBy, splitWith, date } = req.body;
  if (!description || !amount || !paidBy || !splitWith || !date) {
    return res.status(400).json({ error: 'Missing expense parameters' });
  }

  const db = readDb();
  const tripIndex = db.groups.findIndex(g => g.id === req.params.id);
  if (tripIndex === -1) {
    return res.status(404).json({ error: 'Trip not found' });
  }

  const trip = db.groups[tripIndex];
  const newExpense: Expense = {
    id: uuidv4(),
    description,
    amount: Number(amount),
    paidBy,
    splitWith: Array.isArray(splitWith) ? splitWith : [paidBy],
    date
  };

  trip.expenses.push(newExpense);
  writeDb(db);
  res.status(201).json(trip);
});

// DELETE /api/groups/:id/expenses/:expenseId - Remove an expense
router.delete('/:id/expenses/:expenseId', (req: Request, res: Response) => {
  const db = readDb();
  const tripIndex = db.groups.findIndex(g => g.id === req.params.id);
  if (tripIndex === -1) {
    return res.status(404).json({ error: 'Trip not found' });
  }

  const trip = db.groups[tripIndex];
  trip.expenses = trip.expenses.filter(e => e.id !== req.params.expenseId);

  writeDb(db);
  res.json(trip);
});

// POST /api/groups/:id/messages - Send chat message
router.post('/:id/messages', (req: Request, res: Response) => {
  const { user, text } = req.body;
  if (!user || !text) {
    return res.status(400).json({ error: 'Missing message parameters' });
  }

  const db = readDb();
  const tripIndex = db.groups.findIndex(g => g.id === req.params.id);
  if (tripIndex === -1) {
    return res.status(404).json({ error: 'Trip not found' });
  }

  const trip = db.groups[tripIndex];
  const newMessage: Message = {
    id: uuidv4(),
    user,
    text,
    timestamp: new Date().toISOString()
  };

  trip.messages.push(newMessage);
  writeDb(db);
  res.status(201).json(trip);
});

export default router;
