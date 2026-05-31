import React, { useState } from 'react';
import { IndianRupee, Plus, Trash2 } from 'lucide-react';
import { Expense } from '../../types';

interface ExpenseSplitterProps {
  members: string[];
  expenses: Expense[];
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  onRemoveExpense: (expenseId: string) => void;
}

export const ExpenseSplitter: React.FC<ExpenseSplitterProps> = ({
  members,
  expenses,
  onAddExpense,
  onRemoveExpense
}) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState(members[0] || 'Alex');
  const [splitWith, setSplitWith] = useState<string[]>(members);

  const handleToggleSplit = (member: string) => {
    if (splitWith.includes(member)) {
      setSplitWith(splitWith.filter(m => m !== member));
    } else {
      setSplitWith([...splitWith, member]);
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || Number(amount) <= 0 || splitWith.length === 0) {
      alert('Please fill out all fields and select at least one person to split with.');
      return;
    }

    onAddExpense({
      description,
      amount: Number(amount),
      paidBy,
      splitWith,
      date: new Date().toISOString().split('T')[0]
    });

    setDescription('');
    setAmount('');
  };

  // Splitwise-style simplification algorithm
  const calculateBalances = () => {
    const balances: Record<string, number> = {};
    members.forEach(m => { balances[m] = 0; });

    expenses.forEach(exp => {
      const share = exp.amount / exp.splitWith.length;
      
      // PaidBy gets credited the full amount
      balances[exp.paidBy] += exp.amount;
      
      // SplitWith members get debited their share
      exp.splitWith.forEach(m => {
        if (balances[m] !== undefined) {
          balances[m] -= share;
        }
      });
    });

    // Simplify debts: separate creditors and debtors
    const debtors: { name: string; amount: number }[] = [];
    const creditors: { name: string; amount: number }[] = [];

    Object.keys(balances).forEach(name => {
      const bal = balances[name];
      if (bal < -0.01) {
        debtors.push({ name, amount: -bal });
      } else if (bal > 0.01) {
        creditors.push({ name, amount: bal });
      }
    });

    // Match them up
    const transactions: { debtor: string; creditor: string; amount: number }[] = [];
    let dIdx = 0;
    let cIdx = 0;

    while (dIdx < debtors.length && cIdx < creditors.length) {
      const debtor = debtors[dIdx];
      const creditor = creditors[cIdx];

      const minVal = Math.min(debtor.amount, creditor.amount);
      transactions.push({ debtor: debtor.name, creditor: creditor.name, amount: minVal });

      debtor.amount -= minVal;
      creditor.amount -= minVal;

      if (debtor.amount < 0.01) dIdx++;
      if (creditor.amount < 0.01) cIdx++;
    }

    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

    return { totalSpent, balances, transactions };
  };

  const { totalSpent, transactions } = calculateBalances();

  return (
    <div className="expense-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '16px' }}>
        <IndianRupee size={20} style={{ color: '#ec5b24' }} />
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Trip Budget & Expenses</h3>
          <p style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>Split bills and track balances among group members.</p>
        </div>
      </div>

      <div className="expenses-summary">
        <div className="summary-card">
          <div className="summary-val" style={{ color: '#0f172a' }}>
            ₹{totalSpent.toLocaleString('en-IN')}
          </div>
          <div className="summary-label">Total Spent</div>
        </div>
        <div className="summary-card">
          <div className="summary-val" style={{ color: '#ec5b24' }}>
            ₹{expenses.length > 0 ? Math.round(totalSpent / members.length).toLocaleString('en-IN') : 0}
          </div>
          <div className="summary-label">Per Person Share</div>
        </div>
      </div>

      {/* Add Expense Form */}
      <form onSubmit={handleAdd} className="expense-form">
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            placeholder="e.g. Lunch at beach resort"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ flex: 2, padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontFamily: 'Outfit' }}
            required
          />
          <input
            type="number"
            placeholder="Amount (₹)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontFamily: 'Outfit' }}
            required
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '13px' }}>
          <span style={{ fontWeight: 600, color: '#64748b' }}>Paid By:</span>
          <select
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
            style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontFamily: 'Outfit', fontWeight: 700 }}
          >
            {members.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Split With:</span>
          <div className="split-checkboxes">
            {members.map(m => (
              <label 
                key={m} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px', 
                  fontSize: '12px', 
                  fontWeight: 600, 
                  background: splitWith.includes(m) ? '#ec5b2415' : '#f1f5f9',
                  color: splitWith.includes(m) ? '#ec5b24' : '#64748b',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  border: splitWith.includes(m) ? '1px solid rgba(236, 91, 36, 0.3)' : '1px solid transparent'
                }}
              >
                <input
                  type="checkbox"
                  checked={splitWith.includes(m)}
                  onChange={() => handleToggleSplit(m)}
                  style={{ display: 'none' }}
                />
                {m}
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="submit-btn" style={{ padding: '8px 16px', fontSize: '13px' }}>
          <Plus size={14} /> Log Expense
        </button>
      </form>

      {/* Expense ledger list */}
      <div className="expense-list" style={{ maxHeight: '180px', overflowY: 'auto' }}>
        {expenses.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '12px', padding: '12px' }}>No expenses logged yet.</p>
        ) : (
          expenses.map(e => (
            <div className="expense-item" key={e.id}>
              <div>
                <p style={{ fontWeight: 700, fontSize: '13px' }}>{e.description}</p>
                <p style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>
                  Paid by <span style={{ fontWeight: 700 }}>{e.paidBy}</span> &bull; split with {e.splitWith.join(', ')}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 800, fontSize: '14px' }}>₹{e.amount}</span>
                <button
                  onClick={() => onRemoveExpense(e.id)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                  title="Delete bill"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Debt Simplification Balances */}
      {transactions.length > 0 && (
        <div className="balance-card">
          <h4>Simplest Settlement Balances</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {transactions.map((t, idx) => (
              <div className="balance-row" key={idx}>
                <span>{t.debtor} owes {t.creditor}</span>
                <span style={{ color: '#0f172a' }}>₹{Math.round(t.amount).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
