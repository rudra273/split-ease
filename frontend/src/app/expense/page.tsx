// src/app/expense/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { expenseApi, Expense } from '@/lib/api/expenseApi';

export default function ExpensePage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [balanceSheet, setBalanceSheet] = useState<{ total_owed: number; total_paid: number; net_balance: number } | null>(null);

  useEffect(() => {
    fetchExpenses();
    fetchBalanceSheet();
  }, []);

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

  const fetchBalanceSheet = async () => {
    try {
      const data = await expenseApi.getBalanceSheet();
      setBalanceSheet(data);
    } catch (err) {
      console.error('Failed to load balance sheet');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await expenseApi.deleteExpense(id);
        setExpenses(expenses.filter(expense => expense.id !== id));
      } catch (err) {
        setError('Failed to delete expense');
      }
    }
  };

  const handleDownloadCSV = async () => {
    try {
      const blob = await expenseApi.downloadBalanceSheet();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'balance-sheet.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to download balance sheet');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Expenses</h1>
          <Link
            href="/expense/create"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create New Expense
          </Link>
        </div>
{/* 
        {balanceSheet && (
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-3">Balance Summary</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-gray-600">Total Owed</p>
                <p className="text-lg font-semibold">${balanceSheet.total_owed.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-600">Total Paid</p>
                <p className="text-lg font-semibold">${balanceSheet.total_paid.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-600">Net Balance</p>
                <p className="text-lg font-semibold">${balanceSheet.net_balance.toFixed(2)}</p>
              </div>
            </div>
            <button
              onClick={handleDownloadCSV}
              className="mt-4 text-blue-500 hover:text-blue-600"
            >
              Download CSV
            </button>
          </div>
        )} */}

        {/* -- */}
        {balanceSheet && (
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <h2 className="text-xl font-semibold mb-3">Balance Summary</h2>
                <div className="grid grid-cols-3 gap-4">
                <div>
                    <p className="text-gray-600">Total Owed</p>
                    <p className="text-lg font-semibold">${parseFloat(balanceSheet.total_owed.toString()).toFixed(2)}</p>
                </div>
                <div>
                    <p className="text-gray-600">Total Paid</p>
                    <p className="text-lg font-semibold">${parseFloat(balanceSheet.total_paid.toString()).toFixed(2)}</p>
                </div>
                <div>
                    <p className="text-gray-600">Net Balance</p>
                    <p className="text-lg font-semibold">${parseFloat(balanceSheet.net_balance.toString()).toFixed(2)}</p>
                </div>
                </div>
                <button
                onClick={handleDownloadCSV}
                className="mt-4 text-blue-500 hover:text-blue-600"
                >
                Download CSV
                </button>
            </div>
            )}

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Split Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {expenses.map((expense) => (
                // <tr key={expense.id}>
                //   <td className="px-6 py-4">{expense.title}</td>
                //   <td className="px-6 py-4">${expense.amount.toFixed(2)}</td>
                //   <td className="px-6 py-4">{expense.split_type}</td>
                //   <td className="px-6 py-4">{expense.created_by_username}</td>
                //   <td className="px-6 py-4 space-x-2">
                //     <Link
                //       href={`/expense/${expense.id}`}
                //       className="text-blue-500 hover:text-blue-600"
                //     >
                //       View
                //     </Link>
                //     <button
                //       onClick={() => handleDelete(expense.id!)}
                //       className="text-red-500 hover:text-red-600 ml-2"
                //     >
                //       Delete
                //     </button>
                //   </td>
                // </tr>
                <tr key={expense.id}>
                    <td className="px-6 py-4">{expense.title}</td>
                    <td className="px-6 py-4">${parseFloat(expense.amount).toFixed(2)}</td>
                    <td className="px-6 py-4">{expense.split_type}</td>
                    <td className="px-6 py-4">{expense.created_by_username}</td>
                    <td className="px-6 py-4 space-x-2">
                        <Link
                        href={`/expense/${expense.id}`}
                        className="text-blue-500 hover:text-blue-600"
                        >
                        View
                        </Link>
                        <button
                        onClick={() => handleDelete(expense.id!)}
                        className="text-red-500 hover:text-red-600 ml-2"
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
  );
}

