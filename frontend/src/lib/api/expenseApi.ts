// src/lib/api/expenseApi.ts
import { apiClient } from './apiClient';

// Types
export type SplitType = 'EQUAL' | 'EXACT' | 'PERCENTAGE';

export interface ExpenseSplit {
    id?: number;
    user: number;
    username?: string;
    amount?: number;
    percentage?: number;
}

export interface Expense {
    id?: number;
    title: string;
    description?: string;
    amount: string;
    split_type: SplitType;
    created_by?: number;
    created_by_username?: string;
    splits: ExpenseSplit[];
    created_at?: string;
}

export interface CreateExpensePayload {
    title: string;
    description?: string;
    amount: number;
    split_type: SplitType;
    splits: Omit<ExpenseSplit, 'id' | 'username'>[];
}

export interface UpdateExpensePayload extends CreateExpensePayload {
    id: number;
}

export interface BalanceSheet {
    total_owed: number;
    total_paid: number;
    net_balance: number;
}

// API Functions
export const expenseApi = {
    // Get all expenses
    getExpenses: () =>
        apiClient<Expense[]>('/expenses/', {
            requireAuth: true,
        }),

    // Get a single expense
    getExpense: (id: number) =>
        apiClient<Expense>(`/expenses/${id}/`, {
            requireAuth: true,
        }),

    // Create new expense
    createExpense: (expense: CreateExpensePayload) =>
        apiClient<Expense>('/expenses/', {
            method: 'POST',
            body: JSON.stringify(expense),
            requireAuth: true,
        }),

    // Update expense
    updateExpense: (expense: UpdateExpensePayload) =>
        apiClient<Expense>(`/expenses/${expense.id}/`, {
            method: 'PUT',
            body: JSON.stringify(expense),
            requireAuth: true,
        }),

    // Delete expense
    deleteExpense: (id: number) =>
        apiClient(`/expenses/${id}/`, {
            method: 'DELETE',
            requireAuth: true,
        }),

    // Get user's expenses
    getMyExpenses: () =>
        apiClient<Expense[]>('/my-expenses/', {
            requireAuth: true,
        }),

    // Get balance sheet
    getBalanceSheet: () =>
        apiClient<BalanceSheet>('/balance-sheet/', {
            requireAuth: true,
        }),

    // Download balance sheet CSV
    downloadBalanceSheet: () =>
        apiClient('/download-balance-sheet/', {
            requireAuth: true,
            responseType: 'blob', // For file download
        }),
};