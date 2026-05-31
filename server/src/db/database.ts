import fs from 'node:fs';
import path from 'node:path';
import { GroupTrip } from '../types';

const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'db.json');

// Initial seed data
const initialData: { groups: GroupTrip[] } = {
  groups: [
    {
      id: 'goa-2026',
      name: 'Reunion in Goa',
      destination: 'Goa, India',
      startDate: '2026-10-15',
      endDate: '2026-10-20',
      members: ['Alex', 'Jordan', 'Taylor', 'Sam'],
      itinerary: [
        {
          id: 'init-flight-1',
          type: 'flight',
          title: 'Delhi (DEL) to Goa (GOI)',
          provider: 'IndiGo (6E-6015)',
          dateTime: '2026-10-15T08:30:00Z',
          price: 5200,
          details: {
            duration: '2h 30m',
            flightNo: '6E-6015',
            departure: '08:30 AM',
            arrival: '11:00 AM',
            location: 'Indira Gandhi Intl Airport'
          },
          addedBy: 'Alex'
        },
        {
          id: 'init-hotel-1',
          type: 'hotel',
          title: 'Grande Goa Beach Resort',
          provider: 'Grande Hotels',
          dateTime: '2026-10-15T12:00:00Z',
          price: 8500,
          details: {
            roomType: 'Deluxe Sea View (2 Rooms)',
            rating: 4.6,
            location: 'Calangute Beach, Goa'
          },
          addedBy: 'Jordan'
        }
      ],
      votes: [
        { itemId: 'init-flight-1', user: 'Alex', vote: 1 },
        { itemId: 'init-flight-1', user: 'Jordan', vote: 1 },
        { itemId: 'init-flight-1', user: 'Taylor', vote: 1 },
        { itemId: 'init-hotel-1', user: 'Jordan', vote: 1 },
        { itemId: 'init-hotel-1', user: 'Sam', vote: 1 }
      ],
      expenses: [
        {
          id: 'exp-1',
          description: 'Resort Booking Advance',
          amount: 17000,
          paidBy: 'Jordan',
          splitWith: ['Alex', 'Jordan', 'Taylor', 'Sam'],
          date: '2026-05-30'
        },
        {
          id: 'exp-2',
          description: 'Beach Dinner Day 1',
          amount: 4500,
          paidBy: 'Alex',
          splitWith: ['Alex', 'Jordan', 'Taylor', 'Sam'],
          date: '2026-10-15'
        }
      ],
      messages: [
        {
          id: 'msg-1',
          user: 'Alex',
          text: 'Hey group! Created this trip planner so we can align on flights and hotels. Added my flight details.',
          timestamp: '2026-05-31T10:00:00Z'
        },
        {
          id: 'msg-2',
          user: 'Jordan',
          text: 'Awesome, thanks Alex! I suggested a hotel near Calangute. Please vote or add other suggestions.',
          timestamp: '2026-05-31T10:15:00Z'
        }
      ]
    }
  ]
};

// Simple lock-free JSON database reading/writing helper
export function readDb(): { groups: GroupTrip[] } {
  if (!fs.existsSync(dbPath)) {
    writeDb(initialData);
    return initialData;
  }
  try {
    const raw = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading JSON database, resetting to seed data:', err);
    writeDb(initialData);
    return initialData;
  }
}

export function writeDb(data: { groups: GroupTrip[] }) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
}

// Mock Search Data Generators
export function generateMockFlights(from: string, to: string, date: string) {
  const providers = ['IndiGo', 'Air India', 'Vistara', 'Akasa Air', 'SpiceJet'];
  const flightNums = ['6E-2041', 'AI-865', 'UK-943', 'QP-1102', 'SG-324'];
  const times = [
    { dep: '06:00', arr: '08:15', dur: '2h 15m' },
    { dep: '09:30', arr: '12:00', dur: '2h 30m' },
    { dep: '13:15', arr: '15:35', dur: '2h 20m' },
    { dep: '17:45', arr: '20:10', dur: '2h 25m' },
    { dep: '21:00', arr: '23:15', dur: '2h 15m' }
  ];

  return times.map((t, index) => {
    const provider = providers[index % providers.length];
    const price = Math.floor(Math.random() * 4000) + 3500;
    return {
      id: `fl-${index + 1}-${from}-${to}`,
      type: 'flight' as const,
      title: `${from.toUpperCase()} to ${to.toUpperCase()}`,
      provider,
      dateTime: `${date}T${t.dep}:00`,
      price,
      details: {
        flightNo: flightNums[index % flightNums.length],
        departure: t.dep,
        arrival: t.arr,
        duration: t.dur,
        location: `${from.toUpperCase()} Intl Airport to ${to.toUpperCase()} Intl Airport`
      }
    };
  });
}

export function generateMockHotels(destination: string, date: string) {
  const hotelNames = [
    'Taj Heritage & Spa',
    'Grand Mercure Resort',
    'Lemon Tree Premier',
    'ibis Styles Inn',
    'Royal Palace Retreat'
  ];
  const locations = ['City Center', 'Beachfront', 'Near Airport', 'Hillside', 'Historic Quarter'];
  const ratings = [4.8, 4.4, 4.1, 4.0, 4.5];

  return hotelNames.map((name, index) => {
    const price = Math.floor(Math.random() * 8000) + 2500;
    return {
      id: `ht-${index + 1}-${destination.replace(/\s+/g, '-').toLowerCase()}`,
      type: 'hotel' as const,
      title: `${name}`,
      provider: 'Hotels.com',
      dateTime: `${date}T12:00:00`,
      price,
      details: {
        roomType: 'Deluxe Double Room',
        rating: ratings[index],
        location: `${locations[index]}, ${destination}`
      }
    };
  });
}

export function generateMockTrains(from: string, to: string, date: string) {
  const trainNames = ['Rajdhani Express', 'Shatabdi Express', 'Vande Bharat', 'Duronto Express', 'Express Train'];
  const trainNums = ['12951', '12002', '22436', '12260', '11053'];
  const times = [
    { dep: '05:30', arr: '11:45', dur: '6h 15m' },
    { dep: '08:15', arr: '16:30', dur: '8h 15m' },
    { dep: '14:00', arr: '20:10', dur: '6h 10m' },
    { dep: '17:00', arr: '23:55', dur: '6h 55m' },
    { dep: '22:30', arr: '07:30', dur: '9h 00m' }
  ];

  return times.map((t, index) => {
    const provider = trainNames[index % trainNames.length];
    const price = Math.floor(Math.random() * 1200) + 800;
    return {
      id: `tr-${index + 1}-${from}-${to}`,
      type: 'train' as const,
      title: `${from.toUpperCase()} to ${to.toUpperCase()}`,
      provider,
      dateTime: `${date}T${t.dep}:00`,
      price,
      details: {
        trainNo: trainNums[index % trainNums.length],
        departure: t.dep,
        arrival: t.arr,
        duration: t.dur,
        location: `${from.toUpperCase()} Junction to ${to.toUpperCase()} Central`
      }
    };
  });
}

export function generateMockBuses(from: string, to: string, date: string) {
  const busOperators = ['Zingbus', 'IntrCity SmartBus', 'VRL Travels', 'SRS Travels', 'National Travels'];
  const busTypes = ['A/C Sleeper (2+1)', 'A/C Seater (2+2) Multi-Axle', 'Electric A/C Sleeper', 'Scania A/C Multi-Axle', 'Non-A/C Sleeper'];
  const times = [
    { dep: '07:00', arr: '14:30', dur: '7h 30m' },
    { dep: '10:30', arr: '18:15', dur: '7h 45m' },
    { dep: '19:00', arr: '03:30', dur: '8h 30m' },
    { dep: '21:30', arr: '05:45', dur: '8h 15m' },
    { dep: '23:00', arr: '07:15', dur: '8h 15m' }
  ];

  return times.map((t, index) => {
    const provider = busOperators[index % busOperators.length];
    const price = Math.floor(Math.random() * 1000) + 600;
    return {
      id: `bs-${index + 1}-${from}-${to}`,
      type: 'bus' as const,
      title: `${from.toUpperCase()} to ${to.toUpperCase()}`,
      provider,
      dateTime: `${date}T${t.dep}:00`,
      price,
      details: {
        busType: busTypes[index % busTypes.length],
        departure: t.dep,
        arrival: t.arr,
        duration: t.dur,
        location: `${from.toUpperCase()} Bus Stand to ${to.toUpperCase()} Bus Stop`
      }
    };
  });
}

export function generateMockOffers() {
  return [
    {
      id: 'off-1',
      category: 'flight',
      provider: 'Air India Express',
      title: 'Domestic Fares starting at ₹1,925',
      subtitle: 'International Fares starting at ₹12,500',
      tag: 'SALE',
      bgColor: 'linear-gradient(135deg, #ec5b24, #f97316)'
    },
    {
      id: 'off-2',
      category: 'bank',
      provider: 'HDFC Bank',
      title: 'Get up to ₹2,000 Off',
      subtitle: 'on Domestic Flights with HDFC Credit Card + No Cost EMI',
      tag: 'HDFC BANK',
      bgColor: 'linear-gradient(135deg, #1e40af, #3b82f6)'
    },
    {
      id: 'off-3',
      category: 'bank',
      provider: 'ICICI Bank',
      title: 'Flat 12% Off',
      subtitle: 'on Flights with ICICI Credit Card + No Cost EMI',
      tag: 'ICICI Bank',
      bgColor: 'linear-gradient(135deg, #ea580c, #f97316)'
    },
    {
      id: 'off-4',
      category: 'bank',
      provider: 'SBI Visa',
      title: 'Flat 12% Off',
      subtitle: 'on Flights with SBI Visa Debit Card',
      tag: 'SBI | VISA',
      bgColor: 'linear-gradient(135deg, #0d9488, #14b8a6)'
    },
    {
      id: 'off-5',
      category: 'bank',
      provider: 'YES Bank',
      title: 'Flat 12% Off',
      subtitle: 'on Flights with YES Credit Card + No Cost EMI',
      tag: 'YES BANK',
      bgColor: 'linear-gradient(135deg, #111827, #374151)'
    }
  ];
}

export function generateMockHotelDeals(city: string) {
  const normalizedCity = city.toLowerCase().trim();
  if (normalizedCity.includes('delhi')) {
    return [
      { id: 'hd-del-1', name: 'Deventure Sarovar Portico Kapas Hera', rating: 8.2, reviews: '1k+', price: 5730, stars: 4, location: 'Kapas Hera, New Delhi', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&auto=format&fit=crop&q=60' },
      { id: 'hd-del-2', name: 'Sarovar Portico Naraina', rating: 8.2, reviews: '730', price: 4112, stars: 4, location: 'Naraina, New Delhi', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&auto=format&fit=crop&q=60' },
      { id: 'hd-del-3', name: 'Park Inn by Radisson Patparganj', rating: 8.5, reviews: '1k+', price: 4945, stars: 4, location: 'Patparganj, New Delhi', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&auto=format&fit=crop&q=60' },
      { id: 'hd-del-4', name: 'Park Plaza Delhi CBD Shahdara', rating: 8.3, reviews: '525', price: 4390, stars: 4, location: 'Shahdara, New Delhi', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500&auto=format&fit=crop&q=60' },
      { id: 'hd-del-5', name: 'Hotel Pearl', rating: 8.1, reviews: '3k+', price: 1799, stars: 3, location: 'Mahipalpur, New Delhi', image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500&auto=format&fit=crop&q=60' }
    ];
  } else if (normalizedCity.includes('mumbai')) {
    return [
      { id: 'hd-mum-1', name: 'The Leela Mumbai', rating: 8.9, reviews: '2k+', price: 9500, stars: 5, location: 'Andheri East, Mumbai', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&auto=format&fit=crop&q=60' },
      { id: 'hd-mum-2', name: 'Fariyas Hotel Colaba', rating: 8.3, reviews: '950', price: 6200, stars: 4, location: 'Colaba, Mumbai', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&auto=format&fit=crop&q=60' },
      { id: 'hd-mum-3', name: 'Trident Nariman Point', rating: 9.0, reviews: '4k+', price: 11500, stars: 5, location: 'Nariman Point, Mumbai', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&auto=format&fit=crop&q=60' },
      { id: 'hd-mum-4', name: 'Hotel Suba International', rating: 8.4, reviews: '1.2k+', price: 5100, stars: 4, location: 'Andheri East, Mumbai', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500&auto=format&fit=crop&q=60' }
    ];
  } else {
    return [
      { id: 'hd-gen-1', name: `Grand Plaza Resort ${city}`, rating: 8.4, reviews: '820', price: 4200, stars: 4, location: `City Center, ${city}`, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&auto=format&fit=crop&q=60' },
      { id: 'hd-gen-2', name: `Royal Palms Palace ${city}`, rating: 8.7, reviews: '640', price: 5800, stars: 4, location: `Beachfront, ${city}`, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&auto=format&fit=crop&q=60' },
      { id: 'hd-gen-3', name: `Lemon Tree Inn ${city}`, rating: 8.1, reviews: '1.5k+', price: 3400, stars: 3, location: `Near Transit, ${city}`, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&auto=format&fit=crop&q=60' },
      { id: 'hd-gen-4', name: `The Park Premium Hotel ${city}`, rating: 8.5, reviews: '920', price: 6100, stars: 4, location: `CBD, ${city}`, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500&auto=format&fit=crop&q=60' }
    ];
  }
}

export function generateMockFlightDeals(fromCity: string) {
  return [
    { id: 'fd-1', toCity: 'Bathinda', state: 'Punjab', date: 'Thu, 11 Jun', price: 1680 },
    { id: 'fd-2', toCity: 'Gwalior', state: 'Madhya Pradesh', date: 'Mon, 29 Jun', price: 1999 },
    { id: 'fd-3', toCity: 'Hissar', state: 'Haryana', date: 'Sun, 14 Jun', price: 2133 },
    { id: 'fd-4', toCity: 'Jaipur', state: 'Rajasthan', date: 'Sat, 06 Jun', price: 2696 },
    { id: 'fd-5', toCity: 'Ayodhya', state: 'Uttar Pradesh', date: 'Wed, 24 Jun', price: 2746 }
  ];
}

