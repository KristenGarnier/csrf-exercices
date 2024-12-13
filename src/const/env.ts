import crypto from 'node:crypto'

// Par simplicité ici les clefs sont générés au lancement, le mieux serait de mettre en place une rotation régulière des clefs
export const SESSION_KEY = crypto.randomBytes(32).toString('hex');
export const HMAC_KEY = crypto.randomBytes(32).toString('hex');
export const COOKIE_KEY = crypto.randomBytes(32).toString('hex');
