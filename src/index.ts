import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import session from 'hono-session'
import { csrf } from 'hono/csrf'

const app = new Hono()

// TODO: Configurer la session middleware
// Indice: utilisez app.use() avec le middleware session avec hono session

// TODO: Créer le middleware CSRF
// Indice: utilisez la fonction csrf() de Hono

// Route pour afficher le formulaire
app.get('/form', async (c) => {
  // TODO: Protéger cette route avec le middleware CSRF
  // TODO: Récupérer le token CSRF
  // TODO: L'inclure dans le formulaire
  return c.html(`
    <form method="POST" action="/submit">
      <!-- TODO: Ajouter le champ caché pour le token CSRF -->
      <input type="text" name="username" placeholder="Nom d'utilisateur">
      <input type="password" name="password" placeholder="Mot de passe">
      <button type="submit">Se connecter</button>
    </form>
  `)
})

// Route pour traiter le formulaire
app.post('/submit', async (c) => {
  // TODO: Protéger cette route avec le middleware CSRF
  try {
    const data = await c.req.parseBody()
    // Simulation de traitement
    return c.json({ success: true, message: 'Formulaire traité avec succès' })
  } catch (error) {
    return c.json({ success: false, message: 'Erreur de traitement' }, 400)
  }
})

serve(app)

export default app
