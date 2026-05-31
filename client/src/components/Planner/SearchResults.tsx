import React, { useState } from 'react';
import { Plane, Hotel, Train, Bus, Plus, Star, Filter } from 'lucide-react';
import { GroupTrip } from '../../types';

interface SearchResultsProps {
  searchType: 'flight' | 'hotel' | 'train' | 'bus';
  results: any[];
  trips: GroupTrip[];
  selectedTripId: string;
  onAddToItinerary: (tripId: string, item: any) => void;
  onBack: () => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  searchType,
  results,
  trips,
  selectedTripId,
  onAddToItinerary,
  onBack
}) => {
  const [priceRange, setPriceRange] = useState<number>(10000);
  const [targetTripId, setTargetTripId] = useState<string>(selectedTripId || (trips[0]?.id || ''));

  // Simple reactive filter logic
  const filteredResults = results.filter(item => {
    if (item.price > priceRange) return false;
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'flight': return <Plane size={22} />;
      case 'hotel': return <Hotel size={22} />;
      case 'train': return <Train size={22} />;
      case 'bus': return <Bus size={22} />;
      default: return <Plane size={22} />;
    }
  };

  return (
    <div className="results-page animate-fade-in">
      <div className="results-header">
        <button className="secondary-btn" onClick={onBack} style={{ marginBottom: '16px' }}>
          ← Back to Search
        </button>
        <h2 className="section-title">
          Available {searchType.charAt(0).toUpperCase() + searchType.slice(1)}s
        </h2>
        <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
          Showing options for your travel plan. Select one to add to your group discussion board.
        </p>
      </div>

      <div className="results-grid">
        {/* Left Filter Pane */}
        <div className="results-filters">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
            <Filter size={18} style={{ color: '#ec5b24' }} />
            <h3 style={{ fontWeight: 700 }}>Filters</h3>
          </div>

          <div className="filter-group">
            <label style={{ fontSize: '13px', fontWeight: 700, color: '#64748b' }}>ADD TO TRIP</label>
            <select
              value={targetTripId}
              onChange={(e) => setTargetTripId(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                fontFamily: 'Outfit',
                fontWeight: 600
              }}
            >
              {trips.length === 0 ? (
                <option value="">No Active Trips</option>
              ) : (
                trips.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))
              )}
            </select>
          </div>

          <div className="filter-group">
            <h4>Max Price</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
              <span>₹0</span>
              <span>₹{priceRange}</span>
            </div>
            <input
              type="range"
              min="500"
              max="15000"
              step="500"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              style={{ accentColor: '#ec5b24', cursor: 'pointer' }}
            />
          </div>

          <div className="filter-group">
            <h4>Sort By</h4>
            <label className="checkbox-label">
              <input type="radio" name="sort" defaultChecked />
              Cheapest First
            </label>
            <label className="checkbox-label">
              <input type="radio" name="sort" />
              Fastest First
            </label>
          </div>
        </div>

        {/* Right Results list */}
        <div className="results-list">
          {filteredResults.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <p style={{ fontWeight: 600, color: '#64748b' }}>No search results match your active filters.</p>
            </div>
          ) : (
            filteredResults.map(item => (
              <div className="result-card" key={item.id}>
                <div className="provider-logo-box">
                  {getIcon(searchType)}
                </div>

                <div className="result-details">
                  <div style={{ minWidth: '150px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700 }}>{item.title}</h3>
                    <p style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
                      {item.provider} {item.details.flightNo || item.details.trainNo || ''}
                    </p>
                  </div>

                  {searchType === 'hotel' ? (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
                        <Star size={16} fill="#f59e0b" color="#f59e0b" />
                        <span style={{ fontWeight: 700 }}>{item.details.rating}</span>
                      </div>
                      <p style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>{item.details.roomType}</p>
                    </div>
                  ) : (
                    <>
                      <div className="time-display">
                        <div className="time-val">{item.details.departure}</div>
                        <div className="time-label">Depart</div>
                      </div>

                      <div className="duration-line">
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>{item.details.duration}</span>
                        <div className="line-graphic"></div>
                        <span style={{ fontSize: '10px', fontWeight: 500, color: '#94a3b8' }}>Direct</span>
                      </div>

                      <div className="time-display">
                        <div className="time-val">{item.details.arrival}</div>
                        <div className="time-label">Arrive</div>
                      </div>
                    </>
                  )}

                  <div style={{ minWidth: '120px', fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
                    <p>{item.details.location}</p>
                  </div>
                </div>

                <div className="price-box">
                  <div className="price-val">₹{item.price.toLocaleString('en-IN')}</div>
                  <button
                    className="add-plan-btn"
                    onClick={() => {
                      if (!targetTripId) {
                        alert('Please create or select a Group Trip first!');
                        return;
                      }
                      onAddToItinerary(targetTripId, item);
                    }}
                  >
                    <Plus size={16} />
                    Add to Trip
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
