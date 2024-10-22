# expense/urls.py
from django.urls import path
from .views import (
    ExpenseListCreateView,
    ExpenseDetailView,
    MyExpensesView,
    BalanceSheetView,
    DownloadBalanceSheetView
)

urlpatterns = [
    # Basic CRUD operations
    path('expenses/', ExpenseListCreateView.as_view(), name='expense-list-create'),
    path('expenses/<int:pk>/', ExpenseDetailView.as_view(), name='expense-detail'),
    
    # Additional functionality
    path('my-expenses/', MyExpensesView.as_view(), name='my-expenses'),
    path('balance-sheet/', BalanceSheetView.as_view(), name='balance-sheet'),
    path('download-balance-sheet/', DownloadBalanceSheetView.as_view(), name='download-balance-sheet'),
]
