import React, { useState } from 'react';
import { User, Lock, Mail, Users, AlertCircle, X } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (user: { username: string; name: string }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  // Status states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const url = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const body = mode === 'login' 
      ? { username, password } 
      : { username, password, name, email };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Success callback
      onSuccess(data.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay animate-fade-in" style={{ zIndex: 1000 }}>
      <div className="modal-content auth-modal-card" style={{ maxWidth: '420px', padding: '28px' }}>
        <button className="close-btn" onClick={onClose} style={{ position: 'absolute', right: '16px', top: '16px' }}>
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ 
            display: 'inline-flex', 
            background: 'linear-gradient(135deg, #ec5b24, #f97316)', 
            color: 'white', 
            width: '48px', 
            height: '48px', 
            borderRadius: '12px', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(236,91,36,0.3)',
            marginBottom: '12px'
          }}>
            <Users size={24} />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800 }}>
            {mode === 'login' ? 'Sign In to Travel Planner' : 'Create an Account'}
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
            {mode === 'login' 
              ? 'Enter credentials to load itineraries' 
              : 'Join to collaborate with your friends'}
          </p>
        </div>

        {error && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            background: '#fef2f2', 
            border: '1px solid #fee2e2', 
            color: '#ef4444', 
            padding: '10px 14px', 
            borderRadius: '8px', 
            fontSize: '12px', 
            fontWeight: 600, 
            marginBottom: '16px' 
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {mode === 'register' && (
            <>
              <div className="form-group">
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                  <input 
                    type="text" 
                    placeholder="e.g. Rachel Green"
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    style={{ padding: '10px 10px 10px 38px', borderRadius: '8px', border: '1px solid #e2e8f0', fontFamily: 'Outfit', width: '100%', outline: 'none' }}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                  <input 
                    type="email" 
                    placeholder="rachel@example.com"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ padding: '10px 10px 10px 38px', borderRadius: '8px', border: '1px solid #e2e8f0', fontFamily: 'Outfit', width: '100%', outline: 'none' }}
                  />
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Username</label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
              <input 
                type="text" 
                placeholder="e.g. rachel"
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                style={{ padding: '10px 10px 10px 38px', borderRadius: '8px', border: '1px solid #e2e8f0', fontFamily: 'Outfit', width: '100%', outline: 'none' }}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
              <input 
                type="password" 
                placeholder="••••••••"
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                style={{ padding: '10px 10px 10px 38px', borderRadius: '8px', border: '1px solid #e2e8f0', fontFamily: 'Outfit', width: '100%', outline: 'none' }}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="submit-btn" 
            style={{ 
              marginTop: '8px', 
              padding: '12px', 
              fontSize: '14px', 
              background: 'linear-gradient(135deg, #ec5b24, #f97316)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(236,91,36,0.15)'
            }}
            disabled={loading}
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#64748b' }}>
          {mode === 'login' ? (
            <>
              New to Travel Planner?{' '}
              <span 
                onClick={() => setMode('register')} 
                style={{ color: '#ec5b24', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
              >
                Sign up now
              </span>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <span 
                onClick={() => setMode('login')} 
                style={{ color: '#ec5b24', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
              >
                Sign in instead
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
