// src/app/expense/create/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { expenseApi, CreateExpensePayload, SplitType } from '@/lib/api/expenseApi';

export default function CreateExpensePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expense, setExpense] = useState<CreateExpensePayload>({
    title: '',
    description: '',
    amount: 0,
    split_type: 'EQUAL',
    splits: [{ user: 0, amount: 0 }]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await expenseApi.createExpense(expense);
      router.push('/expense');
    } catch (err) {
      setError('Failed to create expense');
    } finally {
      setLoading(false);
    }
  };

  const handleSplitChange = (index: number, field: keyof typeof expense.splits[0], value: number) => {
    const newSplits = [...expense.splits];
    newSplits[index] = { ...newSplits[index], [field]: value };
    setExpense({ ...expense, splits: newSplits });
  };

  const addSplit = () => {
    setExpense({
      ...expense,
      splits: [...expense.splits, { user: 0, amount: 0 }]
    });
  };

  const removeSplit = (index: number) => {
    const newSplits = expense.splits.filter((_, i) => i !== index);
    setExpense({ ...expense, splits: newSplits });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6">Create New Expense</h1>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={expense.title}
              onChange={(e) => setExpense({ ...expense, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={expense.description}
              onChange={(e) => setExpense({ ...expense, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={expense.amount}
              onChange={(e) => setExpense({ ...expense, amount: parseFloat(e.target.value) })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Split Type</label>
            <select
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={expense.split_type}
              onChange={(e) => setExpense({ ...expense, split_type: e.target.value as SplitType })}
            >
              <option value="EQUAL">Equal</option>
              <option value="EXACT">Exact</option>
              <option value="PERCENTAGE">Percentage</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Splits</label>
            {expense.splits.map((split, index) => (
              <div key={index} className="flex gap-4 mb-2">
                <input
                  type="number"
                  placeholder="User ID"
                  required
                  className="flex-1 border border-gray-300 rounded-md shadow-sm p-2"
                  value={split.user}
                  onChange={(e) => handleSplitChange(index, 'user', parseInt(e.target.value))}
                />
                <input
                  type="number"
                  placeholder={expense.split_type === 'PERCENTAGE' ? 'Percentage' : 'Amount'}
                  required
                  className="flex-1 border border-gray-300 rounded-md shadow-sm p-2"
                  value={expense.split_type === 'PERCENTAGE' ? split.percentage : split.amount}
                  onChange={(e) => handleSplitChange(index, expense.split_type === 'PERCENTAGE' ? 'percentage' : 'amount', parseFloat(e.target.value))}
                />
                {expense.splits.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSplit(index)}
                    className="text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addSplit}
              className="mt-2 text-blue-500 hover:text-blue-600"
            >
              Add Split
            </button>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
