type TempLogin = {
    email: string;
    password: string;
    isAdmin: boolean;
    userName: string;
};

const TEMP_LOGIN: TempLogin = {
    email: 'admin@admin',
    password: 'admin',
    isAdmin: true,
    userName: 'Admin'
};

export function authenticateTempUser(email: string, password: string) {
    const ok = email === TEMP_LOGIN.email && password === TEMP_LOGIN.password;

    return {
        ok,
        isAdmin: ok ? TEMP_LOGIN.isAdmin : false,
        userName: ok ? TEMP_LOGIN.userName : ''
    };
}
