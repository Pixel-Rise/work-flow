export interface AuthToken {
  accessToken: string;
  refreshToken: string;
}

export interface LoginData {
  phone: string;
  password: string;
}

export interface ForgotPasswordData {
  phone: string;
}

export interface LinkValidationData {
  linkCode: string;
}

export interface ResetPasswordData {
  linkCode: string;
  password: string;
}