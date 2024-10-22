
// src/app/expense/[id]/page.tsx
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
        amount: data.amount,
        split_type: data.split_type,
        splits: data.splits.map(split => ({
          user: split.user,
          amount: split.amount,
          percentage: split.percentage
        }))
      });
    } catch (err) {
      setError('Failed to load expense');
    } finally {
      setLoading(false);
    }
  };

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

    const handleSplitChange = (index: number, field: string, value: number) => {
    if (!editedExpense) return;

    const newSplits = [...editedExpense.splits];
    newSplits[index] = { ...newSplits[index], [field]: value };
    setEditedExpense({ ...editedExpense, splits: newSplits });
    };

    const addSplit = () => {
    if (!editedExpense) return;
    setEditedExpense({
        ...editedExpense,
        splits: [...editedExpense.splits, { user: 0, amount: 0 }]
    });
    };

    const removeSplit = (index: number) => {
    if (!editedExpense) return;
    const newSplits = editedExpense.splits.filter((_, i) => i !== index);
    setEditedExpense({ ...editedExpense, splits: newSplits });
    };

    if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    if (!expense || !editedExpense) {
    return <div className="text-red-500 text-center mt-8">Expense not found</div>;
    }

    return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        {error && <div className="text-red-500 mb-4">{error}</div>}

        {isEditing ? (
            <form onSubmit={handleUpdate} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                type="text"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={editedExpense.title}
                onChange={(e) => setEditedExpense({ ...editedExpense, title: e.target.value })}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={editedExpense.description}
                onChange={(e) => setEditedExpense({ ...editedExpense, description: e.target.value })}
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
                value={editedExpense.amount}
                onChange={(e) => setEditedExpense({ ...editedExpense, amount: parseFloat(e.target.value) })}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Split Type</label>
                <select
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={editedExpense.split_type}
                onChange={(e) => setEditedExpense({ ...editedExpense, split_type: e.target.value as SplitType })}
                >
                <option value="EQUAL">Equal</option>
                <option value="EXACT">Exact</option>
                <option value="PERCENTAGE">Percentage</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Splits</label>
                {editedExpense.splits.map((split, index) => (
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
                    placeholder={editedExpense.split_type === 'PERCENTAGE' ? 'Percentage' : 'Amount'}
                    required
                    className="flex-1 border border-gray-300 rounded-md shadow-sm p-2"
                    value={editedExpense.split_type === 'PERCENTAGE' ? split.percentage : split.amount}
                    onChange={(e) => handleSplitChange(index, editedExpense.split_type === 'PERCENTAGE' ? 'percentage' : 'amount', parseFloat(e.target.value))}
                    />
                    {editedExpense.splits.length > 1 && (
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
                onClick={() => setIsEditing(false)}
                className="text-gray-600 hover:text-gray-800"
                >
                Cancel
                </button>
                <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                Save Changes
                </button>
            </div>
            </form>
        ) : (
            <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">{expense.title}</h1>
                <div className="space-x-2">
                <button
                    onClick={() => setIsEditing(true)}
                    className="text-blue-500 hover:text-blue-600"
                >
                    Edit
                </button>
                <button
                    onClick={handleDelete}
                    className="text-red-500 hover:text-red-600"
                >
                    Delete
                </button>
                </div>
            </div>

            {expense.description && (
                <div>
                <h2 className="text-lg font-semibold">Description</h2>
                <p className="text-gray-700">{expense.description}</p>
                </div>
            )}

            <div>
                <h2 className="text-lg font-semibold">Amount</h2>
                <p className="text-gray-700">${expense.amount.toFixed(2)}</p>
            </div>

            <div>
                <h2 className="text-lg font-semibold">Split Type</h2>
                <p className="text-gray-700">{expense.split_type}</p>
            </div>

            <div>
                <h2 className="text-lg font-semibold mb-2">Splits</h2>
                <div className="space-y-2">
                {expense.splits.map((split, index) => (
                    <div key={index} className="flex justify-between">
                    <span>User: {split.username || split.user}</span>
                    <span>
                        {expense.split_type === 'PERCENTAGE'
                        ? `${split.percentage}%`
                        : `$${split.amount?.toFixed(2)}`}
                    </span>
                    </div>
                ))}
                </div>
            </div>

            <div className="pt-4 border-t">
                <button
                onClick={() => router.push('/expense')}
                className="text-gray-600 hover:text-gray-800"
                >
                Back to Expenses
                </button>
            </div>
            </div>
        )}
        </div>
    </div>
    );
}