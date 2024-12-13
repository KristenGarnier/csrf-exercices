import { Hono } from 'hono'
import {
  Session,
  sessionMiddleware,
  CookieStore,
} from 'hono-sessions'
import { serve } from '@hono/node-server'

import { setCSRFProtection, validateCSRFTokens } from './middlewares/csrf'
import { sessionCsrf } from './middlewares/session'
import { SESSION_KEY } from './const/env'


export type SessionDataTypes = {
  'userToken': string
}

const app = new Hono<{
  Variables: {
    session: Session<SessionDataTypes>,
    session_key_rotation: boolean,
    csrfToken: string
  }
}>()

const store = new CookieStore()


// Configuration de la session
app.use('*', sessionMiddleware({
  store,
  encryptionKey: SESSION_KEY, // Required for CookieStore, recommended for others
  expireAfterSeconds: 900, // Expire session after 15 minutes of inactivity
  cookieOptions: {
    sameSite: 'Lax', // Recommended for basic CSRF protection in modern browsers
    path: '/', // Required for this library to work properly
    httpOnly: true, // Recommended to avoid XSS attacks
  },
}))


app.use(sessionCsrf);


// Route pour afficher le formulaire avec protection CSRF
app.get('/form', setCSRFProtection, async (c) => {
  // On récupère le token depuis le middleware
  const token = c.var.csrfToken

  return c.html(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Formulaire sécurisé</title>
    </head>
    <body>
      <h1>Formulaire avec protection CSRF</h1>
      <form method="POST" action="/submit">
        <input type="hidden" name="_csrfToken" value="${token}">
        <div>
          <label for="username">Nom d'utilisateur:</label>
          <input type="text" id="username" name="username" required>
        </div>
        <div>
          <label for="password">Mot de passe:</label>
          <input type="password" id="password" name="password" required>
        </div>
        <button type="submit">Se connecter</button>
      </form>
    </body>
    </html>
  `)
})

// Route pour traiter le formulaire avec protection CSRF
app.post('/submit', validateCSRFTokens, async (c) => {
  try {
    const data = await c.req.parseBody()

    // Simulation d'une vérification d'authentification mauvaise, mais ce n'est pas le propos de cet exercice
    if (data.username && data.password) {
      return c.json({
        success: true,
        message: 'Formulaire traité avec succès',
        user: data.username
      })
    } else {
      return c.json({
        success: false,
        message: 'Données manquantes'
      }, 400)
    }
  } catch (error) {
    return c.json({
      success: false,
      message: 'Erreur lors du traitement du formulaire'
    }, 500)
  }
})

serve(app);

export default app
