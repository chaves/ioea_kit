# Performance Optimization Guide

## Preload Warnings

### "Resource was preloaded but not used within a few seconds"

Cette erreur indique qu'une ressource est préchargée mais non utilisée immédiatement.

#### Optimisations appliquées

1. **Stratégie de préchargement changée à "tap"**
   ```html
   <body data-sveltekit-preload-data="tap">
   ```
   - ✅ `tap` : Précharge seulement au clic (recommandé)
   - ❌ `hover` : Précharge au survol (trop agressif)
   - Options : `off`, `tap`, `hover`, `viewport`

2. **Chargement asynchrone des Google Fonts**
   ```html
   <link href="..." rel="stylesheet" media="print" onload="this.media='all'" />
   ```
   - Charge les fonts de manière non-bloquante
   - Améliore le First Contentful Paint (FCP)
   - Fallback `<noscript>` pour utilisateurs sans JS

3. **DNS Prefetch pour ressources externes**
   ```html
   <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
   ```
   - Résout le DNS en avance
   - Plus rapide que `preconnect`

## Métriques de performance

### Core Web Vitals

Les optimisations visent à améliorer :

- **LCP** (Largest Contentful Paint) : < 2.5s
- **FID** (First Input Delay) : < 100ms
- **CLS** (Cumulative Layout Shift) : < 0.1

### Outils de mesure

```bash
# Lighthouse audit
npm run build
npm run preview
# Puis ouvrir DevTools → Lighthouse

# Performance en développement
npm run dev
# DevTools → Performance → Record
```

## Optimisations serveur

### Compression

AlwaysData configure automatiquement gzip/brotli pour :
- JavaScript (.js)
- CSS (.css)
- HTML (.html)
- JSON (.json)

### Cache Headers

SvelteKit configure automatiquement les headers de cache pour :
- `immutable` : Assets avec hash (/_app/immutable/*)
- `max-age=0` : Pages HTML (cache invalidé à chaque déploiement)

## Optimisations images

### Format recommandé

```typescript
// Utiliser Sharp pour optimiser les images
import sharp from 'sharp';

await sharp('input.jpg')
  .resize(800)
  .webp({ quality: 80 })
  .toFile('output.webp');
```

### Lazy loading

```html
<!-- Images non critiques -->
<img src="image.jpg" loading="lazy" alt="..." />

<!-- Images critiques (above the fold) -->
<img src="hero.jpg" loading="eager" alt="..." />
```

## Optimisations CSS

### Tailwind purge

Le fichier `tailwind.config.js` est configuré pour purger automatiquement les classes inutilisées :

```javascript
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  // ...
};
```

### Critical CSS

SvelteKit inline automatiquement le CSS critique dans `<head>`.

## Optimisations JavaScript

### Code splitting

SvelteKit split automatiquement le code par route :
- `/_app/immutable/nodes/` : Code de chaque page
- `/_app/immutable/chunks/` : Code partagé

### Tree shaking

Vite élimine automatiquement le code mort en production.

## Database Optimization

### Prisma Connection Pooling

```typescript
// Configured in DATABASE_URL
mysql://user:password@host:port/database?connection_limit=5
```

### Index optimization

Vérifier les index sur les requêtes fréquentes :

```sql
-- Voir les requêtes lentes
SHOW FULL PROCESSLIST;

-- Analyser une requête
EXPLAIN SELECT * FROM e_presentation WHERE id_themes = 216;

-- Ajouter un index si nécessaire
CREATE INDEX idx_id_themes ON e_presentation(id_themes);
```

## Monitoring

### Logs de performance

```bash
# Voir les temps de réponse sur AlwaysData
tail -f ~/admin/logs/nodejs-app.log | grep "ms"
```

### Alertes

Configurer des alertes pour :
- Temps de réponse > 1s
- Erreurs 5xx > 1%
- Utilisation mémoire > 80%

## Checklist avant déploiement

- [ ] Build en mode production : `npm run build`
- [ ] Test de performance Lighthouse : Score > 90
- [ ] Vérifier la taille des bundles : < 200KB par chunk
- [ ] Tester sur connexion 3G lente
- [ ] Vérifier les images : Format WebP, < 100KB
- [ ] Audit des dépendances : `npm audit`
- [ ] Test de charge : > 100 req/s

## Ressources

- [SvelteKit Performance](https://kit.svelte.dev/docs/performance)
- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
