import React from 'react';
import { ThumbsUp, ThumbsDown, Vote as VoteIcon } from 'lucide-react';
import { ItineraryItem, Vote } from '../../types';

interface VotingBoardProps {
  itinerary: ItineraryItem[];
  votes: Vote[];
  currentUser: string;
  onCastVote: (itemId: string, voteVal: 1 | -1 | 0) => void;
}

export const VotingBoard: React.FC<VotingBoardProps> = ({
  itinerary,
  votes,
  currentUser,
  onCastVote
}) => {
  
  const getItemVotes = (itemId: string) => {
    const itemVotes = votes.filter(v => v.itemId === itemId);
    const upvotes = itemVotes.filter(v => v.vote === 1).map(v => v.user);
    const downvotes = itemVotes.filter(v => v.vote === -1).map(v => v.user);
    
    // Find current user's vote
    const userVoteRecord = itemVotes.find(v => v.user === currentUser);
    const userVote = userVoteRecord ? userVoteRecord.vote : 0; // 0 = no vote

    return { upvotes, downvotes, userVote };
  };

  return (
    <div className="voting-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '16px' }}>
        <VoteIcon size={20} style={{ color: '#ec5b24' }} />
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Group Decision Polls</h3>
          <p style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>Vote on suggested travel dates, flights, and hotels.</p>
        </div>
      </div>

      {itinerary.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '30px 10px', color: '#64748b', fontSize: '13px' }}>
          <p style={{ fontWeight: 600 }}>No items to vote on yet.</p>
          <p style={{ color: '#94a3b8', marginTop: '4px' }}>Add items from the search widget above to start group voting.</p>
        </div>
      ) : (
        <div className="voting-list">
          {itinerary.map(item => {
            const { upvotes, downvotes, userVote } = getItemVotes(item.id);
            return (
              <div className="vote-item-card animate-fade-in" key={item.id}>
                <div className="vote-item-header">
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'capitalize' }}>{item.title}</h4>
                    <p style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>{item.provider}</p>
                  </div>
                  
                  <div className="vote-actions">
                    <button 
                      className={`vote-btn ${userVote === 1 ? 'upvoted' : ''}`}
                      onClick={() => onCastVote(item.id, userVote === 1 ? 0 : 1)}
                      title="Looks Good"
                    >
                      <ThumbsUp size={13} />
                      <span>{upvotes.length}</span>
                    </button>
                    <button 
                      className={`vote-btn ${userVote === -1 ? 'downvoted' : ''}`}
                      onClick={() => onCastVote(item.id, userVote === -1 ? 0 : -1)}
                      title="No, change this"
                    >
                      <ThumbsDown size={13} />
                      <span>{downvotes.length}</span>
                    </button>
                  </div>
                </div>

                {/* Voters List Display */}
                {upvotes.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#10b981', fontWeight: 600, marginTop: '8px' }}>
                    <span>Approved by:</span>
                    <div className="voters-avatars">
                      {upvotes.map(name => (
                        <div 
                          key={name} 
                          title={name}
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            background: '#10b981',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '9px',
                            fontWeight: 700
                          }}
                        >
                          {name.charAt(0)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {downvotes.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#ef4444', fontWeight: 600, marginTop: '4px' }}>
                    <span>Disliked by:</span>
                    <div className="voters-avatars">
                      {downvotes.map(name => (
                        <div 
                          key={name} 
                          title={name}
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            background: '#ef4444',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '9px',
                            fontWeight: 700
                          }}
                        >
                          {name.charAt(0)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
