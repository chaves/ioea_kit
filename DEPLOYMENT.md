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

## Notes importantes

1. **Ne jamais utiliser `--no-verify`** lors des commits - les hooks pre-commit sont importants
2. **Toujours tester localement** avant de déployer:
   ```bash
   pnpm run build
   NODE_ENV=production pnpm start
   ```
3. **Surveiller les logs** après chaque déploiement pour détecter les problèmes rapidement
