# AlwaysData Deployment - Quick Start

## Automatic Deployment Setup

### Option 1: Git Post-Receive Hook (Easiest)

1. **On AlwaysData server**, set up a bare git repository:

```bash
cd ~/www
git clone --bare https://github.com/chaves/ioea_kit.git ioea_kit.git
cd ioea_kit.git
```

2. **Create the post-receive hook**:

```bash
cat > hooks/post-receive << 'EOF'
#!/bin/bash
cd ~/www/ioea_kit
git --git-dir=../ioea_kit.git --work-tree=. checkout -f main
cd ~/www/ioea_kit
./deploy.sh
EOF

chmod +x hooks/post-receive
```

3. **On your local machine**, add AlwaysData as a remote:

```bash
git remote add alwaysdata ssh://[username]@ssh-[account].alwaysdata.net:22/~/www/ioea_kit.git
```

4. **Deploy automatically**:

```bash
git push alwaysdata main
```

Every push to `alwaysdata` will automatically:
- Pull the latest code
- Install dependencies
- Generate Prisma client
- Build the application
- Restart the service

### Option 2: GitHub Webhook

1. **On AlwaysData**, place the webhook script:

```bash
# Copy webhook-deploy.php to your web root
cp webhook-deploy.php ~/www/webhook-deploy.php
# Edit and set your SECRET and PROJECT_PATH
nano ~/www/webhook-deploy.php
```

2. **In GitHub**:
   - Go to your repository → **Settings** → **Webhooks** → **Add webhook**
   - **Payload URL**: `https://yourdomain.com/webhook-deploy.php`
   - **Content type**: `application/json`
   - **Secret**: Set a strong secret (update in webhook-deploy.php)
   - **Events**: Select "Just the push event"

3. **Test**: Push to main branch, deployment should trigger automatically

### Option 3: Manual Deployment Script

Simply run on the server:

```bash
cd ~/www/ioea_kit
./deploy.sh
```

## Initial Server Setup

1. **SSH into AlwaysData**
2. **Clone repository**:
   ```bash
   cd ~/www
   git clone https://github.com/chaves/ioea_kit.git
   cd ioea_kit
   ```

3. **Install Node.js** (if not already):
   - Go to AlwaysData dashboard → **Environment** → **Languages** → **Node.js**
   - Install Node.js 18+

4. **Install dependencies**:
   ```bash
   npm install
   npx prisma generate
   ```

5. **Configure environment**:
   ```bash
   cp .env.example .env
   nano .env
   # Set DATABASE_URL
   ```

6. **Build**:
   ```bash
   npm run build
   ```

7. **Set up service**:
   - Go to AlwaysData → **Environment** → **Scheduled services**
   - Create new service:
     - **Name**: `ioea-kit`
     - **Command**: `node /home/[username]/www/ioea_kit/build/index.js`
     - **Working directory**: `/home/[username]/www/ioea_kit`
     - **Start mode**: Automatic

8. **Configure reverse proxy**:
   - Go to **Web** → **Sites** → Your site
   - **Type**: Reverse proxy
   - **Target**: `http://localhost:3000`

## Environment Variables

Set in AlwaysData scheduled service or `.env` file:

- `DATABASE_URL`: MySQL connection string
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: `production`

## Troubleshooting

- **Check logs**: AlwaysData dashboard → Scheduled services → Logs
- **Test locally**: `npm run build && npm start`
- **Verify port**: Ensure reverse proxy matches your PORT setting

For detailed instructions, see `.alwaysdata-deploy.md`

