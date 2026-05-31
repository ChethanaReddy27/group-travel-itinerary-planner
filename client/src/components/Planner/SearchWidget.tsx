import React, { useState } from 'react';
import { Plane, Hotel, Train, Bus, MapPin, ArrowRightLeft, ShieldCheck } from 'lucide-react';

interface SearchWidgetProps {
  onSearch: (type: 'flight' | 'hotel' | 'train' | 'bus', query: any) => void;
  activeTab: 'flight' | 'hotel' | 'train' | 'bus';
  setActiveTab: (tab: 'flight' | 'hotel' | 'train' | 'bus') => void;
}

export const SearchWidget: React.FC<SearchWidgetProps> = ({ onSearch, activeTab, setActiveTab }) => {
  // Form states
  const [from, setFrom] = useState('Delhi (DEL)');
  const [to, setTo] = useState('Goa (GOI)');
  const [destination, setDestination] = useState('Goa, India');
  const [date, setDate] = useState('2026-06-01');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [travelClass, setTravelClass] = useState('Economy');
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('one-way');
  const [specialFare, setSpecialFare] = useState<string>('regular');
  const [freeCancellation, setFreeCancellation] = useState<boolean>(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'hotel') {
      onSearch(activeTab, { destination, date, passengers });
    } else {
      onSearch(activeTab, { from, to, date, returnDate, passengers, travelClass, tripType, specialFare });
    }
  };

  const swapCities = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  // Format date helper for the display text above the input
  const getFormattedDateText = (dateString: string) => {
    if (!dateString) return 'Select Date';
    try {
      const d = new Date(dateString);
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${days[d.getDay()]}, ${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]}`;
    } catch {
      return dateString;
    }
  };

  return (
    <div className="ixigo-search-widget animate-fade-in">
      {/* Category selector on top with page header on the right */}
      <div className="category-tabs-header-row">
        <div className="category-tabs">
          <button 
            type="button"
            className={`category-tab-btn ${activeTab === 'flight' ? 'active' : ''}`}
            onClick={() => setActiveTab('flight')}
          >
            <div className="category-tab-icon-box">
              <Plane size={20} />
            </div>
            <span>Flights</span>
          </button>
          
          <button 
            type="button"
            className={`category-tab-btn ${activeTab === 'hotel' ? 'active' : ''}`}
            onClick={() => setActiveTab('hotel')}
            style={{ position: 'relative' }}
          >
            <div className="category-tab-badge">Up to 50% Off</div>
            <div className="category-tab-icon-box">
              <Hotel size={20} />
            </div>
            <span>Hotels</span>
          </button>
          
          <button 
            type="button"
            className={`category-tab-btn ${activeTab === 'train' ? 'active' : ''}`}
            onClick={() => setActiveTab('train')}
          >
            <div className="category-tab-icon-box">
              <Train size={20} />
            </div>
            <span>Trains</span>
          </button>
          
          <button 
            type="button"
            className={`category-tab-btn ${activeTab === 'bus' ? 'active' : ''}`}
            onClick={() => setActiveTab('bus')}
          >
            <div className="category-tab-icon-box">
              <Bus size={20} />
            </div>
            <span>Buses</span>
          </button>
        </div>

        <div className="category-promo-title">
          {activeTab === 'flight' && 'Book International and Domestic Flights'}
          {activeTab === 'hotel' && 'Book International and Domestic Hotels'}
          {activeTab === 'train' && 'Book Fast Trains with Travel Planner'}
          {activeTab === 'bus' && 'Book Intercity Bus Tickets'}
        </div>
      </div>

      {/* Main Search Card */}
      <div className="ixigo-search-card">
        <form onSubmit={handleSubmit}>
          {/* Top Options Row: Trip Type Toggle & Hassle Free tag */}
          <div className="search-card-top-options">
            <div className="trip-type-toggles">
              <button
                type="button"
                className={`trip-type-pill ${tripType === 'one-way' ? 'active' : ''}`}
                onClick={() => setTripType('one-way')}
              >
                One Way
              </button>
              <button
                type="button"
                className={`trip-type-pill ${tripType === 'round-trip' ? 'active' : ''}`}
                onClick={() => setTripType('round-trip')}
              >
                Round Trip
              </button>
            </div>
            
            <div className="hassle-free-badge">
              <span className="check-icon">✓</span>
              <span>Hassle-Free Bookings</span>
            </div>
          </div>

          {/* Core Input Grid Row */}
          <div className="search-inputs-row">
            {activeTab === 'hotel' ? (
              <div className="search-input-cell cell-dest">
                <span className="cell-title-label">Where to?</span>
                <div className="cell-input-wrapper">
                  <MapPin size={18} className="cell-inner-icon" />
                  <input 
                    type="text" 
                    value={destination} 
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Enter City or Hotel Name"
                    required
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="search-input-cell cell-from">
                  <span className="cell-title-label">From</span>
                  <div className="cell-input-wrapper">
                    <input 
                      type="text" 
                      value={from} 
                      onChange={(e) => setFrom(e.target.value)}
                      placeholder="Enter Departure City"
                      required
                    />
                  </div>
                </div>

                <div className="search-input-cell cell-swap">
                  <button type="button" className="ixigo-swap-button" onClick={swapCities}>
                    <ArrowRightLeft size={14} />
                  </button>
                </div>

                <div className="search-input-cell cell-to">
                  <span className="cell-title-label">To</span>
                  <div className="cell-input-wrapper">
                    <input 
                      type="text" 
                      value={to} 
                      onChange={(e) => setTo(e.target.value)}
                      placeholder="Enter Destination City"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <div className="search-input-cell cell-date clickable-date-cell">
              <span className="cell-title-label">Departure</span>
              <div className="cell-input-wrapper date-picker-wrapper">
                <span className="date-display-bold-text">{getFormattedDateText(date)}</span>
                <input 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)}
                  className="invisible-date-input"
                  required
                />
              </div>
            </div>

            <div className="search-input-cell cell-date clickable-date-cell">
              <span className="cell-title-label">Return</span>
              <div className="cell-input-wrapper date-picker-wrapper">
                <span className="date-display-bold-text">
                  {tripType === 'one-way' ? 'Tap to Add Return' : getFormattedDateText(returnDate)}
                </span>
                <input 
                  type="date" 
                  value={returnDate} 
                  onChange={(e) => {
                    setReturnDate(e.target.value);
                    setTripType('round-trip');
                  }}
                  className="invisible-date-input"
                  placeholder="Select Return"
                />
              </div>
            </div>

            <div className="search-input-cell cell-travellers">
              <span className="cell-title-label">Travellers & Class</span>
              <div className="cell-input-wrapper cell-selector-group">
                <select 
                  value={passengers} 
                  onChange={(e) => setPassengers(Number(e.target.value))}
                  className="selector-count"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                    <option key={n} value={n}>{n} Traveller{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
                {activeTab !== 'hotel' && (
                  <select 
                    value={travelClass} 
                    onChange={(e) => setTravelClass(e.target.value)}
                    className="selector-class"
                  >
                    <option value="Economy">Economy</option>
                    <option value="Premium Economy">Premium Economy</option>
                    <option value="Business">Business</option>
                    <option value="First Class">First Class</option>
                  </select>
                )}
              </div>
            </div>

            {/* Orange Submit Button Flush inside row */}
            <div className="search-submit-cell">
              <button type="submit" className="ixigo-orange-search-btn">
                Search <span className="arrow">&gt;</span>
              </button>
            </div>
          </div>

          {/* Bottom Special Fares Row */}
          {activeTab === 'flight' && (
            <div className="special-fares-row">
              <span className="special-fares-label">Special Fares (Optional) :</span>
              <div className="special-fares-tags">
                <button
                  type="button"
                  className={`special-fare-tag ${specialFare === 'student' ? 'active' : ''}`}
                  onClick={() => setSpecialFare(specialFare === 'student' ? 'regular' : 'student')}
                >
                  Student
                </button>
                <button
                  type="button"
                  className={`special-fare-tag ${specialFare === 'senior' ? 'active' : ''}`}
                  onClick={() => setSpecialFare(specialFare === 'senior' ? 'regular' : 'senior')}
                >
                  Senior Citizen
                </button>
                <button
                  type="button"
                  className={`special-fare-tag ${specialFare === 'forces' ? 'active' : ''}`}
                  onClick={() => setSpecialFare(specialFare === 'forces' ? 'regular' : 'forces')}
                >
                  Armed Forces
                </button>
              </div>
            </div>
          )}

          {/* Cancellation Policy Banner */}
          <div className="cancellation-promo-banner">
            <label className="promo-checkbox-label">
              <input 
                type="checkbox" 
                checked={freeCancellation}
                onChange={(e) => setFreeCancellation(e.target.checked)}
              />
              <span className="checkmark-mock"></span>
              <span className="promo-text-content">
                <strong>Always opt for Free Cancellation</strong> &bull; ₹0 cancellation fee &bull; No-questions-asked instant refunds &bull; Priority customer service
              </span>
            </label>
            <div className="shield-icon-box">
              <ShieldCheck size={22} className="shield-svg" />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
