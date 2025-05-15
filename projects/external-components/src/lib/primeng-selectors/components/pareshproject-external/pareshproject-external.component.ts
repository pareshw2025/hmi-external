import { Component } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';

interface Expense {
  date: string;
  category: string;
  description: string;
  amount: number;
}

/**
 * Features:
 * - Add new expenses with date, category, description, and amount.
 * - Display list of all expenses in a table.
 * - Shows total expense sum.
 * - Simple inline form validation.
 */

@Component({
  selector: 'app-pareshproject',
  template: `
    <div class="expense-tracker">
      <h2>Expense Tracker</h2>
      <form (ngSubmit)="addExpense()" #expenseForm="ngForm" class="expense-form">
        <input type="date" [(ngModel)]="newExpense.date" name="date" required />
        <input type="text" [(ngModel)]="newExpense.category" name="category" placeholder="Category" required maxlength="20"/>
        <input type="text" [(ngModel)]="newExpense.description" name="description" placeholder="Description" maxlength="40"/>
        <input type="number" [(ngModel)]="newExpense.amount" name="amount" placeholder="Amount" min="0.01" step="0.01" required />
        <button type="submit" [disabled]="!expenseForm.form.valid">Add Expense</button>
      </form>

      <table class="expenses-table" *ngIf="expenses.length > 0">
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Description</th>
            <th>Amount ($)</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let exp of expenses">
            <td>{{exp.date}}</td>
            <td>{{exp.category}}</td>
            <td>{{exp.description}}</td>
            <td>{{exp.amount | number:'1.2-2'}}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3"><strong>Total</strong></td>
            <td><strong>{{totalExpenses() | number:'1.2-2'}}</strong></td>
          </tr>
        </tfoot>
      </table>
      <p *ngIf="expenses.length === 0" class="no-expenses">No expenses added yet.</p>
    </div>
  `,
  styles: [`
    .expense-tracker { max-width: 480px; margin: 24px auto; padding: 16px; border: 1px solid #eee; border-radius: 8px; background: #fafbfc; }
    h2 { text-align: center; }
    .expense-form { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
    .expense-form input { flex: 1 1 120px; padding: 4px 8px; }
    .expense-form button { padding: 4px 12px; }
    .expenses-table { width: 100%; border-collapse: collapse; margin-top: 8px; }
    .expenses-table th, .expenses-table td { border: 1px solid #ddd; padding: 6px 10px; text-align: left; }
    .expenses-table tfoot td { font-weight: bold; }
    .no-expenses { text-align: center; color: #888; }
  `]
})
export class PareshprojectComponent extends CommonExternalComponent {
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

  totalExpenses(): number {
    return this.expenses.reduce((sum: number, exp: Expense) => sum + exp.amount, 0);
  }
}