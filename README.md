# Exercice : Protection CSRF avec Hono.js

## 🎯 Objectif pédagogique

Comprendre et implémenter une protection CSRF (Cross-Site Request Forgery) dans une application web moderne utilisant Hono.js. Cet exercice vous permettra de :
- Comprendre le fonctionnement d'une attaque CSRF
- Mettre en place une protection efficace
- Manipuler les middlewares dans Hono.js
- Gérer les tokens de sécurité

## 🚀 Pour commencer

1. Clonez ce repository
2. Installez les dépendances :
```bash
npm install
```
3. Lancez le serveur de développement :
```bash
npm run dev
```

## 📝 Consignes

Votre mission est de sécuriser une application de formulaire contre les attaques CSRF. Le code de base se trouve dans `src/app.ts`.

### Étape 1 : Configuration de la session

Dans le fichier `app.ts`, configurez le middleware de session :
- Utilisez `sessionMiddleware` de `hono-sessions`
- Définissez une clé secrète
- Configurez les options de cookie de manière sécurisée

### Étape 2 : Middleware CSRF

Créez des middlewares CSRF avec les caractéristiques suivantes :
- Un middelware permettant de créer des tokens CSRF
- Un middleare permettant de valider les tokens CSRF permettant de valider le token dans le formulaire et celui dans le cookie
- Définissez une longueur de token appropriée (minimum 32 caractères)
- Configurez une clé secrète différente de celle de la session

### Étape 3 : Protection du formulaire

Dans la route GET `/form` :
- Appliquez le middleware CSRF
- Récupérez le token CSRF généré
- Intégrez le token dans le formulaire HTML via un champ caché
- Assurez-vous que le token est correctement échappé

### Étape 4 : Validation des requêtes

Dans la route POST `/submit` :
- Appliquez le middleware CSRF
- Gérez correctement les erreurs de validation
- Renvoyez des réponses appropriées selon le résultat

## A faire

Votre solution doit passer tous les tests qui vérifient :
- La présence du token dans le formulaire
- Le rejet des requêtes sans token valide
- L'acceptation des requêtes avec un token valide

## 🔍 Points à vérifier

- [ ] Le token CSRF est unique pour chaque session
- [ ] Le token est correctement intégré dans le formulaire et dans le cookie
- [ ] Les requêtes sans token sont rejetées
- [ ] Les requêtes avec un token invalide sont rejetées
- [ ] Les requêtes avec un token valide sont acceptées
- [ ] Les messages d'erreur sont clairs et informatifs
- [ ] La solution respecte les bonnes pratiques de sécurité

## 💡 Conseils

1. Consultez la documentation de owasp avec son sheet cheat sur le double signed cookie : https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#signed-double-submit-cookie
2. Testez votre implémentation avec différents scénarios
3. Utilisez les DevTools pour inspecter les tokens et les cookies
4. N'oubliez pas de gérer les erreurs de manière appropriée

## 🎓 Pour aller plus loin

Une fois l'exercice terminé, vous pouvez essayer de :
1. Ajouter une expiration aux tokens
2. Tester des scénarios d'attaque CSRF

## 📚 Ressources utiles

- [Documentation Hono](https://hono.dev)
- [Guide OWASP sur CSRF](https://owasp.org/www-community/attacks/csrf)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)

## ✅ Solution

Une solution complète est disponible dans la branche `correction` de ce repository. Essayez de résoudre l'exercice par vous-même avant de la consulter !

La solution ne doit être consultée que :
- Après avoir tenté de résoudre l'exercice
- Pour vérifier votre approche
- Pour comprendre les meilleures pratiques

## 🆘 Besoin d'aide ?

1. Relisez attentivement les consignes
2. Vérifiez les messages d'erreur des tests
3. Consultez la documentation de Hono
4. Demandez de l'aide à votre formateur

## 🏁 Critères de réussite

Votre implémentation sera considérée comme réussie si :
1. Le code est propre et bien commenté
2. Les bonnes pratiques de sécurité sont respectées
3. La gestion des erreurs est appropriée
