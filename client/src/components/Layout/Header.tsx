import React from 'react';
import { Plane, Hotel, Train, Bus, Percent, HelpCircle, User, ChevronDown } from 'lucide-react';

interface HeaderProps {
  currentUser: string;
  onUserChange: (user: string) => void;
  onGoHome: () => void;
  currentView: 'home' | 'results' | 'planner';
  onNavigateView: (view: 'home' | 'planner') => void;
  activeTab: 'flight' | 'hotel' | 'train' | 'bus';
  setActiveTab: (tab: 'flight' | 'hotel' | 'train' | 'bus') => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentUser, 
  onUserChange, 
  onGoHome, 
  currentView,
  onNavigateView,
  activeTab,
  setActiveTab
}) => {
  const handleNavClick = (tab: 'flight' | 'hotel' | 'train' | 'bus') => {
    setActiveTab(tab);
    onGoHome();
  };

  return (
    <header className="ixigo-header">
      <div className="logo-section" onClick={onGoHome} style={{ cursor: 'pointer' }}>
        <div className="ixigo-logo-badge" style={{ fontSize: '20px', padding: '6px 16px' }}>Travel Planner</div>
      </div>

      <nav className="ixigo-nav">
        <div 
          className={`ixigo-nav-item ${currentView === 'home' && activeTab === 'flight' ? 'active' : ''}`}
          onClick={() => handleNavClick('flight')}
        >
          <Plane size={16} />
          <span>Flights</span>
        </div>
        <div 
          className={`ixigo-nav-item ${currentView === 'home' && activeTab === 'hotel' ? 'active' : ''}`}
          onClick={() => handleNavClick('hotel')}
        >
          <Hotel size={16} />
          <span>Hotels</span>
          <span className="nav-badge-discount">Up to 50% Off</span>
        </div>
        <div 
          className={`ixigo-nav-item ${currentView === 'home' && activeTab === 'train' ? 'active' : ''}`}
          onClick={() => handleNavClick('train')}
        >
          <Train size={16} />
          <span>Trains</span>
        </div>
        <div 
          className={`ixigo-nav-item ${currentView === 'home' && activeTab === 'bus' ? 'active' : ''}`}
          onClick={() => handleNavClick('bus')}
        >
          <Bus size={16} />
          <span>Buses</span>
        </div>
        <div 
          className={`ixigo-nav-item ${currentView === 'planner' ? 'active' : ''}`}
          onClick={() => onNavigateView('planner')}
        >
          <span style={{ fontSize: '15px' }}>📍</span>
          <span>Group Dashboard</span>
        </div>
      </nav>

      <div className="ixigo-header-right">
        <div className="header-link-item">
          <Percent size={15} />
          <span>Offers</span>
        </div>
        <div className="header-link-item">
          <HelpCircle size={15} />
          <span>Customer Service</span>
        </div>
        
        {/* User Switcher disguised as Log In profile */}
        <div className="ixigo-profile-switcher">
          <div className="profile-icon-box">
            <User size={14} className="user-silhouette" />
          </div>
          <div className="profile-selector-wrap">
            <span className="profile-label">Logged in:</span>
            <div className="select-dropdown-container">
              <select 
                value={currentUser} 
                onChange={(e) => onUserChange(e.target.value)}
                className="ixigo-user-select"
              >
                <option value="Alex">Alex (Leader)</option>
                <option value="Jordan">Jordan</option>
                <option value="Taylor">Taylor</option>
                <option value="Sam">Sam</option>
              </select>
              <ChevronDown size={12} className="dropdown-arrow-icon" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
