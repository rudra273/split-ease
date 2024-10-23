// 'use client';
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { expenseApi, Expense, UpdateExpensePayload, SplitType } from '@/lib/api/expenseApi';

export default function ExpenseDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedExpense, setEditedExpense] = useState<UpdateExpensePayload | null>(null);

  // Existing fetch and handler functions remain the same
  useEffect(() => {
    fetchExpense();
  }, []);

  const fetchExpense = async () => {
    try {
      const data = await expenseApi.getExpense(parseInt(params.id));
      setExpense(data);
      setEditedExpense({
        id: data.id!,
        title: data.title,
        description: data.description || '',
        amount: parseFloat(data.amount),
        split_type: data.split_type,
        splits: data.splits.map(split => ({
          username: split.user_username || '',
          amount: split.amount ? parseFloat(split.amount.toString()) : undefined,
          percentage: split.percentage ? parseFloat(split.percentage.toString()) : undefined
        }))
      });
    } catch (err) {
      setError('Failed to load expense');
    } finally {
      setLoading(false);
    }
  };

  // Keep all other handler functions the same
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editedExpense) return;

    try {
      const updated = await expenseApi.updateExpense(editedExpense);
      setExpense(updated);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update expense');
    }
  };

  const handleDelete = async () => {
    if (!expense?.id || !window.confirm('Are you sure you want to delete this expense?')) return;

    try {
      await expenseApi.deleteExpense(expense.id);
      router.push('/expense');
    } catch (err) {
      setError('Failed to delete expense');
    }
  };

  const handleSplitChange = (index: number, field: string, value: string | number) => {
    if (!editedExpense) return;

    const newSplits = [...editedExpense.splits];
    newSplits[index] = {
      ...newSplits[index],
      [field]: field === 'username' ? value : parseFloat(value as string) || 0
    };
    setEditedExpense({ ...editedExpense, splits: newSplits });
  };

  const addSplit = () => {
    if (!editedExpense) return;
    setEditedExpense({
      ...editedExpense,
      splits: [...editedExpense.splits, { username: '', amount: 0, percentage: 0 }]
    });
  };

  const removeSplit = (index: number) => {
    if (!editedExpense) return;
    const newSplits = editedExpense.splits.filter((_, i) => i !== index);
    setEditedExpense({ ...editedExpense, splits: newSplits });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (!expense || !editedExpense) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-red-500 text-xl font-semibold">Expense not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {isEditing ? (
            <form onSubmit={handleUpdate} className="p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={editedExpense.title}
                    onChange={(e) => setEditedExpense({ ...editedExpense, title: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={editedExpense.description}
                    onChange={(e) => setEditedExpense({ ...editedExpense, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount</label>
                  <div className="mt-1 relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      className="pl-7 block w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={editedExpense.amount}
                      onChange={(e) => setEditedExpense({ ...editedExpense, amount: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Split Type</label>
                  <select
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={editedExpense.split_type}
                    onChange={(e) => setEditedExpense({ ...editedExpense, split_type: e.target.value as SplitType })}
                  >
                    <option value="EQUAL">Equal Split</option>
                    <option value="EXACT">Exact Amount</option>
                    <option value="PERCENTAGE">Percentage Split</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Splits</label>
                  <div className="space-y-3">
                    {editedExpense.splits.map((split, index) => (
                      <div key={index} className="flex gap-4 items-center bg-gray-50 p-4 rounded-lg">
                        <input
                          type="text"
                          placeholder="Username"
                          required
                          className="flex-1 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={split.username}
                          onChange={(e) => handleSplitChange(index, 'username', e.target.value)}
                        />
                        {editedExpense.split_type !== 'EQUAL' && (
                          <>
                            {editedExpense.split_type === 'EXACT' && (
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <span className="text-gray-500 sm:text-sm">$</span>
                                </div>
                                <input
                                  type="number"
                                  placeholder="Amount"
                                  required
                                  min="0"
                                  step="0.01"
                                  className="pl-7 w-32 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  value={split.amount || ''}
                                  onChange={(e) => handleSplitChange(index, 'amount', e.target.value)}
                                />
                              </div>
                            )}
                            {editedExpense.split_type === 'PERCENTAGE' && (
                              <div className="relative">
                                <input
                                  type="number"
                                  placeholder="Percentage"
                                  required
                                  min="0"
                                  max="100"
                                  step="0.01"
                                  className="w-32 pr-8 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  value={split.percentage || ''}
                                  onChange={(e) => handleSplitChange(index, 'percentage', e.target.value)}
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                  <span className="text-gray-500 sm:text-sm">%</span>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                        {editedExpense.splits.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSplit(index)}
                            className="text-red-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addSplit}
                      className="mt-4 w-full py-2 px-4 border border-blue-500 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Split
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="divide-y divide-gray-200">
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900">{expense.title}</h1>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 border border-blue-500 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="flex items-center gap-2 px-4 py-2 border border-red-500 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Amount</h2>
                    <p className="text-3xl font-bold text-blue-600">
                      ${Number(expense.amount).toFixed(2)}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Split Type</h2>
                    <p className="text-3xl font-bold text-purple-600">
                      {expense.split_type.replace('_', ' ')}
                    </p>
                  </div>
                </div>

                {expense.description && (
                  <div className="mt-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <p className="text-gray-700 whitespace-pre-wrap">{expense.description}</p>
                    </div>
                  </div>
                )}

                <div className="mt-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Splits</h2>
                  <div className="space-y-3">
                    {expense.splits.map((split, index) => (
                      <div
                        key={index}
                        className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold">
                                {split.user_username?.[0]?.toUpperCase() || '?'}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{split.user_username}</h3>
                              <div className="flex gap-4 mt-1">
                                <span className="text-sm text-gray-600">
                                  Amount: ${Number(split.amount || 0).toFixed(2)}
                                </span>
                                <span className="text-sm text-gray-600">
                                  Percentage: {Number(split.percentage || 0).toFixed(2)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-8 py-6 bg-gray-50">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex flex-col text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Created by: {expense.created_by_username}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Created: {new Date(expense.created_at!).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push('/expense')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Expenses
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
