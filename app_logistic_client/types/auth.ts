export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  document_number: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterCredentials {
  email: string;
  password?: string;
  first_name: string;
  last_name: string;
  document_number: string;
}
