import { hashSync } from 'bcrypt';

function hashPassword(password: string): string {
  return hashSync(password, 10);
}

export { hashPassword };
