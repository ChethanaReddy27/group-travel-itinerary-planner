import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  ChevronDown, 
  Send,
  Phone
} from 'lucide-react';

interface ModalWrapperProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({ title, onClose, children }) => (
  <div className="modal-overlay animate-fade-in" style={{ zIndex: 1001 }}>
    <div className="modal-content" style={{ maxWidth: '540px', padding: '24px', borderRadius: '20px' }}>
      <div className="modal-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '14px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 800 }}>{title}</h2>
        <button className="close-btn" onClick={onClose}>
          <X size={18} />
        </button>
      </div>
      {children}
    </div>
  </div>
);

// 1. FLIGHT TRACKER MODAL
export const FlightTrackerModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [flightNo, setFlightNo] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!flightNo.trim()) return;
    setLoading(true);
    
    setTimeout(() => {
      setResult({
        flightNo: flightNo.toUpperCase().trim(),
        airline: 'IndiGo',
        status: 'ON TIME',
        route: 'DEL ➔ GOI',
        departureTime: '10:00 AM (Terminal 3)',
        arrivalTime: '12:15 PM (Terminal 1)',
        gate: 'Gate 14',
        belt: 'Belt 4',
        delay: 'No delays reported'
      });
      setLoading(false);
    }, 800);
  };

  return (
    <ModalWrapper title="Live Flight Status Tracker" onClose={onClose}>
      <form onSubmit={handleTrack} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <input 
          type="text" 
          placeholder="Enter Flight Number (e.g. 6E-6015)" 
          value={flightNo}
          onChange={(e) => setFlightNo(e.target.value)}
          style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontFamily: 'Outfit', outline: 'none' }}
          required
        />
        <button type="submit" className="submit-btn" style={{ padding: '10px 20px', borderRadius: '8px' }}>
          {loading ? 'Tracking...' : 'Track'}
        </button>
      </form>

      {result && (
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '16px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontWeight: 800, fontSize: '15px' }}>{result.flightNo} Status</span>
            <span style={{ background: '#dcfce7', color: '#15803d', fontWeight: 800, fontSize: '11px', padding: '4px 10px', borderRadius: '20px' }}>
              {result.status}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
            <div>
              <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 600 }}>ROUTE</span>
              <p style={{ fontWeight: 700, fontSize: '14px', marginTop: '2px' }}>{result.route}</p>
            </div>
            <div>
              <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 600 }}>DELAY</span>
              <p style={{ fontWeight: 700, color: '#16a34a', marginTop: '2px' }}>{result.delay}</p>
            </div>
            <div>
              <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 600 }}>DEPARTURE</span>
              <p style={{ fontWeight: 600, marginTop: '2px' }}>{result.departureTime}</p>
            </div>
            <div>
              <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 600 }}>ARRIVAL</span>
              <p style={{ fontWeight: 600, marginTop: '2px' }}>{result.arrivalTime}</p>
            </div>
            <div>
              <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 600 }}>BOARDING GATE</span>
              <p style={{ fontWeight: 700, color: '#ec5b24', marginTop: '2px' }}>{result.gate}</p>
            </div>
            <div>
              <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 600 }}>BAGGAGE BELT</span>
              <p style={{ fontWeight: 700, color: '#3b82f6', marginTop: '2px' }}>{result.belt}</p>
            </div>
          </div>
        </div>
      )}
    </ModalWrapper>
  );
};

// 2. CREDIT CARD MODAL
export const CreditCardModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [phone, setPhone] = useState('');

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <ModalWrapper title="Travel Planner Premium Credit Card" onClose={onClose}>
      {!submitted ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', color: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #334155', position: 'relative', overflow: 'hidden', height: '160px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#f97316' }}>PREMIUM TRAVEL</span>
              <h3 style={{ fontSize: '18px', fontWeight: 800, marginTop: '4px' }}>Travel Planner Elite</h3>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>PLATINUM VISA</span>
              <span style={{ fontSize: '24px' }}>💳</span>
            </div>
          </div>

          <div>
            <h4 style={{ fontWeight: 800, fontSize: '14px', marginBottom: '8px' }}>Card Benefits:</h4>
            <ul style={{ fontSize: '13px', color: '#475569', paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><strong>5% Cashback</strong> on all flights and hotels booked in-app.</li>
              <li><strong>Unlimited Lounge Access</strong> at major airports.</li>
              <li><strong>Zero Forex Markup fees</strong> on international planning bookings.</li>
              <li><strong>10,000 Welcome Miles</strong> credited immediately on activation.</li>
            </ul>
          </div>

          <form onSubmit={handleApply} style={{ display: 'flex', gap: '8px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
            <input 
              type="tel" 
              placeholder="Enter Mobile Number to check eligibility" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontFamily: 'Outfit', outline: 'none' }}
              required
            />
            <button type="submit" className="submit-btn" style={{ padding: '10px 20px', borderRadius: '8px' }}>
              Apply Now
            </button>
          </form>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '32px', color: '#16a34a', marginBottom: '12px' }}>✓</div>
          <h3 style={{ fontWeight: 800 }}>Application Submitted!</h3>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '8px' }}>
            We've sent an eligibility check SMS to your mobile. Please check your phone to complete your activation.
          </p>
        </div>
      )}
    </ModalWrapper>
  );
};

// 3. VISA MODAL
export const VisaModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [country, setCountry] = useState('UAE');
  
  const visaData: Record<string, any> = {
    UAE: { fee: '₹6,500', time: '3-4 Days', documents: ['Passport Scanned Copy', 'Passport Size Photo', 'Confirmed Return Tickets'], type: 'E-Visa (30 Days)' },
    Schengen: { fee: '₹8,200', time: '10-15 Days', documents: ['Passport Original', 'Bank Statements (6 Months)', 'Employment Letter', 'Flight/Hotel Vouchers'], type: 'Sticker Visa' },
    Thailand: { fee: '₹0 (Visa on Arrival)', time: 'Instant', documents: ['Passport', 'Boarding Pass', '₹20,000 funds proof'], type: 'Visa on Arrival / E-VOA' },
    Singapore: { fee: '₹2,800', time: '4-5 Days', documents: ['Passport Copy', 'Form 14A', 'Letter of Introduction / Hotel Voucher'], type: 'E-Visa (Multi-Entry)' },
    USA: { fee: '₹15,540', time: 'Requires Interview slot booking', documents: ['DS-160 Confirmation', 'Valid Passport', 'Income Tax Returns (3 Years)'], type: 'B1/B2 Visa (10 Years)' }
  };

  const selected = visaData[country];

  return (
    <ModalWrapper title="Visa Application Assistance" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="form-group">
          <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Select Destination Country</label>
          <select 
            value={country} 
            onChange={(e) => setCountry(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontFamily: 'Outfit', fontWeight: 700 }}
          >
            <option value="UAE">United Arab Emirates (UAE)</option>
            <option value="Schengen">Schengen Area (Europe)</option>
            <option value="Thailand">Thailand</option>
            <option value="Singapore">Singapore</option>
            <option value="USA">United States of America (USA)</option>
          </select>
        </div>

        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', marginBottom: '12px', fontSize: '13px' }}>
            <span>VISA TYPE</span>
            <strong style={{ color: '#ec5b24' }}>{selected.type}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', marginBottom: '12px', fontSize: '13px' }}>
            <span>VISA FEE</span>
            <strong>{selected.fee}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', marginBottom: '12px', fontSize: '13px' }}>
            <span>PROCESSING TIME</span>
            <strong>{selected.time}</strong>
          </div>

          <div style={{ marginTop: '12px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>REQUIRED DOCUMENTS</span>
            <ul style={{ fontSize: '12px', color: '#475569', marginTop: '6px', paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {selected.documents.map((doc: string, i: number) => (
                <li key={i}>{doc}</li>
              ))}
            </ul>
          </div>
        </div>

        <button 
          className="submit-btn" 
          onClick={() => alert(`Starting application portal for ${country}. Our Visa agent will contact you shortly!`)}
          style={{ width: '100%', padding: '12px' }}
        >
          Apply for {country} Visa
        </button>
      </div>
    </ModalWrapper>
  );
};

// 4. FARE ALERT MODAL
export const FareAlertModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [from, setFrom] = useState('Delhi (DEL)');
  const [to, setTo] = useState('Goa (GOI)');
  const [price, setPrice] = useState('4500');
  const [submitted, setSubmitted] = useState(false);

  const handleSetAlert = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <ModalWrapper title="Set Travel Price Alert" onClose={onClose}>
      {!submitted ? (
        <form onSubmit={handleSetAlert} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>From</label>
              <input 
                type="text" 
                value={from} 
                onChange={(e) => setFrom(e.target.value)} 
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontFamily: 'Outfit' }}
                required
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>To</label>
              <input 
                type="text" 
                value={to} 
                onChange={(e) => setTo(e.target.value)} 
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontFamily: 'Outfit' }}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Alert Me When Fare Drops Below (₹)</label>
            <input 
              type="number" 
              value={price} 
              onChange={(e) => setPrice(e.target.value)} 
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontFamily: 'Outfit', fontWeight: 700 }}
              required
            />
          </div>

          <button type="submit" className="submit-btn" style={{ width: '100%', padding: '12px' }}>
            Activate Alert Pin
          </button>
        </form>
      ) : (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '32px', color: '#16a34a', marginBottom: '12px' }}>🔔</div>
          <h3 style={{ fontWeight: 800 }}>Fare Alert Activated!</h3>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '8px' }}>
            We'll send push notifications and emails when fares from {from} to {to} drop below ₹{Number(price).toLocaleString('en-IN')}.
          </p>
        </div>
      )}
    </ModalWrapper>
  );
};

// 5. CUSTOMER SERVICE MODAL (FAQ + AI CHATBOT)
interface ChatMsg {
  sender: 'user' | 'bot';
  text: string;
}

export const CustomerServiceModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'faq' | 'chat'>('faq');
  const [chatLog, setChatLog] = useState<ChatMsg[]>([
    { sender: 'bot', text: 'Hi! I am the Travel Planner support desk helper. How can I assist you with your group bookings today?' }
  ]);
  const [msgInput, setMsgInput] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog]);

  const faqs = [
    { q: 'How do group travel itineraries work?', a: 'You can create a Group Planner trip on the homepage. Once created, perform any flight, hotel, train, or bus search on the website, and click "Add to Trip" to add options to your shared itinerary dashboard.' },
    { q: 'How do we vote on different options?', a: 'Navigate to the group trip dashboard, click the "Voting Board" tab, and click upvote (✓) or downvote (✗) next to each itinerary card. It reflects the group consensus immediately.' },
    { q: 'How does the Expense Splitter split bills?', a: 'Add expenses inside the "Expense Splitter" tab, selecting who paid and checking who shares the cost. The dashboard automatically calculates balances and displays simplified transaction settlements.' },
    { q: 'What is Travel Planner Assured Cancellation?', a: 'Assured bookings qualify for ₹0 cancellation fees. If you cancel your tickets, your refund is processed immediately to your linked bank account without any documentation.' }
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgInput.trim()) return;

    const userText = msgInput.trim();
    const newLog = [...chatLog, { sender: 'user' as const, text: userText }];
    setChatLog(newLog);
    setMsgInput('');

    // Generate Bot Response
    setTimeout(() => {
      let reply = "Thanks for asking! I'm here to help. You can also reach our customer desk via WhatsApp support at +91 99999-XXXXX or call 1800-PLANNER.";
      const query = userText.toLowerCase();

      if (query.includes('vote') || query.includes('decision') || query.includes('like')) {
        reply = 'To vote on options, open your Group Trip Dashboard, select the "Voting Board" tab, and click upvote or downvote. Votes cast by you are displayed alongside other members.';
      } else if (query.includes('cancel') || query.includes('assured') || query.includes('refund')) {
        reply = 'Assured bookings qualify for ₹0 cancellation fees and instant refunds. You can cancel directly from the Itinerary Timeline by clicking delete.';
      } else if (query.includes('expense') || query.includes('split') || query.includes('pay') || query.includes('money')) {
        reply = 'The Expense Splitter divides bills among selected members and simplifies transactions automatically, showing exactly who owes whom how much.';
      } else if (query.includes('add') || query.includes('plan') || query.includes('search')) {
        reply = 'Do a travel search on the home tab, click the "+ Add to Trip" button on any card, and choose your active trip. The flight or hotel will appear in your group itinerary.';
      }

      setChatLog(prev => [...prev, { sender: 'bot' as const, text: reply }]);
    }, 600);
  };

  return (
    <ModalWrapper title="Travel Planner Help & Support" onClose={onClose}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', background: '#f1f5f9', padding: '4px', borderRadius: '30px' }}>
        <button 
          onClick={() => setActiveTab('faq')}
          style={{ 
            flex: 1, 
            padding: '8px 16px', 
            borderRadius: '20px', 
            border: 'none', 
            background: activeTab === 'faq' ? 'white' : 'transparent',
            fontWeight: 700, 
            fontSize: '13px', 
            cursor: 'pointer',
            boxShadow: activeTab === 'faq' ? '0 2px 5px rgba(0,0,0,0.05)' : 'none',
            color: activeTab === 'faq' ? '#ec5b24' : '#64748b'
          }}
        >
          Frequently Asked Questions
        </button>
        <button 
          onClick={() => setActiveTab('chat')}
          style={{ 
            flex: 1, 
            padding: '8px 16px', 
            borderRadius: '20px', 
            border: 'none', 
            background: activeTab === 'chat' ? 'white' : 'transparent',
            fontWeight: 700, 
            fontSize: '13px', 
            cursor: 'pointer',
            boxShadow: activeTab === 'chat' ? '0 2px 5px rgba(0,0,0,0.05)' : 'none',
            color: activeTab === 'chat' ? '#ec5b24' : '#64748b'
          }}
        >
          Chat Support Bot
        </button>
      </div>

      {activeTab === 'faq' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '350px', overflowY: 'auto' }}>
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div 
                key={index} 
                style={{ 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '10px', 
                  overflow: 'hidden', 
                  background: 'white' 
                }}
              >
                <div 
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  style={{ 
                    padding: '14px 18px', 
                    fontWeight: 700, 
                    fontSize: '13px', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    cursor: 'pointer',
                    background: isOpen ? '#fafafa' : 'white'
                  }}
                >
                  <span>{faq.q}</span>
                  <ChevronDown 
                    size={16} 
                    style={{ 
                      transform: isOpen ? 'rotate(180deg)' : 'none', 
                      transition: 'transform 0.2s', 
                      color: '#64748b' 
                    }} 
                  />
                </div>
                {isOpen && (
                  <div style={{ padding: '14px 18px', fontSize: '13px', color: '#475569', borderTop: '1px solid #e2e8f0', lineHeight: 1.5 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}

          <div style={{ display: 'flex', gap: '12px', marginTop: '16px', padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', alignItems: 'center' }}>
            <Phone size={20} style={{ color: '#ec5b24' }} />
            <div style={{ fontSize: '13px' }}>
              <p style={{ fontWeight: 700 }}>Still need help?</p>
              <p style={{ color: '#64748b', fontSize: '11px', marginTop: '2px' }}>Call our Toll-Free: <strong>1800-PLANNER</strong> or email <strong>support@travelplanner.com</strong></p>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', height: '350px' }}>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '4px', marginBottom: '12px' }}>
            {chatLog.map((msg, i) => (
              <div 
                key={i} 
                style={{ 
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  background: msg.sender === 'user' ? '#ec5b24' : '#f1f5f9',
                  color: msg.sender === 'user' ? 'white' : '#0f172a',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  maxWidth: '85%',
                  fontSize: '13px',
                  lineHeight: '1.4'
                }}
              >
                {msg.text}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="text" 
              placeholder="Ask a question (e.g. how do we vote?)" 
              value={msgInput}
              onChange={(e) => setMsgInput(e.target.value)}
              style={{ flex: 1, padding: '10px 14px', borderRadius: '30px', border: '1px solid #e2e8f0', fontFamily: 'Outfit', outline: 'none' }}
            />
            <button 
              type="submit" 
              style={{ 
                background: '#ec5b24', 
                color: 'white', 
                border: 'none', 
                padding: '10px', 
                borderRadius: '50%', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </ModalWrapper>
  );
};
