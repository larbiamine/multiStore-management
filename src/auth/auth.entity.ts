export type JwtPayload = {
    email: string;
    type: string;
};

export type TokenResponse = {
    token: string;
};