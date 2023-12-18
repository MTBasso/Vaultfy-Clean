import { hash } from 'bcrypt';

async function hashString(string: string): Promise<string> {
  return await hash(string, 10);
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

export { hashString, generateSecret };
