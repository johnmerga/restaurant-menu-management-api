export interface JwtPayload {
  sub: string;
  email: string;
  roles: string[];
}

export interface TokenResponse {
  access_token: string;
}
