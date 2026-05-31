import { Router, Request, Response } from 'express';
import {
  generateMockFlights,
  generateMockHotels,
  generateMockTrains,
  generateMockBuses,
  generateMockOffers,
  generateMockHotelDeals,
  generateMockFlightDeals
} from '../db/database';

const router = Router();

// GET /api/search/flights?from=del&to=goi&date=2026-10-15
router.get('/flights', (req: Request, res: Response) => {
  const { from, to, date } = req.query;
  if (!from || !to || !date) {
    return res.status(400).json({ error: 'Missing parameters: from, to, date' });
  }
  const flights = generateMockFlights(from as string, to as string, date as string);
  res.json(flights);
});

// GET /api/search/hotels?destination=goa&date=2026-10-15
router.get('/hotels', (req: Request, res: Response) => {
  const { destination, date } = req.query;
  if (!destination || !date) {
    return res.status(400).json({ error: 'Missing parameters: destination, date' });
  }
  const hotels = generateMockHotels(destination as string, date as string);
  res.json(hotels);
});

// GET /api/search/trains?from=del&to=goi&date=2026-10-15
router.get('/trains', (req: Request, res: Response) => {
  const { from, to, date } = req.query;
  if (!from || !to || !date) {
    return res.status(400).json({ error: 'Missing parameters: from, to, date' });
  }
  const trains = generateMockTrains(from as string, to as string, date as string);
  res.json(trains);
});

// GET /api/search/buses?from=del&to=goi&date=2026-10-15
router.get('/buses', (req: Request, res: Response) => {
  const { from, to, date } = req.query;
  if (!from || !to || !date) {
    return res.status(400).json({ error: 'Missing parameters: from, to, date' });
  }
  const buses = generateMockBuses(from as string, to as string, date as string);
  res.json(buses);
});

// GET /api/search/offers
router.get('/offers', (req: Request, res: Response) => {
  const offers = generateMockOffers();
  res.json(offers);
});

// GET /api/search/deals/hotels?city=delhi
router.get('/deals/hotels', (req: Request, res: Response) => {
  const city = (req.query.city as string) || 'Delhi';
  const deals = generateMockHotelDeals(city);
  res.json(deals);
});

// GET /api/search/deals/flights?fromCity=Delhi
router.get('/deals/flights', (req: Request, res: Response) => {
  const fromCity = (req.query.fromCity as string) || 'Delhi';
  const deals = generateMockFlightDeals(fromCity);
  res.json(deals);
});

export default router;
