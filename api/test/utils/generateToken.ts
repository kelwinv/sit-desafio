import * as jwt from 'jsonwebtoken';

function generateTestToken(userId: string, email: string): string {
  const payload = {
    sub: userId,
    email: email,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
  };

  const secretKey = process.env.JWT_SECRET || 'test-secret-key';
  return jwt.sign(payload, secretKey);
}

export { generateTestToken };
