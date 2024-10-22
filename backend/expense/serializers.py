# expense/serializers.py
from rest_framework import serializers
from .models import Expense, ExpenseSplit
from django.db.models import Sum
from django.db import transaction

class ExpenseSplitSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = ExpenseSplit
        fields = ['id', 'user', 'username', 'amount', 'percentage']

class ExpenseSerializer(serializers.ModelSerializer):
    splits = ExpenseSplitSerializer(many=True)
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)

    class Meta:
        model = Expense
        fields = ['id', 'title', 'description', 'amount', 'split_type', 
                 'created_by', 'created_by_username', 'splits', 'created_at']
        read_only_fields = ['created_by']

    def validate_splits(self, splits):
        split_type = self.initial_data.get('split_type')
        if split_type == 'PERCENTAGE':
            total_percentage = sum(float(split['percentage'] or 0) for split in splits)
            if not abs(total_percentage - 100) < 0.01:
                raise serializers.ValidationError("Percentages must sum to 100%")
        return splits

    @transaction.atomic
    def create(self, validated_data):
        splits_data = validated_data.pop('splits')
        expense = Expense.objects.create(**validated_data)
        
        for split_data in splits_data:
            ExpenseSplit.objects.create(expense=expense, **split_data)
        
        return expense
