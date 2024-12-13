
import crypto from 'node:crypto'
import { createMiddleware } from 'hono/factory'

// définition de la pseudo session qui défini le token utilisateur, car nous n'avons pas de réel utilisateur
export const sessionCsrf = createMiddleware(async (c, next) => {
  const session = c.get('session');
  const userToken = session.get('userToken');

  if (userToken) return await next();

  session.set('userToken', crypto.randomBytes(32).toString('hex'));
  await next();
});

