import React from 'react';
import { Plane, Hotel, Train, Bus, HelpCircle } from 'lucide-react';

interface HeaderProps {
  currentUserProfile: { username: string; name: string } | null;
  onLogout: () => void;
  onOpenLogin: () => void;
  onOpenCustomerService: () => void;
  onGoHome: () => void;
  currentView: 'home' | 'results' | 'planner';
  onNavigateView: (view: 'home' | 'planner') => void;
  activeTab: 'flight' | 'hotel' | 'train' | 'bus';
  setActiveTab: (tab: 'flight' | 'hotel' | 'train' | 'bus') => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentUserProfile, 
  onLogout,
  onOpenLogin,
  onOpenCustomerService,
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
        <div 
          className="header-link-item" 
          onClick={onOpenCustomerService} 
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <HelpCircle size={15} />
          <span>Customer Service</span>
        </div>
        
        {/* Auth profile controls */}
        {currentUserProfile ? (
          <div className="ixigo-profile-switcher" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="profile-icon-box" style={{ background: '#ec5b24', color: 'white', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontWeight: 800, fontSize: '12px' }}>{currentUserProfile.name.charAt(0)}</span>
            </div>
            <div className="profile-selector-wrap" style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="profile-label" style={{ fontSize: '9px', fontWeight: 700, color: '#ec5b24', textTransform: 'uppercase' }}>Logged in</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap' }}>{currentUserProfile.name}</span>
            </div>
            <button 
              onClick={onLogout}
              style={{
                background: '#e2e8f0',
                border: 'none',
                color: '#475569',
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                marginLeft: '8px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.background = '#ef4444';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#475569';
                e.currentTarget.style.background = '#e2e8f0';
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <button 
            onClick={onOpenLogin}
            className="submit-btn" 
            style={{ 
              padding: '8px 20px', 
              fontSize: '13px', 
              background: 'linear-gradient(135deg, #ec5b24, #f97316)',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(236,91,36,0.2)'
            }}
          >
            Log In / Sign Up
          </button>
        )}
      </div>
    </header>
  );
};
