import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer>
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Travel Planner. Built for collaborative trip planning.</p>
        <p style={{ marginTop: '8px', fontSize: '12px' }}>
          Real-time collaborative flights, hotels, trains, and buses planner dashboard connected to Node.js backend.
        </p>
      </div>
    </footer>
  );
};
