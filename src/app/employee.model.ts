export interface EmployeeCreateRequest {
  name: string;
  email: string;
  department: string;
}

export interface EmployeeResponse extends EmployeeCreateRequest {
  id: number;
}

