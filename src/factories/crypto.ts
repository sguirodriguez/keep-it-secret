
import 'dotenv/config'
import CryptoJS from 'crypto-js';
const secretKey = CryptoJS.enc.Hex.parse(process.env.CRYPTO_SECRET!); // 32 caracteres hexadecimais
const iv = CryptoJS.enc.Hex.parse(process.env.CRYPTO_IV!); // 16 caracteres hexadecimais

// do encrypt
function encrypt(text: string) {
    const encrypted = CryptoJS.AES.encrypt(text, secretKey, { iv: iv });
    return encrypted.toString();
}

// do decrypt
function decrypt(encryptedText: string) {
    const decrypted = CryptoJS.AES.decrypt(encryptedText, secretKey, { iv: iv });
    return decrypted.toString(CryptoJS.enc.Utf8);
}

const isAllowedSecret = (secret: string) => secret === process.env.SECURITY_SECRET;

export {
    encrypt,
    decrypt,
    isAllowedSecret,
}