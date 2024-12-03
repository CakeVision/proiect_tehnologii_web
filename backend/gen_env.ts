import crypto from 'crypto'
import fs from 'fs'

const generateSecrets = (length = 64) => {
    // Characters to use in the secret (similar to your example)
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()+-/';
    let result = '';
    
    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(0, chars.length);
        result += chars[randomIndex];
    }
    return result;
};

export const createEnvFile = (path:string) => {
    const envContent = 
`JWT_SECRET=${generateSecrets()}
REFRESH_TOKEN_SECRET=${generateSecrets()}`;
    // if (fs.existsSync(path)) {
    //     console.log("deleting .env")
    //     fs.unlinkSync(path);
    // }
    fs.writeFileSync(path, envContent);
};