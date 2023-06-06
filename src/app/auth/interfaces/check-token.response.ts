
export interface CheckTokenResponse {
    user:  User;
    token: string;
}

export interface User {
    _id:      string;
    email:    string;
    name:     string;
    isActive: boolean;
    roles:    string[];
}