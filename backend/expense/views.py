# expense/views.py
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum
from .models import Expense, ExpenseSplit
from .serializers import ExpenseSerializer
import csv
from django.http import HttpResponse

class ExpenseListCreateView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        expenses = Expense.objects.filter(splits__user=request.user).distinct()
        serializer = ExpenseSerializer(expenses, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = ExpenseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ExpenseDetailView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get_object(self, pk):
        try:
            return Expense.objects.get(pk=pk, splits__user=self.request.user)
        except Expense.DoesNotExist:
            return None
    
    def get(self, request, pk):
        expense = self.get_object(pk)
        if not expense:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = ExpenseSerializer(expense)
        return Response(serializer.data)
    
    def put(self, request, pk):
        expense = self.get_object(pk)
        if not expense:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = ExpenseSerializer(expense, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        expense = self.get_object(pk)
        if not expense:
            return Response(status=status.HTTP_404_NOT_FOUND)
        expense.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class MyExpensesView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        expenses = Expense.objects.filter(splits__user=request.user).distinct()
        serializer = ExpenseSerializer(expenses, many=True)
        return Response(serializer.data)

class BalanceSheetView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        splits = ExpenseSplit.objects.filter(user=user)
        total_owed = splits.aggregate(Sum('amount'))['amount__sum'] or 0
        total_paid = Expense.objects.filter(created_by=user).aggregate(Sum('amount'))['amount__sum'] or 0
        
        return Response({
            'total_owed': total_owed,
            'total_paid': total_paid,
            'net_balance': total_paid - total_owed
        })

class DownloadBalanceSheetView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="balance_sheet.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['Expense', 'Amount', 'Your Share', 'Created By', 'Date'])
        
        expenses = Expense.objects.filter(splits__user=request.user).distinct()
        for expense in expenses:
            split = expense.splits.get(user=request.user)
            writer.writerow([
                expense.title,
                expense.amount,
                split.amount or (expense.amount * split.percentage / 100),
                expense.created_by.username,
                expense.created_at.strftime('%Y-%m-%d')
            ])
        
        return response

