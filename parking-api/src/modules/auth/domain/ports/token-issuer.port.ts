export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

export interface TokenIssuer {
  sign(payload: JwtPayload): string;
}

export const TOKEN_ISSUER = Symbol('TokenIssuer');
