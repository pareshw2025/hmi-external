import { Component } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';

interface Expense {
  date: string;
  description: string;
  amount: number;
}

@Component({
  selector: 'app-pareshproject',
  template: `
    <!-- 
      Features:
      - Add expenses with date, description, and amount
      - List all expenses in a table
      - Display total expense
    -->
    <div class="expense-tracker">
      <h2>Expense Tracker</h2>
      <form (ngSubmit)="addExpense()" #expenseForm="ngForm" class="expense-form">
        <input type="date" [(ngModel)]="newExpense.date" name="date" required />
        <input type="text" [(ngModel)]="newExpense.description" name="description" placeholder="Description" required maxlength="50"/>
        <input type="number" [(ngModel)]="newExpense.amount" name="amount" placeholder="Amount" min="0.01" step="0.01" required />
        <button type="submit" [disabled]="!expenseForm.valid">Add</button>
      </form>
      <table *ngIf="expenses.length > 0" class="expense-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Amount ($)</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let exp of expenses">
            <td>{{exp.date}}</td>
            <td>{{exp.description}}</td>
            <td>{{exp.amount | number:'1.2-2'}}</td>
          </tr>
        </tbody>
      </table>
      <div *ngIf="expenses.length > 0" class="total">
        <strong>Total:</strong> ${{getTotal() | number:'1.2-2'}}
      </div>
    </div>
  `,
  styles: [`
    .expense-tracker { max-width: 400px; margin: auto; font-family: Arial, sans-serif; }
    .expense-form { display: flex; gap: 8px; margin-bottom: 16px; }
    .expense-form input { flex: 1; padding: 4px; }
    .expense-form button { padding: 4px 12px; }
    .expense-table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
    .expense-table th, .expense-table td { border: 1px solid #ccc; padding: 6px; text-align: left; }
    .total { text-align: right; font-size: 1.1em; }
  `]
})
export class PareshprojectComponent extends CommonExternalComponent {
  expenses: Expense[] = [];
  newExpense: Expense = { date: '', description: '', amount: 0 };

  addExpense(): void {
    if (
      this.newExpense.date &&
      this.newExpense.description.trim().length > 0 &&
      this.newExpense.amount > 0
    ) {
      this.expenses.push({ ...this.newExpense });
      this.newExpense = { date: '', description: '', amount: 0 };
    }
  }

  getTotal(): number {
    return this.expenses.reduce((sum: number, exp: Expense) => sum + exp.amount, 0);
  }
}