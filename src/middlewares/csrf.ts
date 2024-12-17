
import { setSignedCookie, getSignedCookie } from 'hono/cookie'
import {
  Session,
} from 'hono-sessions'
import type { SessionDataTypes } from '../index.ts'
import crypto from 'node:crypto'
import { createMiddleware } from 'hono/factory'
import { COOKIE_KEY, HMAC_KEY } from '../const/env.ts'

// définition de la protection CSRF pour le formulaire
export const setCSRFProtection = createMiddleware<{
  Variables: {
    session: Session<SessionDataTypes>,
    csrfToken: string
  }
}>(async (c, next) => {
  const csrfToken = crypto.randomBytes(32).toString('hex'); // génération d'une chaine de caractère random
  const session = c.get('session');

  const userToken = session.get('userToken');
  if (!userToken) { // SI la session n'existe pas cela veut dire que l'utilisateur est frauduleux 
    return c.text("No existing session", 401)
  }

  const fullToken = `${userToken.length}!${userToken}!${csrfToken.length}!${csrfToken}`; // on concatène des informations pour créer une chaine de caractère avec le token user et le token csrf
  const hashedValue = crypto.createHmac("sha256", HMAC_KEY).update(fullToken).digest("hex"); // on la hash pour que le cookie soit totalement opaque


  // on utilise le setSignedCookie pour enregistrer le token et le signer
  await setSignedCookie(c, 'csrfToken', `${hashedValue}.${crypto.randomBytes(12).toString('hex') // on ajoute une valeur random pour éviter les collision entre éventuels tokensn 
    }`, COOKIE_KEY, {
    secure: process.env.NODE_ENV === 'production',
    //domain: 'example.com', you should use this in production
    httpOnly: true,
    maxAge: 1000,
    sameSite: 'Strict',
  })

  c.set('csrfToken', csrfToken);

  await next();
})


// on utilsie un middleware de validation de token
export const validateCSRFTokens = createMiddleware(async (c, next) => {
  const fullCsrfToken = await getSignedCookie(c, COOKIE_KEY, "csrfToken") // on récupère le token généré précedemment
  if (!fullCsrfToken) { return c.text('Form does not have protection') } // on vérifie que l'on a bien le csrf token sinon cela veut dire que le formulaire n'était pas protégé 

  const csrfToken = fullCsrfToken.split('.')[0]; // on le split pour récupérer que le token et enlever le random de collision

  //on récupère le token présent dans le formulaire
  const body = await c.req.parseBody()
  const tokenForm = body._csrfToken as string;

  // on récupère le token user présent dans la session
  const session = c.get('session');
  const userToken = session.get('userToken');

  // on reconstruit un token et le reash pour pouvoir vérifier qu'il correspond bien à celui de notre cookie
  const fullToken = `${userToken.length}!${userToken}!${tokenForm.length}!${tokenForm}`;
  const hmacRecreation = crypto.createHmac("sha256", HMAC_KEY).update(fullToken).digest("hex");

  if (hmacRecreation === csrfToken) {
    await next()
  } else {
    return c.text("Form is not submitted by proper website", 403)
  }
})

