# Deployment Guide - AlwaysData

Ce guide explique comment déployer l'application IOEA sur AlwaysData avec Node.js 22.

## Configuration AlwaysData

### 1. Configuration de l'application Node.js

Dans le panneau d'administration AlwaysData:

1. **Sites Web** → **Ajouter un site**
   - Type: Node.js
   - Version: Node.js 22
   - Point d'entrée: `server.js`
   - Répertoire de travail: `/home/votre-compte/ioea_kit`

### 2. Variables d'environnement

Configurez les variables suivantes dans **Environnement** → **Variables**:

```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=mysql://user:password@host:port/database
HOST=0.0.0.0
```

**Note**: Additional environment variables are set in `server.js` (see below).

### 3. Build et déploiement

Après avoir poussé le code sur le serveur:

```bash
# Installation des dépendances
pnpm install

# Build de l'application
pnpm run build

# Démarrage (géré automatiquement par AlwaysData)
pnpm start
```

## Gestion du signal SIGUSR2

AlwaysData utilise le signal **SIGUSR2** pour redémarrer les applications Node.js de manière gracieuse.

### Fonctionnement

Le fichier `server.js` gère automatiquement:

1. **Réception du signal SIGUSR2**
   - Arrête d'accepter de nouvelles connexions
   - Attend que les requêtes en cours se terminent
   - Ferme les connexions à la base de données
   - Termine le processus proprement

2. **Timeout de sécurité**
   - Si le shutdown prend plus de 30 secondes, force l'arrêt
   - Évite les blocages lors des redéploiements

3. **Gestion d'erreurs**
   - Intercepte les erreurs non gérées
   - Effectue un shutdown gracieux en cas d'erreur critique

### Commandes de redémarrage

Sur AlwaysData, vous pouvez:

1. **Via l'interface web**:
   - Sites Web → Votre site → Bouton "Redémarrer"

2. **Via SSH**:
   ```bash
   # Redémarrage gracieux
   kill -SIGUSR2 $(cat /home/votre-compte/ioea_kit/app.pid)

   # Ou via systemctl si configuré
   systemctl reload nodejs-app
   ```

## Monitoring

### Logs

Les logs sont accessibles dans:
- **Interface AlwaysData**: Sites Web → Votre site → Logs
- **SSH**: `/home/votre-compte/admin/logs/`

### Vérification du bon fonctionnement

```bash
# Vérifier que le serveur écoute
curl http://localhost:3000

# Vérifier les processus Node.js
ps aux | grep node

# Suivre les logs en temps réel (via SSH)
tail -f /home/votre-compte/admin/logs/nodejs-app.log
```

## Troubleshooting

### Le serveur ne redémarre pas après SIGUSR2

1. Vérifier les logs pour voir si le shutdown s'est bien passé
2. Vérifier que les connexions DB sont bien fermées
3. Augmenter le timeout si nécessaire (actuellement 30s)

### Port déjà utilisé

```bash
# Trouver le processus qui utilise le port
lsof -i :3000

# Tuer le processus si nécessaire
kill -9 PID
```

### Problèmes de build

```bash
# Nettoyer et rebuilder
rm -rf build node_modules
pnpm install
pnpm run build
```

## Structure des fichiers

```
ioea_kit/
├── server.js              # Wrapper de serveur avec gestion SIGUSR2
├── build/                 # Application buildée par SvelteKit
│   ├── index.js          # Point d'entrée SvelteKit
│   ├── handler.js        # Handler HTTP de SvelteKit
│   └── server/           # Code serveur
├── package.json          # Script "start" pointe vers server.js
└── svelte.config.js      # Configuration adapter-node
```

## Critical Production Configuration (server.js)

The `server.js` file sets several critical environment variables that **must be configured before** the SvelteKit handler is imported. This is done using dynamic import:

### BODY_SIZE_LIMIT

```javascript
process.env.BODY_SIZE_LIMIT = '12582912'; // 12MB
```

**Purpose**: Allows file uploads up to 12MB (default is 512KB).

**Symptoms if missing**: Form submissions with file uploads fail with:
```
Error: Content-length of XXXXX exceeds limit of 524288 bytes.
```

### ORIGIN (CSRF Protection)

```javascript
process.env.ORIGIN = 'https://www.ioea.eu';
```

**Purpose**: SvelteKit validates that form submissions come from the correct origin for CSRF protection.

**CRITICAL**: This **must match exactly** the domain users access the site from:
- ✅ `https://www.ioea.eu` (correct)
- ❌ `https://ioea.eu` (wrong - missing www)
- ❌ `https://ioea.org` (wrong - different domain)

**Symptoms if wrong**: All form submissions are blocked silently or return 403 errors.

### Reverse Proxy Headers

```javascript
process.env.PROTOCOL_HEADER = 'x-forwarded-proto';
process.env.HOST_HEADER = 'x-forwarded-host';
```

**Purpose**: Trust forwarded headers from AlwaysData's reverse proxy for correct protocol/host detection.

### Why Dynamic Import?

ES module imports are hoisted, meaning they execute before any other code. To ensure environment variables are set before the handler reads them, we use dynamic import:

```javascript
// Set env vars FIRST
process.env.BODY_SIZE_LIMIT = '12582912';
process.env.ORIGIN = 'https://www.ioea.eu';

// THEN import handler
const { handler } = await import('./build/handler.js');
```

## Form Upload Configuration (step3)

### File Validation

- **Max file size**: 5MB per file (CV + paper)
- **Accepted format**: PDF only (case-insensitive: `.pdf`, `.PDF`, `.Pdf`)
- **Upload directory**: `uploads/IOEA{year}_call/`

### Common Issues

1. **"Only PDF files are accepted"** - File extension check is case-insensitive
2. **"Content-length exceeds limit"** - BODY_SIZE_LIMIT not set correctly
3. **Form blocked at step 1** - ORIGIN doesn't match the actual domain

## Notes importantes

1. **Ne jamais utiliser `--no-verify`** lors des commits - les hooks pre-commit sont importants
2. **Toujours tester localement** avant de déployer:
   ```bash
   pnpm run build
   NODE_ENV=production pnpm start
   ```
3. **Surveiller les logs** après chaque déploiement pour détecter les problèmes rapidement
4. **Vérifier les variables d'environnement** dans les logs de démarrage:
   ```
   Body size limit: 12582912 bytes
   ```
