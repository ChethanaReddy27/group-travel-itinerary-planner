import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { Message } from '../../types';

interface ChatBoardProps {
  messages: Message[];
  currentUser: string;
  onSendMessage: (text: string) => void;
}

export const ChatBoard: React.FC<ChatBoardProps> = ({
  messages,
  currentUser,
  onSendMessage
}) => {
  const [text, setText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage(text);
    setText('');
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="chat-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
        <MessageSquare size={20} style={{ color: '#ec5b24' }} />
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Group Chat Board</h3>
          <p style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>Coordinate itinerary options with your fellow travelers.</p>
        </div>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div style={{ margin: 'auto', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
            <p style={{ fontWeight: 600 }}>No messages yet.</p>
            <p>Send a message to greet your group members!</p>
          </div>
        ) : (
          messages.map(msg => {
            const isOwn = msg.user === currentUser;
            return (
              <div 
                className={`chat-bubble ${isOwn ? 'own' : 'other'} animate-fade-in`} 
                key={msg.id}
              >
                <div className="bubble-user">{msg.user}</div>
                <div>{msg.text}</div>
                <div className="bubble-time">{formatTime(msg.timestamp)}</div>
              </div>
            );
          })
        )}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSend} className="chat-input-box">
        <input
          type="text"
          placeholder={`Type as ${currentUser}...`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <button type="submit" className="chat-send-btn">
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};
