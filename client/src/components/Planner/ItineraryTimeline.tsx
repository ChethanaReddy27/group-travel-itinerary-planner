import React from 'react';
import { Plane, Hotel, Train, Bus, MapPin, Trash2, Calendar } from 'lucide-react';
import { ItineraryItem } from '../../types';

interface ItineraryTimelineProps {
  itinerary: ItineraryItem[];
  onRemoveItem: (itemId: string) => void;
}

export const ItineraryTimeline: React.FC<ItineraryTimelineProps> = ({
  itinerary,
  onRemoveItem
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'flight': return <Plane size={18} />;
      case 'hotel': return <Hotel size={18} />;
      case 'train': return <Train size={18} />;
      case 'bus': return <Bus size={18} />;
      default: return <MapPin size={18} />;
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateStr;
    }
  };

  const sortedItinerary = [...itinerary].sort((a, b) => 
    new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
  );

  return (
    <div className="timeline-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Itinerary Timeline</h2>
          <p style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Chronological sequence of approved or suggested plans.</p>
        </div>
        <div style={{ background: '#f1f5f9', color: '#0f172a', padding: '6px 12px', borderRadius: '30px', fontSize: '12px', fontWeight: 700 }}>
          {itinerary.length} Item{itinerary.length !== 1 ? 's' : ''}
        </div>
      </div>

      {sortedItinerary.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
          <Calendar size={36} style={{ color: '#94a3b8', marginBottom: '12px' }} />
          <p style={{ fontWeight: 600 }}>Your itinerary is empty.</p>
          <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Search flights, hotels, trains, or buses above and click 'Add to Trip' to fill your timeline!</p>
        </div>
      ) : (
        <div className="timeline-items">
          {sortedItinerary.map((item) => (
            <div className="timeline-item animate-fade-in" key={item.id}>
              <div className="timeline-badge"></div>
              <div className="timeline-card-content">
                <div className="itinerary-info">
                  <div className="item-icon-box">
                    {getIcon(item.type)}
                  </div>
                  <div className="item-main-details">
                    <h3 style={{ textTransform: 'capitalize' }}>
                      {item.title}
                    </h3>
                    <p className="item-provider">
                      {item.provider} &bull; {formatDate(item.dateTime)}
                    </p>
                    
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                      <span className="item-added-by">Added by {item.addedBy}</span>
                      {item.price > 0 && (
                        <span style={{ fontSize: '11px', background: '#ec5b2415', color: '#ec5b24', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
                          ₹{item.price.toLocaleString('en-IN')}
                        </span>
                      )}
                      {item.details.roomType && (
                        <span style={{ fontSize: '11px', background: '#f1f5f9', color: '#64748b', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>
                          {item.details.roomType}
                        </span>
                      )}
                      {item.details.flightNo && (
                        <span style={{ fontSize: '11px', background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>
                          No: {item.details.flightNo}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="itinerary-actions">
                  <button 
                    className="delete-icon-btn" 
                    onClick={() => onRemoveItem(item.id)}
                    title="Remove from itinerary"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
