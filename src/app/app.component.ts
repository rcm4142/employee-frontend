import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { EmployeeService } from './employee.service';
import { EmployeeCreateRequest, EmployeeResponse } from './employee.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <h1 class="title">Create Employee</h1>

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="row">
          <div class="field">
            <label for="name">Name</label>
            <input id="name" type="text" formControlName="name" placeholder="Employee name" />
          </div>

          <div class="field">
            <label for="department">Department</label>
            <input
              id="department"
              type="text"
              formControlName="department"
              placeholder="e.g. IT / HR"
            />
          </div>
        </div>

        <div class="field">
          <label for="email">Email</label>
          <input id="email" type="email" formControlName="email" placeholder="name@company.com" />
        </div>

        <div class="actions">
          <button type="submit" [disabled]="form.invalid || loading">
            {{ loading ? 'Saving...' : 'Submit' }}
          </button>
          <span class="msg" *ngIf="message" [class.success]="messageType === 'success'" [class.error]="messageType === 'error'">
            {{ message }}
          </span>
        </div>
      </form>
    </div>
  `
})
export class AppComponent {
  loading = false;
  message = '';
  messageType: 'success' | 'error' | '' = '';

  form = new FormGroup({
    name: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    }),
    department: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] })
  });

  constructor(private readonly employeeService: EmployeeService) {}

  onSubmit() {
    if (this.form.invalid || this.loading) return;

    this.message = '';
    this.messageType = '';
    this.loading = true;

    const payload: EmployeeCreateRequest = {
      name: this.form.controls.name.value,
      email: this.form.controls.email.value,
      department: this.form.controls.department.value
    };

    this.employeeService
      .createEmployee(payload)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res: EmployeeResponse) => {
          this.messageType = 'success';
          this.message = `Employee created with id ${res.id}.`;
          this.form.reset({ name: '', email: '', department: '' });
        },
        error: (err) => {
          this.messageType = 'error';
          const apiMsg = err?.error?.message;
          this.message = apiMsg ? String(apiMsg) : 'Failed to create employee.';
        }
      });
  }
}

