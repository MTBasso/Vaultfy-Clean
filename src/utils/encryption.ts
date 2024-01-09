import { hash, compare } from 'bcryptjs';
import * as CryptoJS from 'crypto-js';

async function hashString(string: string): Promise<string> {
  return await hash(string, 10);
}

async function compareHash(inputPassword: string, userPassword: string): Promise<boolean> {
  const passwordMatch = await compare(inputPassword, userPassword);
  return passwordMatch;
}

function generateSecret(length: number): string {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_+=<>?';
  let randomString = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }
  return randomString;
}

function encrypt(text: string, passphrase: string): string {
  return CryptoJS.AES.encrypt(text, passphrase).toString();
}

function decrypt(ciphertext: string, passphrase: string): string {
  const bytes = CryptoJS.AES.decrypt(ciphertext, passphrase);
  return bytes.toString(CryptoJS.enc.Utf8);
}

export { hashString, compareHash, generateSecret, encrypt, decrypt };
