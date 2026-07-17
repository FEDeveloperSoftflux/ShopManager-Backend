import crypto from 'crypto';
 
/**
 * Hashes a plaintext password using PBKDF2 with SHA-512 and a random salt.
 * Returns the format `salt:hash`
 */
export const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
};
 
/**
 * Verifies a plaintext password against a stored `salt:hash` string.
 * Supports plaintext fallback.
 */
export const verifyPassword = (password, storedPassword) => {
  if (!storedPassword || !storedPassword.includes(':')) {
    // Plaintext fallback for legacy/unmigrated users
    return password === storedPassword;
  }
  const [salt, hash] = storedPassword.split(':');
  const checkHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === checkHash;
};
