export interface Expense {
    id: string;
    title: string;
    description: string;
    amount: number;
    created_by: {
      username: string;
    };
    split_type: 'EQUAL' | 'EXACT' | 'PERCENTAGE';
    created_at: string;
    updated_at: string;
  }
  
  export interface ExpenseCreateInput {
    title: string;
    description: string;
    amount: number;
    split_type: 'EQUAL' | 'EXACT' | 'PERCENTAGE';
  }
  
  export interface ExpenseUpdateInput {
    title?: string;
    description?: string;
    amount?: number;
    split_type?: 'EQUAL' | 'EXACT' | 'PERCENTAGE';
  }