import * as bcrypt from 'bcrypt-edge';

const SALT_ROUNDS = 10;

/**
 * Generates a salt and hashes the password using bcrypt.
 * @param password - The plain text password to hash.
 * @returns A promise that resolves to the hashed password (contains the salt embedded).
 */
export async function saltAndHashPassword(password: string): Promise<string> {
    return bcrypt.hashSync(password, SALT_ROUNDS);
}

/**
 * Verifies if a given password matches the hashed password.
 * @param password - The plain text password to verify.
 * @param hashedPassword - The hashed password to compare against (includes the salt).
 * @returns A promise that resolves to a boolean indicating whether the password is valid.
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compareSync(password, hashedPassword);
}