#!/usr/bin/env bash
# ==============================================================================
# SiteNest VPS Automated Setup Script for Ubuntu 22.04 / 24.04 LTS
# ==============================================================================
set -e

echo "=== Starting SiteNest VPS Setup ==="

# 1. Update system packages
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git build-essential nginx certbot python3-certbot-nginx redis-server postgresql postgresql-contrib

# 2. Install Node.js 22 LTS
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pnpm pm2

# 3. Create platform user & storage directories
sudo mkdir -p /var/www/sitenest/storage/uploads/pending
sudo mkdir -p /var/www/sitenest/storage/websites
sudo mkdir -p /var/www/sitenest/storage/temporary
sudo mkdir -p /var/www/sitenest/logs
sudo chown -R $USER:$USER /var/www/sitenest

# 4. Configure PostgreSQL
sudo -u postgres psql -c "CREATE USER sitenest WITH PASSWORD 'change_this_secure_password';" || true
sudo -u postgres psql -c "CREATE DATABASE sitenest OWNER sitenest;" || true

# 5. Build application
cd /var/www/sitenest/application
pnpm install
pnpm exec prisma db push
pnpm exec tsx scripts/seed.ts
pnpm build

# 6. Setup PM2 services (Next.js Application + Deployment Worker)
pm2 start npm --name "sitenest-web" -- start
pm2 start pnpm --name "sitenest-worker" -- exec tsx worker/index.ts
pm2 save
pm2 startup

# 7. Configure Nginx
sudo cp scripts/nginx/sitenest.conf /etc/nginx/sites-available/sitenest.conf
sudo ln -sf /etc/nginx/sites-available/sitenest.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

echo "=== SiteNest VPS Deployment Finished Successfully ==="
