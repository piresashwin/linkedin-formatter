import * as crypto from 'crypto';

/**
 * Generates a salt and hashes the password using the salt.
 * @param password - The plain text password to hash.
 * @returns An object containing the salt and the hashed password.
 */
export function saltAndHashPassword(password: string): { salt: string; hashedPassword: string } {
    // Generate a random salt
    const salt = crypto.randomBytes(16).toString('hex');

    // Hash the password with the salt
    const hashedPassword = crypto
        .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
        .toString('hex');

    return { salt, hashedPassword };
}

/**
 * Verifies if a given password matches the hashed password using the provided salt.
 * @param password - The plain text password to verify.
 * @param salt - The salt used to hash the original password.
 * @param hashedPassword - The hashed password to compare against.
 * @returns A boolean indicating whether the password is valid.
 */
export function verifyPassword(password: string, salt: string, hashedPassword: string): boolean {
    // Hash the input password with the provided salt
    const hashToVerify = crypto
        .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
        .toString('hex');

    // Compare the generated hash with the stored hash
    return hashToVerify === hashedPassword;
}