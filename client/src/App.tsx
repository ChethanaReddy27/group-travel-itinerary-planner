import { useState, useEffect } from 'react';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { SearchWidget } from './components/Planner/SearchWidget';
import { SearchResults } from './components/Planner/SearchResults';
import { ItineraryTimeline } from './components/Planner/ItineraryTimeline';
import { VotingBoard } from './components/Collab/VotingBoard';
import { ExpenseSplitter } from './components/Budget/ExpenseSplitter';
import { ChatBoard } from './components/Collab/ChatBoard';
import { GroupTrip, Expense } from './types';
import { 
  Calendar, 
  Users, 
  Plus, 
  ArrowRight, 
  Sparkles, 
  CreditCard, 
  Bell, 
  Compass, 
  ChevronRight, 
  Star, 
  ChevronDown
} from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<string>('Alex');
  const [currentView, setCurrentView] = useState<'home' | 'results' | 'planner'>('home');
  const [trips, setTrips] = useState<GroupTrip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string>('');
  
  // Search tab state synchronized with Header
  const [searchType, setSearchType] = useState<'flight' | 'hotel' | 'train' | 'bus'>('flight');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);

  // Dynamic Mocks States
  const [hotelCity, setHotelCity] = useState<string>('New Delhi');
  const [hotelDeals, setHotelDeals] = useState<any[]>([]);
  const [flightDeals, setFlightDeals] = useState<any[]>([]);
  const [showFaresDropdown, setShowFaresDropdown] = useState<boolean>(true);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newTripName, setNewTripName] = useState<string>('');
  const [newTripDest, setNewTripDest] = useState<string>('');
  const [newTripStart, setNewTripStart] = useState<string>('2026-10-15');
  const [newTripEnd, setNewTripEnd] = useState<string>('2026-10-20');
  const [newTripMembers, setNewTripMembers] = useState<string>('Alex, Jordan, Taylor, Sam');

  // Sub-tabs on the planner dashboard
  const [plannerTab, setPlannerTab] = useState<'timeline' | 'votes' | 'expenses' | 'chat'>('timeline');

  useEffect(() => {
    fetchTrips();
    fetchFlightDeals();
  }, []);

  useEffect(() => {
    fetchHotelDeals(hotelCity);
  }, [hotelCity]);

  const fetchTrips = async () => {
    try {
      const res = await fetch('/api/groups');
      const data = await res.json();
      setTrips(data);
      if (data.length > 0 && !selectedTripId) {
        setSelectedTripId(data[0].id);
      }
    } catch (err) {
      console.error('Error fetching group trips:', err);
    }
  };


  const fetchHotelDeals = async (city: string) => {
    try {
      const res = await fetch(`/api/search/deals/hotels?city=${encodeURIComponent(city)}`);
      const data = await res.json();
      setHotelDeals(data);
    } catch (err) {
      console.error('Error fetching hotel deals:', err);
    }
  };

  const fetchFlightDeals = async () => {
    try {
      const res = await fetch('/api/search/deals/flights?fromCity=New%20Delhi');
      const data = await res.json();
      setFlightDeals(data);
    } catch (err) {
      console.error('Error fetching flight deals:', err);
    }
  };

  const handleSearch = async (type: 'flight' | 'hotel' | 'train' | 'bus', query: any) => {
    setSearchType(type);
    setSearchLoading(true);
    setCurrentView('results');
    
    let url = `/api/search/${type}s?`;
    if (type === 'hotel') {
      url += `destination=${encodeURIComponent(query.destination)}&date=${query.date}`;
    } else {
      url += `from=${encodeURIComponent(query.from)}&to=${encodeURIComponent(query.to)}&date=${query.date}`;
    }

    try {
      const res = await fetch(url);
      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    const membersArr = newTripMembers.split(',').map(m => m.trim()).filter(Boolean);
    
    try {
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newTripName,
          destination: newTripDest,
          startDate: newTripStart,
          endDate: newTripEnd,
          members: membersArr
        })
      });
      const data = await res.json();
      setTrips([...trips, data]);
      setSelectedTripId(data.id);
      setShowCreateModal(false);
      
      // Reset form
      setNewTripName('');
      setNewTripDest('');
      setNewTripMembers('Alex, Jordan, Taylor, Sam');
      
      setCurrentView('planner');
      setPlannerTab('timeline');
    } catch (err) {
      console.error('Failed to create trip:', err);
    }
  };

  const handleAddToItinerary = async (tripId: string, item: any) => {
    try {
      const res = await fetch(`/api/groups/${tripId}/itinerary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: item.type,
          title: item.title,
          provider: item.provider,
          dateTime: item.dateTime,
          price: item.price,
          details: item.details,
          addedBy: currentUser
        })
      });
      const updatedTrip = await res.json();
      
      setTrips(trips.map(t => t.id === tripId ? updatedTrip : t));
      setSelectedTripId(tripId);
      setCurrentView('planner');
      setPlannerTab('timeline');
      
      alert(`Added "${item.title}" successfully to your shared plan "${updatedTrip.name}"!`);
    } catch (err) {
      console.error('Add to itinerary failed:', err);
    }
  };

  const handleRemoveItineraryItem = async (itemId: string) => {
    try {
      const res = await fetch(`/api/groups/${selectedTripId}/itinerary/${itemId}`, {
        method: 'DELETE'
      });
      const updatedTrip = await res.json();
      setTrips(trips.map(t => t.id === selectedTripId ? updatedTrip : t));
    } catch (err) {
      console.error('Delete item failed:', err);
    }
  };

  const handleCastVote = async (itemId: string, voteVal: 1 | -1 | 0) => {
    try {
      const res = await fetch(`/api/groups/${selectedTripId}/votes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId,
          user: currentUser,
          vote: voteVal
        })
      });
      const updatedTrip = await res.json();
      setTrips(trips.map(t => t.id === selectedTripId ? updatedTrip : t));
    } catch (err) {
      console.error('Voting failed:', err);
    }
  };

  const handleAddExpense = async (expense: Omit<Expense, 'id'>) => {
    try {
      const res = await fetch(`/api/groups/${selectedTripId}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expense)
      });
      const updatedTrip = await res.json();
      setTrips(trips.map(t => t.id === selectedTripId ? updatedTrip : t));
    } catch (err) {
      console.error('Failed to add expense:', err);
    }
  };

  const handleRemoveExpense = async (expenseId: string) => {
    try {
      const res = await fetch(`/api/groups/${selectedTripId}/expenses/${expenseId}`, {
        method: 'DELETE'
      });
      const updatedTrip = await res.json();
      setTrips(trips.map(t => t.id === selectedTripId ? updatedTrip : t));
    } catch (err) {
      console.error('Failed to remove expense:', err);
    }
  };

  const handleSendMessage = async (text: string) => {
    try {
      const res = await fetch(`/api/groups/${selectedTripId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: currentUser,
          text
        })
      });
      const updatedTrip = await res.json();
      setTrips(trips.map(t => t.id === selectedTripId ? updatedTrip : t));
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  // Scroll to collaborative section
  const handleScrollToPlanner = () => {
    const el = document.getElementById('collaborative-planner-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };


  const activeTrip = trips.find(t => t.id === selectedTripId);

  return (
    <div className="app-container">
      <Header 
        currentUser={currentUser} 
        onUserChange={setCurrentUser} 
        onGoHome={() => setCurrentView('home')} 
        currentView={currentView}
        activeTab={searchType}
        setActiveTab={setSearchType}
        onNavigateView={(view) => {
          if (view === 'planner') {
            if (trips.length > 0) {
              if (!selectedTripId) setSelectedTripId(trips[0].id);
              setCurrentView('planner');
              setPlannerTab('timeline');
            } else {
              alert('Please create a Group Planner trip on the homepage first!');
              handleScrollToPlanner();
            }
          } else {
            setCurrentView(view as any);
          }
        }}
      />

      {currentView === 'home' && (
        <>
          <main className="main-content header-flush-main">
            {/* Search widget at the absolute top of layout body */}
            <SearchWidget 
              onSearch={handleSearch} 
              activeTab={searchType}
              setActiveTab={setSearchType}
            />

            {/* Do More With Travel Planner Grid Section */}
            <section className="do-more-section">
              <h2 className="section-heading-bold">Do More With Travel Planner</h2>
              <div className="do-more-grid">
                <div className="do-more-card">
                  <div className="do-more-icon-wrap bg-blue-light">
                    <Compass size={24} className="do-more-icon text-blue" />
                    <span className="badge-promo badge-orange">Pro</span>
                  </div>
                  <span className="do-more-label">Flight Tracker</span>
                </div>

                <div className="do-more-card">
                  <div className="do-more-icon-wrap bg-green-light">
                    <CreditCard size={24} className="do-more-icon text-green" />
                    <span className="badge-promo badge-green">Free</span>
                  </div>
                  <span className="do-more-label">Credit Card</span>
                </div>

                <div className="do-more-card">
                  <div className="do-more-icon-wrap bg-purple-light">
                    <span className="emoji-icon">📄</span>
                  </div>
                  <span className="do-more-label">Book Visa</span>
                </div>

                <div className="do-more-card clickable-action-card" onClick={handleScrollToPlanner}>
                  <div className="do-more-icon-wrap bg-orange-light glow-orange">
                    <Users size={24} className="do-more-icon text-orange" />
                  </div>
                  <span className="do-more-label font-bold text-orange">Group Booking</span>
                </div>

                <div className="do-more-card clickable-action-card" onClick={() => setShowCreateModal(true)}>
                  <div className="do-more-icon-wrap bg-indigo-light">
                    <Sparkles size={24} className="do-more-icon text-indigo" />
                  </div>
                  <span className="do-more-label font-bold">Plan Trip</span>
                </div>

                <div className="do-more-card">
                  <div className="do-more-icon-wrap bg-yellow-light">
                    <Bell size={24} className="do-more-icon text-yellow" />
                  </div>
                  <span className="do-more-label">Fare Alerts</span>
                </div>
              </div>
            </section>


            {/* Why Book With Travel Planner Section */}
            <section className="why-book-section">
              <h2 className="section-heading-bold text-center">Why Book With Travel Planner?</h2>
              <div className="why-book-grid">
                <div className="why-book-card">
                  <div className="why-book-icon bg-pink-light">🔒</div>
                  <div className="why-book-info">
                    <h4>Now, Book Later with Price Lock</h4>
                    <p>Secure seats at current rates and pay balance later before departure.</p>
                  </div>
                </div>

                <div className="why-book-card">
                  <div className="why-book-icon bg-blue-light">🔄</div>
                  <div className="why-book-info">
                    <h4>Instant & full refunds with Assured</h4>
                    <p>Get full refunds immediately into bank for cancellation with no documentation.</p>
                  </div>
                </div>

                <div className="why-book-card">
                  <div className="why-book-icon bg-green-light">🛡️</div>
                  <div className="why-book-info">
                    <h4>Travel Stress-Free with Travel Insurance</h4>
                    <p>Comprehensive coverage for delays, lost luggage, and trip interruptions.</p>
                  </div>
                </div>

                <div className="why-book-card">
                  <div className="why-book-icon bg-yellow-light">🔔</div>
                  <div className="why-book-info">
                    <h4>Save up to 40% with intelligent fare alerts</h4>
                    <p>Get instant updates when flight and train rates drop for your route.</p>
                  </div>
                </div>

                <div className="why-book-card">
                  <div className="why-book-icon bg-purple-light">🛫</div>
                  <div className="why-book-info">
                    <h4>Track flight delays, boarding gate & baggage belt</h4>
                    <p>Live status details and notifications on terminal boards right inside app.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Best Deals for Hotels Section */}
            <section className="hotel-deals-section">
              <div className="hotel-section-header">
                <h2 className="section-heading-bold">Best Deals for Hotels</h2>
                <div className="hotel-city-tabs">
                  {['New Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai'].map((city) => (
                    <button
                      key={city}
                      className={`hotel-city-tab ${hotelCity === city ? 'active' : ''}`}
                      onClick={() => setHotelCity(city)}
                    >
                      {city}
                    </button>
                  ))}
                  <span className="view-all-hotels-link">
                    View All <ChevronRight size={14} />
                  </span>
                </div>
              </div>

              <div className="hotel-deals-grid">
                {hotelDeals.map((hotel) => (
                  <div className="hotel-deal-card" key={hotel.id}>
                    <div className="hotel-img-container">
                      <img src={hotel.image} alt={hotel.name} />
                      <div className="hotel-card-stars">
                        {Array.from({ length: hotel.stars }).map((_, i) => (
                          <Star key={i} size={10} fill="#f59e0b" color="#f59e0b" />
                        ))}
                      </div>
                    </div>
                    <div className="hotel-deal-info">
                      <h3 className="hotel-deal-name" title={hotel.name}>{hotel.name}</h3>
                      <p className="hotel-deal-location">{hotel.location}</p>
                      
                      <div className="hotel-rating-row">
                        <span className="rating-badge">{hotel.rating}</span>
                        <span className="rating-lbl">Excellent</span>
                        <span className="rating-divider">&bull;</span>
                        <span className="rating-users">{hotel.reviews} Users</span>
                      </div>

                      <div className="hotel-price-row">
                        <div className="price-label-box">
                          <span className="hotel-card-price">₹{hotel.price.toLocaleString('en-IN')}</span>
                          <span className="price-per-night">/ night</span>
                        </div>
                        <button 
                          className="book-deal-btn"
                          onClick={() => {
                            if (trips.length > 0) {
                              const tripId = selectedTripId || trips[0].id;
                              handleAddToItinerary(tripId, {
                                type: 'hotel',
                                title: hotel.name,
                                provider: 'Travel Planner deals',
                                dateTime: new Date().toISOString().split('T')[0] + 'T12:00:00',
                                price: hotel.price,
                                details: {
                                  roomType: 'Deluxe Suite Room',
                                  rating: hotel.rating,
                                  location: hotel.location
                                }
                              });
                            } else {
                              alert('Please create a Group Planner trip below first!');
                              handleScrollToPlanner();
                            }
                          }}
                        >
                          Book Hotel
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Cheapest Fares From New Delhi Section */}
            <section className="cheapest-fares-section">
              <div 
                className="fares-collapsible-header"
                onClick={() => setShowFaresDropdown(!showFaresDropdown)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 className="section-heading-bold" style={{ margin: 0 }}>Cheapest Fares From</h2>
                  <span className="fares-city-badge">New Delhi <ChevronDown size={14} /></span>
                </div>
                <div className={`dropdown-trigger-icon ${showFaresDropdown ? 'open' : ''}`}>
                  <ChevronDown size={20} />
                </div>
              </div>

              {showFaresDropdown && (
                <div className="fares-grid-dropdown animate-fade-in">
                  {flightDeals.map((deal) => (
                    <div className="fare-deal-card" key={deal.id}>
                      <div className="fare-dest-box">
                        <h3>{deal.toCity}</h3>
                        <p>{deal.state}</p>
                      </div>
                      <div className="fare-details-box">
                        <div className="fare-date">
                          <Calendar size={12} style={{ color: '#64748b' }} />
                          <span>{deal.date}</span>
                        </div>
                        <div className="fare-price">
                          <span className="fare-amt">₹{deal.price.toLocaleString('en-IN')}</span>
                          <span className="fare-lbl">onwards</span>
                        </div>
                      </div>
                      <button 
                        className="fare-book-btn"
                        onClick={() => {
                          if (trips.length > 0) {
                            const tripId = selectedTripId || trips[0].id;
                            handleAddToItinerary(tripId, {
                              type: 'flight',
                              title: `New Delhi to ${deal.toCity}`,
                              provider: 'IndiGo Deal',
                              dateTime: '2026-06-11T10:00:00Z',
                              price: deal.price,
                              details: {
                                flightNo: '6E-DEAL',
                                departure: '10:00 AM',
                                arrival: '12:15 PM',
                                duration: '2h 15m',
                                location: `Indira Gandhi Airport to ${deal.toCity} Airport`
                              }
                            });
                          } else {
                            alert('Please create a Group Planner trip below first!');
                            handleScrollToPlanner();
                          }
                        }}
                      >
                        Book Flight
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Popular Flight Routes Section */}
            <section className="popular-routes-section">
              <h2 className="section-heading-bold">Popular Flight Routes</h2>
              <div className="routes-grid">
                <div className="route-card-item">
                  <div className="route-city-header">Mumbai Flights</div>
                  <div className="route-links">
                    <span>To:</span>
                    <span onClick={() => handleSearch('flight', { from: 'Mumbai', to: 'Goa', date: '2026-06-01' })}>Goa</span>
                    <span onClick={() => handleSearch('flight', { from: 'Mumbai', to: 'Delhi', date: '2026-06-01' })}>Delhi</span>
                    <span onClick={() => handleSearch('flight', { from: 'Mumbai', to: 'Bangalore', date: '2026-06-01' })}>Bangalore</span>
                    <span onClick={() => handleSearch('flight', { from: 'Mumbai', to: 'Ahmedabad', date: '2026-06-01' })}>Ahmedabad</span>
                  </div>
                </div>

                <div className="route-card-item">
                  <div className="route-city-header">Delhi Flights</div>
                  <div className="route-links">
                    <span>To:</span>
                    <span onClick={() => handleSearch('flight', { from: 'Delhi', to: 'Mumbai', date: '2026-06-01' })}>Mumbai</span>
                    <span onClick={() => handleSearch('flight', { from: 'Delhi', to: 'Goa', date: '2026-06-01' })}>Goa</span>
                    <span onClick={() => handleSearch('flight', { from: 'Delhi', to: 'Bangalore', date: '2026-06-01' })}>Bangalore</span>
                    <span onClick={() => handleSearch('flight', { from: 'Delhi', to: 'Pune', date: '2026-06-01' })}>Pune</span>
                  </div>
                </div>

                <div className="route-card-item">
                  <div className="route-city-header">Kolkata Flights</div>
                  <div className="route-links">
                    <span>To:</span>
                    <span onClick={() => handleSearch('flight', { from: 'Kolkata', to: 'Mumbai', date: '2026-06-01' })}>Mumbai</span>
                    <span onClick={() => handleSearch('flight', { from: 'Kolkata', to: 'Delhi', date: '2026-06-01' })}>Delhi</span>
                    <span onClick={() => handleSearch('flight', { from: 'Kolkata', to: 'Bangalore', date: '2026-06-01' })}>Bangalore</span>
                    <span onClick={() => handleSearch('flight', { from: 'Kolkata', to: 'Bagdogra', date: '2026-06-01' })}>Bagdogra</span>
                  </div>
                </div>

                <div className="route-card-item">
                  <div className="route-city-header">Chennai Flights</div>
                  <div className="route-links">
                    <span>To:</span>
                    <span onClick={() => handleSearch('flight', { from: 'Chennai', to: 'Mumbai', date: '2026-06-01' })}>Mumbai</span>
                    <span onClick={() => handleSearch('flight', { from: 'Chennai', to: 'Delhi', date: '2026-06-01' })}>Delhi</span>
                    <span onClick={() => handleSearch('flight', { from: 'Chennai', to: 'Madurai', date: '2026-06-01' })}>Madurai</span>
                    <span onClick={() => handleSearch('flight', { from: 'Chennai', to: 'Coimbatore', date: '2026-06-01' })}>Coimbatore</span>
                  </div>
                </div>

                <div className="route-card-item">
                  <div className="route-city-header">Hyderabad Flights</div>
                  <div className="route-links">
                    <span>To:</span>
                    <span onClick={() => handleSearch('flight', { from: 'Hyderabad', to: 'Mumbai', date: '2026-06-01' })}>Mumbai</span>
                    <span onClick={() => handleSearch('flight', { from: 'Hyderabad', to: 'Goa', date: '2026-06-01' })}>Goa</span>
                    <span onClick={() => handleSearch('flight', { from: 'Hyderabad', to: 'Bangalore', date: '2026-06-01' })}>Bangalore</span>
                    <span onClick={() => handleSearch('flight', { from: 'Hyderabad', to: 'Delhi', date: '2026-06-01' })}>Delhi</span>
                  </div>
                </div>

                <div className="route-card-item">
                  <div className="route-city-header">Ahmedabad Flights</div>
                  <div className="route-links">
                    <span>To:</span>
                    <span onClick={() => handleSearch('flight', { from: 'Ahmedabad', to: 'Mumbai', date: '2026-06-01' })}>Mumbai</span>
                    <span onClick={() => handleSearch('flight', { from: 'Ahmedabad', to: 'Delhi', date: '2026-06-01' })}>Delhi</span>
                    <span onClick={() => handleSearch('flight', { from: 'Ahmedabad', to: 'Bangalore', date: '2026-06-01' })}>Bangalore</span>
                    <span onClick={() => handleSearch('flight', { from: 'Ahmedabad', to: 'Goa', date: '2026-06-01' })}>Goa</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Collaborative Group Planning Dashboard Section */}
            <section id="collaborative-planner-section" className="trips-section">
              <div className="section-header">
                <div>
                  <h2 className="section-title">Your Group Travel Itineraries</h2>
                  <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
                    Select an active itinerary or create a new planner board to coordinate flights, hotels, expenses, and chats.
                  </p>
                </div>
                <button className="secondary-btn" onClick={() => setShowCreateModal(true)}>
                  <Plus size={16} /> Create Group Planner
                </button>
              </div>

              {trips.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <Calendar size={48} style={{ color: '#94a3b8', marginBottom: '16px' }} />
                  <p style={{ fontWeight: 700, fontSize: '18px' }}>No Group Trips Yet</p>
                  <p style={{ color: '#64748b', marginTop: '8px' }}>Create a group planner to coordinate dates, booking items, expenses, and chats!</p>
                  <button 
                    className="submit-btn" 
                    onClick={() => setShowCreateModal(true)} 
                    style={{ margin: '20px auto 0' }}
                  >
                    Get Started
                  </button>
                </div>
              ) : (
                <div className="trips-grid">
                  {trips.map(trip => (
                    <div 
                      key={trip.id} 
                      className="trip-card animate-fade-in"
                      onClick={() => {
                        setSelectedTripId(trip.id);
                        setCurrentView('planner');
                        setPlannerTab('timeline');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      <div className="trip-card-header">
                        <div>
                          <span className="trip-dest">{trip.destination}</span>
                          <h3 className="trip-name">{trip.name}</h3>
                        </div>
                        <div style={{ background: '#ec5b2415', color: '#ec5b24', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>
                          Active
                        </div>
                      </div>
                      
                      <div className="trip-dates">
                        <Calendar size={14} />
                        <span>{trip.startDate} to {trip.endDate}</span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div className="trip-members-list">
                          {trip.members.map(m => (
                            <div className="member-dot" key={m} title={m}>
                              {m.charAt(0)}
                            </div>
                          ))}
                        </div>
                        <span style={{ fontSize: '12px', color: '#ec5b24', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          Open Dashboard <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </main>
        </>
      )}

      {currentView === 'results' && (
        <main className="main-content" style={{ marginTop: '30px' }}>
          {searchLoading ? (
            <div style={{ textAlign: 'center', padding: '100px 20px' }}>
              <div className="spinner-loader-circle"></div>
              <p style={{ fontWeight: 600, color: '#64748b' }}>Searching flights, hotels, trains, and buses...</p>
            </div>
          ) : (
            <SearchResults 
              searchType={searchType}
              results={searchResults}
              trips={trips}
              selectedTripId={selectedTripId}
              onAddToItinerary={handleAddToItinerary}
              onBack={() => setCurrentView('home')}
            />
          )}
        </main>
      )}

      {currentView === 'planner' && activeTrip && (
        <main className="main-content" style={{ marginTop: '30px' }}>
          <div className="planner-header animate-fade-in">
            <div className="planner-meta">
              <span className="trip-dest">{activeTrip.destination}</span>
              <h1>{activeTrip.name}</h1>
              <p>
                <Calendar size={14} />
                <span>{activeTrip.startDate} to {activeTrip.endDate}</span>
                &bull;
                <Users size={14} style={{ marginLeft: '4px' }} />
                <span>{activeTrip.members.join(', ')}</span>
              </p>
            </div>

            <div className="planner-nav">
              <button 
                className={`planner-nav-btn ${plannerTab === 'timeline' ? 'active' : ''}`}
                onClick={() => setPlannerTab('timeline')}
              >
                Itinerary Timeline
              </button>
              <button 
                className={`planner-nav-btn ${plannerTab === 'votes' ? 'active' : ''}`}
                onClick={() => setPlannerTab('votes')}
              >
                Voting Board
              </button>
              <button 
                className={`planner-nav-btn ${plannerTab === 'expenses' ? 'active' : ''}`}
                onClick={() => setPlannerTab('expenses')}
              >
                Expense Splitter
              </button>
              <button 
                className={`planner-nav-btn ${plannerTab === 'chat' ? 'active' : ''}`}
                onClick={() => setPlannerTab('chat')}
              >
                Group Chat ({activeTrip.messages.length})
              </button>
            </div>
          </div>

          <div className="planner-grid">
            {/* Left Hand Timeline Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <div style={{ background: 'linear-gradient(135deg, #ec5b240a 0%, #f973160a 100%)', border: '1px solid rgba(236,91,36,0.1)', padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Sparkles size={20} style={{ color: '#ec5b24' }} />
                <p style={{ fontSize: '13px', fontWeight: 500 }}>
                  Need more transport or hotel options? 
                  <span onClick={() => { setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ color: '#ec5b24', cursor: 'pointer', fontWeight: 700, marginLeft: '6px', textDecoration: 'underline' }}>
                    Click here to perform a fresh travel search
                  </span> and append them to this group trip!
                </p>
              </div>
              
              <ItineraryTimeline 
                itinerary={activeTrip.itinerary} 
                onRemoveItem={handleRemoveItineraryItem}
              />
            </div>

            {/* Right Hand Interactive Column based on tab */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              {plannerTab === 'timeline' && (
                <VotingBoard 
                  itinerary={activeTrip.itinerary}
                  votes={activeTrip.votes}
                  currentUser={currentUser}
                  onCastVote={handleCastVote}
                />
              )}

              {plannerTab === 'votes' && (
                <VotingBoard 
                  itinerary={activeTrip.itinerary}
                  votes={activeTrip.votes}
                  currentUser={currentUser}
                  onCastVote={handleCastVote}
                />
              )}

              {plannerTab === 'expenses' && (
                <ExpenseSplitter 
                  members={activeTrip.members}
                  expenses={activeTrip.expenses}
                  onAddExpense={handleAddExpense}
                  onRemoveExpense={handleRemoveExpense}
                />
              )}

              {plannerTab === 'chat' && (
                <ChatBoard 
                  messages={activeTrip.messages}
                  currentUser={currentUser}
                  onSendMessage={handleSendMessage}
                />
              )}
            </div>
          </div>
        </main>
      )}

      {/* Create Modal Form */}
      {showCreateModal && (
        <div className="modal-overlay animate-fade-in">
          <div className="modal-content">
            <div className="modal-header">
              <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Create New Group Planner</h2>
              <button className="close-btn" onClick={() => setShowCreateModal(false)}>✕</button>
            </div>

            <form onSubmit={handleCreateTrip} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label>Trip Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Graduation Reunion Trip"
                  value={newTripName} 
                  onChange={(e) => setNewTripName(e.target.value)}
                  style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontFamily: 'Outfit' }}
                  required
                />
              </div>

              <div className="form-group">
                <label>Destination</label>
                <input 
                  type="text" 
                  placeholder="e.g. Goa, Bali, Ladakh"
                  value={newTripDest} 
                  onChange={(e) => setNewTripDest(e.target.value)}
                  style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontFamily: 'Outfit' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Start Date</label>
                  <input 
                    type="date" 
                    value={newTripStart} 
                    onChange={(e) => setNewTripStart(e.target.value)}
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontFamily: 'Outfit' }}
                    required
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>End Date</label>
                  <input 
                    type="date" 
                    value={newTripEnd} 
                    onChange={(e) => setNewTripEnd(e.target.value)}
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontFamily: 'Outfit' }}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Group Members (Comma Separated)</label>
                <input 
                  type="text" 
                  placeholder="Alex, Jordan, Taylor, Sam"
                  value={newTripMembers} 
                  onChange={(e) => setNewTripMembers(e.target.value)}
                  style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontFamily: 'Outfit' }}
                  required
                />
              </div>

              <button type="submit" className="submit-btn" style={{ marginTop: '12px' }}>
                Create Group Planner Board
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
      
      {/* Keyframe spinner style for search loading */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spinner-loader-circle {
          display: inline-block;
          width: 40px;
          height: 40px;
          border: 4px solid #ec5b2415;
          border-top-color: #ec5b24;
          borderRadius: 50%;
          animation: spin 1s linear infinite;
          marginBottom: 16px;
        }
      `}</style>
    </div>
  );
}
