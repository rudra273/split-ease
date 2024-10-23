// src/app/expense/create/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { expenseApi, CreateExpensePayload, SplitType, ExpenseSplit } from '@/lib/api/expenseApi';

export default function CreateExpensePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expense, setExpense] = useState<CreateExpensePayload>({
    title: '',
    description: '',
    amount: 0,
    split_type: 'EQUAL',
    splits: [{ username: '', amount: 0 }]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payloadSplits = expense.splits.map(({ username, amount, percentage }) => ({
        username,
        ...(amount !== undefined && { amount }),
        ...(percentage !== undefined && { percentage })
      }));

      const payload: CreateExpensePayload = {
        ...expense,
        splits: payloadSplits
      };

      await expenseApi.createExpense(payload);
      router.push('/expense');
    } catch (err) {
      setError('Failed to create expense');
    } finally {
      setLoading(false);
    }
  };

  const handleSplitChange = (index: number, field: keyof ExpenseSplit, value: string | number) => {
    const newSplits = [...expense.splits];
    if (field === 'username') {
      newSplits[index] = { ...newSplits[index], [field]: value as string };
    } else {
      newSplits[index] = { ...newSplits[index], [field]: parseFloat(value as string) || 0 };
    }
    setExpense({ ...expense, splits: newSplits });
  };

  const addSplit = () => {
    setExpense({
      ...expense,
      splits: [...expense.splits, { username: '', amount: 0 }]
    });
  };

  const removeSplit = (index: number) => {
    const newSplits = expense.splits.filter((_, i) => i !== index);
    setExpense({ ...expense, splits: newSplits });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-blue-500 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Create New Expense</h1>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center gap-2 text-red-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={expense.title}
                    onChange={(e) => setExpense({ ...expense, title: e.target.value })}
                    placeholder="Enter expense title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      className="w-full border border-gray-300 rounded-lg shadow-sm p-3 pl-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={expense.amount}
                      onChange={(e) => setExpense({ ...expense, amount: parseFloat(e.target.value) })}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Split Type</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={expense.split_type}
                    onChange={(e) => setExpense({ ...expense, split_type: e.target.value as SplitType })}
                  >
                    <option value="EQUAL">Equal Split</option>
                    <option value="EXACT">Exact Amount</option>
                    <option value="PERCENTAGE">Percentage Split</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg shadow-sm p-3 h-40 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={expense.description}
                  onChange={(e) => setExpense({ ...expense, description: e.target.value })}
                  placeholder="Add expense details..."
                />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-gray-700">Split Details</label>
                <button
                  type="button"
                  onClick={addSplit}
                  className="flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Split
                </button>
              </div>

              <div className="space-y-3">
                {expense.splits.map((split, index) => (
                  <div key={index} className="flex gap-4 items-center p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Username"
                        required
                        className="w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={split.username}
                        onChange={(e) => handleSplitChange(index, 'username', e.target.value)}
                      />
                    </div>
                    {expense.split_type !== 'EQUAL' && (
                      <div className="flex-1">
                        <input
                          type="number"
                          placeholder={expense.split_type === 'PERCENTAGE' ? 'Percentage' : 'Amount'}
                          required
                          min="0"
                          step={expense.split_type === 'PERCENTAGE' ? '1' : '0.01'}
                          className="w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={expense.split_type === 'PERCENTAGE' ? split.percentage : split.amount}
                          onChange={(e) => handleSplitChange(index, expense.split_type === 'PERCENTAGE' ? 'percentage' : 'amount', e.target.value)}
                        />
                      </div>
                    )}
                    {expense.splits.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSplit(index)}
                        className="p-2 text-red-500 hover:text-red-600 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Create Expense
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}