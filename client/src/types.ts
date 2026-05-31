export interface ItineraryItem {
  id: string;
  type: 'flight' | 'train' | 'bus' | 'hotel' | 'activity';
  title: string;
  provider: string;
  dateTime: string;
  price: number;
  details: {
    duration?: string;
    flightNo?: string;
    trainNo?: string;
    busType?: string;
    roomType?: string;
    rating?: number;
    location?: string;
    departure?: string;
    arrival?: string;
  };
  addedBy: string;
}

export interface Vote {
  itemId: string;
  user: string;
  vote: 1 | -1;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  splitWith: string[];
  date: string;
}

export interface Message {
  id: string;
  user: string;
  text: string;
  timestamp: string;
}

export interface GroupTrip {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  members: string[];
  itinerary: ItineraryItem[];
  votes: Vote[];
  expenses: Expense[];
  messages: Message[];
}

export interface SearchQuery {
  from: string;
  to: string;
  date: string;
  passengers: number;
}
