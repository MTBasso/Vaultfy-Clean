import { hash, compare } from 'bcryptjs';

async function hashString(string: string): Promise<string> {
  return await hash(string, 10);
}

async function compareHash(inputPassword: string, userPassword: string): Promise<boolean> {
  const passwordMatch = await compare(inputPassword, userPassword);
  return passwordMatch;
}

function generateSecret(): string {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_+=<>?';
  let randomString = '';
  for (let i = 0; i < 35; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }
  return randomString;
}

export { hashString, compareHash, generateSecret };
