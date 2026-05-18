export type Role = 'ADMIN' | 'MANAGER' | 'OPERATOR';

export interface UserResponse {
  id: string;
  email: string;
  role: Role;
  companyId?: string;
}

export interface UserCreateRequest {
  email: string;
  password?: string;
  role: Role;
}
