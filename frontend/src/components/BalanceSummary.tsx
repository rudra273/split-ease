// src/components/BalanceSummary.tsx
'use client';

import { useEffect, useState } from 'react';
import { expenseApi } from '@/lib/api/expenseApi';

interface BalanceSheetData {
  total_owed: number;
  total_paid: number;
  net_balance: number;
}

export default function BalanceSummary() {
  const [balanceSheet, setBalanceSheet] = useState<BalanceSheetData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBalanceSheet();
  }, []);

  const fetchBalanceSheet = async () => {
    try {
      const data = await expenseApi.getBalanceSheet();
      setBalanceSheet(data);
    } catch (err) {
      setError('Failed to load balance sheet');
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

  if (!balanceSheet) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Balance Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-gray-600 text-sm">Total Owed</p>
          <p className="text-2xl font-bold text-blue-600">
            ${parseFloat(balanceSheet.total_owed.toString()).toFixed(2)}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-gray-600 text-sm">Total Paid</p>
          <p className="text-2xl font-bold text-green-600">
            ${parseFloat(balanceSheet.total_paid.toString()).toFixed(2)}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-gray-600 text-sm">Net Balance</p>
          <p className="text-2xl font-bold text-purple-600">
            ${parseFloat(balanceSheet.net_balance.toString()).toFixed(2)}
          </p>
        </div>
      </div>
      <button
        onClick={handleDownloadCSV}
        className="mt-6 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download CSV
      </button>
      {error && (
        <div className="mt-4 text-red-600 text-sm">{error}</div>
      )}
    </div>
  );
}