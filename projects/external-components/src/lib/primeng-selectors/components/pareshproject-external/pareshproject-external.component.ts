import { Component } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';

/**
 * Features:
 * - Add, edit, delete expenses.
 * - Filter by category and date range.
 * - Export filtered expenses to CSV.
 * - Display total expense sum.
 * - Inline form validation.
 */

interface Expense {
  id: number;
  date: string;
  category: string;
  description: string;
  amount: number;
}

@Component({
  selector: 'app-pareshproject',
  template: `
    <div class="expense-tracker">
      <h2>Expense Tracker</h2>
      <!-- Add/Edit Form -->
      <form (ngSubmit)="saveExpense()" #expenseForm="ngForm" class="expense-form">
        <input type="date" [(ngModel)]="editExpense.date" name="date" required />
        <input type="text" [(ngModel)]="editExpense.category" name="category" placeholder="Category" required maxlength="20"/>
        <input type="text" [(ngModel)]="editExpense.description" name="description" placeholder="Description" maxlength="40"/>
        <input type="number" [(ngModel)]="editExpense.amount" name="amount" placeholder="Amount" min="0.01" step="0.01" required />
        <button type="submit" [disabled]="!expenseForm.form.valid">{{isEditing ? 'Update' : 'Add'}} Expense</button>
        <button type="button" *ngIf="isEditing" (click)="cancelEdit()">Cancel</button>
      </form>

      <!-- Filters & Export -->
      <div class="filters">
        <input type="text" [(ngModel)]="filterCategory" placeholder="Filter by Category" name="filterCategory"/>
        <input type="date" [(ngModel)]="filterFrom" name="filterFrom" placeholder="From"/>
        <input type="date" [(ngModel)]="filterTo" name="filterTo" placeholder="To"/>
        <button type="button" (click)="clearFilters()">Clear Filters</button>
        <button type="button" (click)="exportCSV()" [disabled]="filteredExpenses().length === 0">Export CSV</button>
      </div>

      <!-- Expenses Table -->
      <table class="expenses-table" *ngIf="filteredExpenses().length > 0">
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Description</th>
            <th>Amount ($)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let exp of filteredExpenses()">
            <td>{{exp.date}}</td>
            <td>{{exp.category}}</td>
            <td>{{exp.description}}</td>
            <td>{{exp.amount | number:'1.2-2'}}</td>
            <td>
              <button (click)="edit(exp)">Edit</button>
              <button (click)="delete(exp.id)">Delete</button>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3"><strong>Total</strong></td>
            <td colspan="2"><strong>{{totalFilteredExpenses() | number:'1.2-2'}}</strong></td>
          </tr>
        </tfoot>
      </table>
      <p *ngIf="filteredExpenses().length === 0" class="no-expenses">No expenses found.</p>
    </div>
  `,
  styles: [`
    .expense-tracker { max-width: 540px; margin: 24px auto; padding: 16px; border: 1px solid #eee; border-radius: 8px; background: #fafbfc; }
    h2 { text-align: center; }
    .expense-form { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
    .expense-form input { flex: 1 1 120px; padding: 4px 8px; }
    .expense-form button { padding: 4px 12px; }
    .filters { display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap; }
    .filters input { flex: 1 1 110px; padding: 4px 8px; }
    .expenses-table { width: 100%; border-collapse: collapse; margin-top: 8px; }
    .expenses-table th, .expenses-table td { border: 1px solid #ddd; padding: 6px 10px; text-align: left; }
    .expenses-table tfoot td { font-weight: bold; }
    .no-expenses { text-align: center; color: #888; }
    button { cursor: pointer; }
  `]
})
export class PareshprojectComponent extends CommonExternalComponent {
  expenses: Expense[] = [];
  editExpense: Expense = this.getEmptyExpense();
  isEditing: boolean = false;

  filterCategory: string = '';
  filterFrom: string = '';
  filterTo: string = '';

  private nextId: number = 1;

  saveExpense(): void {
    if (
      this.editExpense.date &&
      this.editExpense.category &&
      this.editExpense.amount > 0
    ) {
      if (this.isEditing) {
        const idx: number = this.expenses.findIndex(e => e.id === this.editExpense.id);
        if (idx !== -1) {
          this.expenses[idx] = { ...this.editExpense };
        }
        this.isEditing = false;
      } else {
        this.editExpense.id = this.nextId++;
        this.expenses.push({ ...this.editExpense });
      }
      this.editExpense = this.getEmptyExpense();
    }
  }

  edit(exp: Expense): void {
    this.editExpense = { ...exp };
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editExpense = this.getEmptyExpense();
  }

  delete(id: number): void {
    this.expenses = this.expenses.filter(e => e.id !== id);
    if (this.isEditing && this.editExpense.id === id) {
      this.cancelEdit();
    }
  }

  filteredExpenses(): Expense[] {
    return this.expenses.filter(exp => {
      const matchCategory = this.filterCategory ?
        exp.category.toLowerCase().includes(this.filterCategory.trim().toLowerCase()) : true;
      const matchFrom = this.filterFrom ? exp.date >= this.filterFrom : true;
      const matchTo = this.filterTo ? exp.date <= this.filterTo : true;
      return matchCategory && matchFrom && matchTo;
    });
  }

  totalFilteredExpenses(): number {
    return this.filteredExpenses().reduce((sum: number, exp: Expense) => sum + exp.amount, 0);
  }

  clearFilters(): void {
    this.filterCategory = '';
    this.filterFrom = '';
    this.filterTo = '';
  }

  exportCSV(): void {
    const data: Expense[] = this.filteredExpenses();
    if (data.length === 0) { return; }
    const csvRows: string[] = [
      'Date,Category,Description,Amount'
    ];
    for (const exp of data) {
      // Escape commas in description/category
      const row: string = [
        exp.date,
        `"${exp.category.replace(/"/g, '""')}"`,
        `"${exp.description.replace(/"/g, '""')}"`,
        exp.amount.toFixed(2)
      ].join(',');
      csvRows.push(row);
    }
    const csvContent: string = csvRows.join('\r\n');
    const blob: Blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url: string = URL.createObjectURL(blob);

    // Create temporary download link
    const a: HTMLAnchorElement = document.createElement('a');
    a.href = url;
    a.download = 'expenses.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  private getEmptyExpense(): Expense {
    return { id: 0, date: '', category: '', description: '', amount: 0 };
  }
}