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
     <div className="flex justify-center items-center min-h-screen">
       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
     </div>
   );
 }


 if (!expense || !editedExpense) {
   return (
     <div className="flex justify-center items-center min-h-screen">
       <div className="text-red-500 text-xl">Expense not found</div>
     </div>
   );
 }


 return (
   <div className="min-h-screen bg-gray-50 py-12 px-4">
     <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
       {error && (
         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
           {error}
         </div>
       )}


       {isEditing ? (
         <form onSubmit={handleUpdate} className="space-y-6">
           <div>
             <label className="block text-sm font-medium text-gray-700">Title</label>
             <input
               type="text"
               required
               className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
               value={editedExpense.title}
               onChange={(e) => setEditedExpense({ ...editedExpense, title: e.target.value })}
             />
           </div>


           <div>
             <label className="block text-sm font-medium text-gray-700">Description</label>
             <textarea
               className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
               value={editedExpense.description}
               onChange={(e) => setEditedExpense({ ...editedExpense, description: e.target.value })}
               rows={3}
             />
           </div>


           <div>
             <label className="block text-sm font-medium text-gray-700">Amount</label>
             <input
               type="number"
               required
               min="0"
               step="0.01"
               className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
               value={editedExpense.amount}
               onChange={(e) => setEditedExpense({ ...editedExpense, amount: parseFloat(e.target.value) })}
             />
           </div>


           <div>
             <label className="block text-sm font-medium text-gray-700">Split Type</label>
             <select
               className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
               value={editedExpense.split_type}
               onChange={(e) => setEditedExpense({ ...editedExpense, split_type: e.target.value as SplitType })}
             >
               <option value="EQUAL">Equal Split</option>
               <option value="EXACT">Exact Amount</option>
               <option value="PERCENTAGE">Percentage Split</option>
             </select>
           </div>


           <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">Splits</label>
             {editedExpense.splits.map((split, index) => (
               <div key={index} className="flex gap-4 mb-2 items-center">
                 <input
                   type="text"
                   placeholder="Username"
                   required
                   className="flex-1 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                   value={split.username}
                   onChange={(e) => handleSplitChange(index, 'username', e.target.value)}
                 />
                 {editedExpense.split_type !== 'EQUAL' && (
                   <>
                     {editedExpense.split_type === 'EXACT' && (
                       <input
                         type="number"
                         placeholder="Amount"
                         required
                         min="0"
                         step="0.01"
                         className="w-32 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                         value={split.amount || ''}
                         onChange={(e) => handleSplitChange(index, 'amount', e.target.value)}
                       />
                     )}
                     {editedExpense.split_type === 'PERCENTAGE' && (
                       <input
                         type="number"
                         placeholder="Percentage"
                         required
                         min="0"
                         max="100"
                         step="0.01"
                         className="w-32 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                         value={split.percentage || ''}
                         onChange={(e) => handleSplitChange(index, 'percentage', e.target.value)}
                       />
                     )}
                   </>
                 )}
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


           <div className="flex justify-between pt-4 border-t">
             <button
               type="button"
               onClick={() => setIsEditing(false)}
               className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded border border-gray-300"
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
             <h1 className="text-3xl font-bold text-gray-900">{expense.title}</h1>
             <div className="space-x-2">
               <button
                 onClick={() => setIsEditing(true)}
                 className="text-blue-500 hover:text-blue-600 px-3 py-1 rounded border border-blue-500 hover:border-blue-600"
               >
                 Edit
               </button>
               <button
                 onClick={handleDelete}
                 className="text-red-500 hover:text-red-600 px-3 py-1 rounded border border-red-500 hover:border-red-600"
               >
                 Delete
               </button>
             </div>
           </div>


           {expense.description && (
             <div>
               <h2 className="text-lg font-semibold text-gray-900">Description</h2>
               <p className="text-gray-700 mt-1">{expense.description}</p>
             </div>
           )}


           <div>
             <h2 className="text-lg font-semibold text-gray-900">Amount</h2>
             <p className="text-gray-700 mt-1">${parseFloat(expense.amount).toFixed(2)}</p>
           </div>


           <div>
             <h2 className="text-lg font-semibold text-gray-900">Split Type</h2>
             <p className="text-gray-700 mt-1">{expense.split_type.replace('_', ' ')}</p>
           </div>


           <div>
             <h2 className="text-lg font-semibold text-gray-900 mb-2">Splits</h2>
             <div className="space-y-2">
               {expense.splits.map((split, index) => (
                 <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                   <span className="font-medium text-gray-900">{split.user_username}</span>
                   <div className="flex gap-6">
                     <span className="text-gray-700">
                       Amount: ${split.amount ? parseFloat(split.amount.toString()).toFixed(2) : '0.00'}
                     </span>
                     <span className="text-gray-700">
                       Percentage: {split.percentage ? parseFloat(split.percentage.toString()).toFixed(2) : '0.00'}%
                     </span>
                   </div>
                 </div>
               ))}
             </div>
           </div>


           <div className="pt-4 border-t">
             <div className="flex justify-between items-center">
               <div className="text-sm text-gray-600">
                 <p>Created by: {expense.created_by_username}</p>
                 <p>Created at: {new Date(expense.created_at!).toLocaleDateString()}</p>
               </div>
               <button
                 onClick={() => router.push('/expense')}
                 className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded border border-gray-300"
               >
                 Back to Expenses
               </button>
             </div>
           </div>
         </div>
       )}
     </div>
   </div>
 );
}


