import { Router, Request, Response } from 'express';
import { getGroups, getGroupById, createGroup, updateGroup } from '../db/database';
import { GroupTrip, ItineraryItem, Expense, Message } from '../types';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// GET /api/groups - Get list of all group trips
router.get('/', async (req: Request, res: Response) => {
  try {
    const { username } = req.query;
    const groups = await getGroups(username as string | undefined);
    res.json(groups);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve group trips', message: err.message });
  }
});

// POST /api/groups - Create a new group trip
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, destination, startDate, endDate, members } = req.body;
    if (!name || !destination || !startDate || !endDate) {
      return res.status(400).json({ error: 'Missing required trip parameters' });
    }

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

    await createGroup(newTrip);
    res.status(201).json(newTrip);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create group trip', message: err.message });
  }
});

// GET /api/groups/:id - Get details of a specific group trip
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const trip = await getGroupById(req.params.id);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    res.json(trip);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve trip details', message: err.message });
  }
});

// POST /api/groups/:id/itinerary - Add item to itinerary
router.post('/:id/itinerary', async (req: Request, res: Response) => {
  try {
    const { type, title, provider, dateTime, price, details, addedBy } = req.body;
    if (!type || !title || !dateTime || !addedBy) {
      return res.status(400).json({ error: 'Missing required itinerary item parameters' });
    }

    const trip = await getGroupById(req.params.id);
    if (!trip) {
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

    trip.itinerary.push(newItem);
    await updateGroup(trip);
    res.status(201).json(trip);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to add itinerary item', message: err.message });
  }
});

// DELETE /api/groups/:id/itinerary/:itemId - Remove item from itinerary
router.delete('/:id/itinerary/:itemId', async (req: Request, res: Response) => {
  try {
    const trip = await getGroupById(req.params.id);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    trip.itinerary = trip.itinerary.filter(item => item.id !== req.params.itemId);
    // Clean up associated votes as well
    trip.votes = trip.votes.filter(v => v.itemId !== req.params.itemId);

    await updateGroup(trip);
    res.json(trip);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to remove itinerary item', message: err.message });
  }
});

// POST /api/groups/:id/votes - Add/update a vote
router.post('/:id/votes', async (req: Request, res: Response) => {
  try {
    const { itemId, user, vote } = req.body; // vote: 1 or -1
    if (!itemId || !user || vote === undefined) {
      return res.status(400).json({ error: 'Missing voting parameters' });
    }

    const trip = await getGroupById(req.params.id);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

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

    await updateGroup(trip);
    res.json(trip);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update vote', message: err.message });
  }
});

// POST /api/groups/:id/expenses - Add an expense
router.post('/:id/expenses', async (req: Request, res: Response) => {
  try {
    const { description, amount, paidBy, splitWith, date } = req.body;
    if (!description || !amount || !paidBy || !splitWith || !date) {
      return res.status(400).json({ error: 'Missing expense parameters' });
    }

    const trip = await getGroupById(req.params.id);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const newExpense: Expense = {
      id: uuidv4(),
      description,
      amount: Number(amount),
      paidBy,
      splitWith: Array.isArray(splitWith) ? splitWith : [paidBy],
      date
    };

    trip.expenses.push(newExpense);
    await updateGroup(trip);
    res.status(201).json(trip);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to add expense', message: err.message });
  }
});

// DELETE /api/groups/:id/expenses/:expenseId - Remove an expense
router.delete('/:id/expenses/:expenseId', async (req: Request, res: Response) => {
  try {
    const trip = await getGroupById(req.params.id);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    trip.expenses = trip.expenses.filter(e => e.id !== req.params.expenseId);

    await updateGroup(trip);
    res.json(trip);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to remove expense', message: err.message });
  }
});

// POST /api/groups/:id/messages - Send chat message
router.post('/:id/messages', async (req: Request, res: Response) => {
  try {
    const { user, text } = req.body;
    if (!user || !text) {
      return res.status(400).json({ error: 'Missing message parameters' });
    }

    const trip = await getGroupById(req.params.id);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const newMessage: Message = {
      id: uuidv4(),
      user,
      text,
      timestamp: new Date().toISOString()
    };

    trip.messages.push(newMessage);
    await updateGroup(trip);
    res.status(201).json(trip);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to send message', message: err.message });
  }
});

export default router;
