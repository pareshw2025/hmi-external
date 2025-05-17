import { Component } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';

interface Expense {
  date: string;
  category: string;
  description: string;
  amount: number;
}

@Component({
  selector: 'app-paresh-project',
  template: `
    <!--
      Features:
      - Category dropdown with options: Fuel, Bills, Food, Education, EMI
      - Add, view, and delete expenses
      - Displays total expense amount
      - Inline form for quick entry
      - Simple list with date, category, description, amount
    -->
    <div class="expense-tracker">
      <h2>Expense Tracker</h2>
      <form (ngSubmit)="addExpense()" #expenseForm="ngForm" class="expense-form">
        <input type="date" [(ngModel)]="newExpense.date" name="date" required />
        <select [(ngModel)]="newExpense.category" name="category" required>
          <option value="" disabled selected>Select Category</option>
          <option *ngFor="let cat of categories" [value]="cat">{{ cat }}</option>
        </select>
        <input type="text" [(ngModel)]="newExpense.description" name="description" placeholder="Description" maxlength="40"/>
        <input type="number" [(ngModel)]="newExpense.amount" name="amount" placeholder="Amount" required min="0.01" step="0.01"/>
        <button type="submit" [disabled]="!expenseForm.form.valid">Add</button>
      </form>
      <div class="expenses-list" *ngIf="expenses.length > 0">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let exp of expenses; let i = index">
              <td>{{ exp.date }}</td>
              <td>{{ exp.category }}</td>
              <td>{{ exp.description }}</td>
              <td>₹{{ exp.amount | number:'1.2-2' }}</td>
              <td><button (click)="deleteExpense(i)">Delete</button></td>
            </tr>
          </tbody>
        </table>
        <div class="total">
          Total: ₹{{ getTotal() | number:'1.2-2' }}
        </div>
      </div>
      <div *ngIf="expenses.length === 0" class="no-expenses">
        No expenses added yet.
      </div>
    </div>
  `,
  styles: [`
    .expense-tracker { max-width: 500px; margin: 30px auto; font-family: Arial, sans-serif; }
    .expense-form { display: flex; gap: 6px; margin-bottom: 18px; }
    .expense-form input, .expense-form select { padding: 4px; width: 100px; }
    .expense-form button { padding: 5px 10px; }
    .expenses-list table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
    th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }
    th { background: #f5f5f5; }
    .total { font-weight: bold; text-align: right; }
    .no-expenses { color: #888; text-align: center; margin-top: 16px; }
  `]
})
export class PareshProjectComponent extends CommonExternalComponent {
  categories: string[] = ['Fuel', 'Bills', 'Food', 'Education', 'EMI'];
  expenses: Expense[] = [];
  newExpense: Expense = {
    date: '',
    category: '',
    description: '',
    amount: 0
  };

  addExpense(): void {
    if (
      this.newExpense.date &&
      this.newExpense.category &&
      this.newExpense.amount > 0
    ) {
      this.expenses.push({ ...this.newExpense });
      this.newExpense = { date: '', category: '', description: '', amount: 0 };
    }
  }

  deleteExpense(index: number): void {
    this.expenses.splice(index, 1);
  }

  getTotal(): number {
    return this.expenses.reduce((sum: number, exp: Expense) => sum + exp.amount, 0);
  }
}