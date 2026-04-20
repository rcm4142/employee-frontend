import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { EmployeeCreateRequest, EmployeeResponse } from './employee.model';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private readonly baseUrl = `${environment.apiBaseUrl}/api/employees`;

  constructor(private readonly http: HttpClient) {}

  createEmployee(req: EmployeeCreateRequest) {
    return this.http.post<EmployeeResponse>(this.baseUrl, req);
  }
}

