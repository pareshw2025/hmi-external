import { Component } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';

interface Expense {
  date: string;
  category: string;
  description: string;
  amount: number;
}

@Component({
  selector: 'app-paresh-project-new',
  template: `
    <!-- Expense Tracker -->
    <div class="expense-tracker-container">
      <h2>Expense Tracker</h2>
      <form (ngSubmit)="addExpense()" #expenseForm="ngForm" class="expense-form">
        <input type="date" [(ngModel)]="newExpense.date" name="date" required />
        <input type="text" [(ngModel)]="newExpense.category" name="category" placeholder="Category" required />
        <input type="text" [(ngModel)]="newExpense.description" name="description" placeholder="Description" required />
        <input type="number" [(ngModel)]="newExpense.amount" name="amount" placeholder="Amount" required min="0.01" step="0.01" />
        <button type="submit" [disabled]="!expenseForm.valid">Add Expense</button>
      </form>
      <table class="expense-table" *ngIf="expenses.length > 0">
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let expense of expenses; let i = index">
            <td>{{ expense.date }}</td>
            <td>{{ expense.category }}</td>
            <td>{{ expense.description }}</td>
            <td>{{ expense.amount | currency }}</td>
            <td><button (click)="removeExpense(i)">Delete</button></td>
          </tr>
        </tbody>
      </table>
      <div class="total-expense" *ngIf="expenses.length > 0">
        Total: {{ getTotal() | currency }}
      </div>
    </div>
  `,
  styles: [`
    .expense-tracker-container { max-width: 500px; margin: 40px auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px; }
    h2 { text-align: center; }
    .expense-form { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
    .expense-form input { flex: 1 1 120px; padding: 6px; }
    .expense-form button { flex: 1 1 80px; }
    .expense-table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    .expense-table th, .expense-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    .expense-table th { background: #f4f4f4; }
    .total-expense { margin-top: 12px; font-weight: bold; text-align: right; }
  `]
})
export class PareshProjectNewComponent extends CommonExternalComponent {
  expenses: Expense[] = [];
  newExpense: Expense = {
    date: '',
    category: '',
    description: '',
    amount: 0
  };

  addExpense(): void {
    if (this.newExpense.date && this.newExpense.category && this.newExpense.description && this.newExpense.amount > 0) {
      this.expenses.push({ ...this.newExpense });
      this.newExpense = { date: '', category: '', description: '', amount: 0 };
    }
  }

  removeExpense(index: number): void {
    this.expenses.splice(index, 1);
  }

  getTotal(): number {
    return this.expenses.reduce((sum: number, exp: Expense) => sum + exp.amount, 0);
  }
}

/*
Features:
- Add expenses with date, category, description, and amount.
- List all expenses in a table.
- Delete individual expenses.
- Shows total expense.
- Uses strict typing and inline HTML/CSS.

What features would you like to add? (e.g., expense categories dropdown, monthly filtering, export to CSV, charts/graphs)
*/