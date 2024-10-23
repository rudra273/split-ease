// src/app/expense/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { expenseApi, Expense } from '@/lib/api/expenseApi';
import BalanceSummary from '@/components/BalanceSummary';

export default function ExpensePage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => {
        setError('');
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, successMessage]);

  const fetchExpenses = async () => {
    try {
      const data = await expenseApi.getExpenses();
      setExpenses(data);
    } catch (err) {
      setError('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (isDeleting) return;
    if (!window.confirm('Are you sure you want to delete this expense?')) return;

    setIsDeleting(true);
    try {
      const expenseToDelete = expenses.find(e => e.id === id);
      setExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== id));
      
      await expenseApi.deleteExpense(id);
      setSuccessMessage(`Successfully deleted expense: ${expenseToDelete?.title || ''}`);
    } catch (err) {
      setError('Failed to delete expense');
      await fetchExpenses();
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Expenses</h1>
          </div>
          <Link
            href="/expense/create"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Expense
          </Link>
        </div>

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-4">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4">
            {error}
          </div>
        )}

        <div className="mb-6">
          <BalanceSummary />
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Split Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{expense.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${parseFloat(expense.amount).toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{expense.split_type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{expense.created_by_username}</td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-3">
                      <Link
                        href={`/expense/${expense.id}`}
                        className="text-blue-500 hover:text-blue-600 transition-colors"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleDelete(expense.id!)}
                        disabled={isDeleting}
                        className={`text-red-500 hover:text-red-600 transition-colors ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}