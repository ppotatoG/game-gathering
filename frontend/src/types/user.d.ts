interface UserInfo {
    token: string;
    tokenExpiresAt: string | Date;
    userDetails: User;
}

interface User {
    name: string;
    email: string;
    password: string;
}
