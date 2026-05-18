export interface ClientResponse {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  createdAt: string;
}

export interface ClientRequest {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}
