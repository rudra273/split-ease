# expense/serializers.py

from rest_framework import serializers
from .models import Expense, ExpenseSplit
from django.contrib.auth import get_user_model
from decimal import Decimal

User = get_user_model()

class ExpenseSplitSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    user_username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = ExpenseSplit
        fields = ['id', 'user', 'user_username', 'username', 'amount', 'percentage']
        read_only_fields = ['id', 'user_username']

    def validate_username(self, value):
        try:
            User.objects.get(username=value)
            return value
        except User.DoesNotExist:
            raise serializers.ValidationError(f"User with username '{value}' does not exist.")

class ExpenseSerializer(serializers.ModelSerializer):
    splits = ExpenseSplitSerializer(many=True)
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)

    class Meta:
        model = Expense
        fields = ['id', 'title', 'description', 'amount', 'split_type',
                 'created_by', 'created_by_username', 'splits', 'created_at']
        read_only_fields = ['id', 'created_by', 'created_by_username', 'created_at']

    def validate(self, data):
        split_type = data.get('split_type')
        splits = data.get('splits', [])
        total_amount = Decimal(str(data.get('amount', 0)))

        if not splits:
            raise serializers.ValidationError("At least one split is required.")

        if split_type == 'EQUAL':
            # For equal splits, we'll handle the division in create/update
            pass
        
        elif split_type == 'EXACT':
            total_split = sum(Decimal(str(split.get('amount', 0))) for split in splits)
            if total_split != total_amount:
                raise serializers.ValidationError(
                    f"Sum of split amounts ({total_split}) must equal total amount ({total_amount})")

        elif split_type == 'PERCENTAGE':
            total_percentage = sum(Decimal(str(split.get('percentage', 0))) for split in splits)
            if not (Decimal('99.9') <= total_percentage <= Decimal('100.1')):
                raise serializers.ValidationError(
                    f"Sum of percentages ({total_percentage}) must equal 100%")

        return data

    def create(self, validated_data):
        splits_data = validated_data.pop('splits')
        expense = Expense.objects.create(**validated_data)
        
        self._create_or_update_splits(expense, splits_data)
        return expense

    def update(self, instance, validated_data):
        splits_data = validated_data.pop('splits', [])
        
        # Update expense instance fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Clear existing splits and create new ones
        instance.splits.all().delete()
        self._create_or_update_splits(instance, splits_data)
        return instance

    def _create_or_update_splits(self, expense, splits_data):
        total_amount = expense.amount
        split_count = len(splits_data)

        for split_data in splits_data:
            username = split_data.pop('username')
            user = User.objects.get(username=username)
            
            if expense.split_type == 'EQUAL':
                # Calculate equal split amount
                split_amount = total_amount / Decimal(str(split_count))
                ExpenseSplit.objects.create(
                    expense=expense,
                    user=user,
                    amount=split_amount,
                    percentage=Decimal('100.0') / split_count
                )
            
            elif expense.split_type == 'PERCENTAGE':
                percentage = Decimal(str(split_data.get('percentage', 0)))
                split_amount = (percentage / Decimal('100.0')) * total_amount
                ExpenseSplit.objects.create(
                    expense=expense,
                    user=user,
                    amount=split_amount,
                    percentage=percentage
                )
            
            else:  # EXACT
                ExpenseSplit.objects.create(
                    expense=expense,
                    user=user,
                    amount=split_data.get('amount'),
                    percentage=(Decimal(str(split_data.get('amount', 0))) / total_amount) * 100
                )