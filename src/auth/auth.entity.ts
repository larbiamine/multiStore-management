export type JwtPayload = {
    email: string;
    type: string;
    storeId : string;
};

export type TokenResponse = {
    token: string;
};