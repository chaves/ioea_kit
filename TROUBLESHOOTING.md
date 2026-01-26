# Troubleshooting Guide

## Erreur: "A listener indicated an asynchronous response by returning true..."

### Description
```
Error: A listener indicated an asynchronous response by returning true,
but the message channel closed before a response was received
```

### Cause
Cette erreur provient **d'une extension de navigateur** (Chrome, Edge, Brave, etc.) et non du code de l'application.

### Solutions

#### 1. Identifier l'extension responsable

**Mode Navigation Privée** (recommandé):
1. Ouvrez une fenêtre de navigation privée (Cmd+Shift+N ou Ctrl+Shift+N)
2. Testez l'application
3. Si l'erreur disparaît, c'est bien une extension

**Désactiver les extensions**:
1. Ouvrez `chrome://extensions/` (ou `edge://extensions/`)
2. Désactivez toutes les extensions
3. Réactivez-les une par une pour identifier la coupable

#### 2. Extensions problématiques courantes

Extensions connues pour causer cette erreur:
- **Grammarly**
- **LastPass** / gestionnaires de mots de passe
- **React DevTools** / Vue DevTools
- **Adblock** / uBlock Origin
- **Google Translate**
- **ColorZilla**
- **Honey** / extensions de coupons
- **MetaMask** / extensions crypto

#### 3. Vérifier si l'erreur affecte l'application

Dans la plupart des cas, cette erreur:
- ❌ **N'affecte PAS** le fonctionnement de l'application
- ❌ **N'affecte PAS** les utilisateurs finaux
- ✅ Apparaît uniquement dans la console développeur
- ✅ Peut être ignorée en toute sécurité

#### 4. Filtrer l'erreur dans Chrome DevTools

Pour masquer cette erreur dans la console:
1. Ouvrez la Console DevTools (F12)
2. Cliquez sur l'icône de filtre (entonnoir)
3. Ajoutez un filtre négatif: `-A listener indicated`

## Erreurs liées au serveur (AlwaysData)

### Le serveur ne démarre pas après un redéploiement

**Vérifications**:
```bash
# Vérifier les logs
tail -f ~/admin/logs/nodejs-app.log

# Vérifier si le port est occupé
lsof -i :3000

# Vérifier les processus Node.js
ps aux | grep node
```

**Solutions**:
```bash
# Nettoyer et rebuilder
cd ~/ioea_kit
rm -rf build node_modules
pnpm install
pnpm run build

# Redémarrer manuellement
pnpm start
```

### SIGUSR2 ne déclenche pas le reload

**Vérifications**:
```bash
# Vérifier que le processus écoute SIGUSR2
ps aux | grep "node server.js"

# Envoyer le signal manuellement
kill -SIGUSR2 <PID>
```

**Configuration AlwaysData**:
- Assurez-vous que le point d'entrée est bien `server.js`
- Vérifiez que Node.js 22 est bien configuré

### Connexions base de données qui ne se ferment pas

Si vous voyez "Too many connections" :

```bash
# Vérifier les connexions MySQL actives
mysql -e "SHOW PROCESSLIST;"

# Redémarrer l'application
kill -SIGUSR2 $(cat ~/ioea_kit/app.pid)
```

## Erreurs de build

### `Cannot find module './build/handler.js'`

**Cause**: L'application n'a pas été buildée

**Solution**:
```bash
pnpm run build
```

### Erreurs TypeScript lors du build

**Solution**:
```bash
# Vérifier les erreurs
pnpm run check

# Nettoyer et rebuilder
rm -rf .svelte-kit
pnpm run build
```

## Erreurs de développement

### Le serveur de dev ne démarre pas

```bash
# Nettoyer et redémarrer
rm -rf .svelte-kit node_modules
pnpm install
pnpm run dev
```

### Hot reload ne fonctionne pas

```bash
# Vérifier que Vite peut écrire dans .svelte-kit
ls -la .svelte-kit/

# Redémarrer avec le cache vidé
rm -rf .svelte-kit
pnpm run dev
```

## Performance

### Le site est lent

**Vérifications côté serveur**:
```bash
# Vérifier la charge CPU
top

# Vérifier la mémoire
free -h

# Vérifier les connexions DB
mysql -e "SHOW STATUS LIKE 'Threads_connected';"
```

**Optimisations**:
1. Activer la compression gzip dans le serveur
2. Utiliser un CDN pour les assets statiques
3. Optimiser les requêtes de base de données
4. Ajouter des index sur les tables fréquemment requêtées

## Besoin d'aide supplémentaire

Si le problème persiste:
1. Vérifiez les logs: `tail -f ~/admin/logs/nodejs-app.log`
2. Vérifiez la configuration AlwaysData
3. Contactez le support AlwaysData si nécessaire
4. Ouvrez une issue sur le repository GitHub
