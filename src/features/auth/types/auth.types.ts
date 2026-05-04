export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterCompanyRequest {
  companyName: string;
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  adminPassword: string;
}

export interface JwtResponse {
  token: string;
}

export interface UserPayload {
  sub: string; // Habituellement l'email de l'utilisateur
  role: string;
  companyId: number | string;
  exp?: number;
  iat?: number;
}