export interface User {
  _id: string;  // ✅ Changé de 'id' à '_id'
  email: string;
  nom: string;
  role: 'Admin' | 'Manager' | 'Employé';
  status: 'Actif' | 'Inactif';
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  accessToken: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  nom: string;
  password: string;
  confirmPassword: string;
  role?: 'Admin' | 'Manager' | 'Employé';
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user: User;
}
