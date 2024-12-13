import crypto from 'node:crypto'

export const SESSION_KEY = crypto.randomBytes(32).toString('hex');
export const HMAC_KEY = crypto.randomBytes(32).toString('hex');
export const USER_TOKEN_KEY = crypto.randomBytes(32).toString('hex');
export const COOKIE_KEY = crypto.randomBytes(32).toString('hex');
