type TempLogin = {
    email: string;
    password: string;
    userName: string;
};

// ⚠️  TEMPORARY DEV CREDENTIALS - REMOVE BEFORE PRODUCTION
const TEMP_LOGIN: TempLogin = {
    email: 'admin@gyat.com',
    password: 'admin',
    userName: 'Admin'
};

export function authenticateTempUser(email: string, password: string) {
    const emailMatch = constantTimeCompare(email || '', TEMP_LOGIN.email);
    const passwordMatch = constantTimeCompare(password || '', TEMP_LOGIN.password);
    
    const ok = emailMatch && passwordMatch;

    return {
        ok,
        userName: ok ? TEMP_LOGIN.userName : '',
    };
}

function constantTimeCompare(a: string, b: string): boolean {
    if (a.length !== b.length) return false;
    
    let result = 0;
    for (let i = 0; i < a.length; i++) {
        result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
}