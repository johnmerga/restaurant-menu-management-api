export interface JwtPayload {
  sub: string;
  email: string;
  roles: string[];
}

export interface TokenResponse {
  access_token: string;
}
export interface UserResponse {
  email: string;
  name: string;
  roles: string[];
}
export interface LoginResponse {
  user: UserResponse;
  access_token: string;
}
