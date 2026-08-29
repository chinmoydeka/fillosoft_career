# Production Deployment Guide: `fillosoft_career`
**Repository**: `https://github.com/chinmoydeka/fillosoft_career.git`  
**Target Domain**: `careers.fillosoft.com`  
**Server Environment**: Ubuntu 20.04 / 22.04 LTS + Nginx + Node.js (PM2) + Certbot (SSL)

---

## 📌 Summary of Architecture
- **Frontend SPA**: React (built to `/var/www/fillosoft_career/client/dist`) served directly via Nginx.
- **Backend API**: Express server running on port `5000` via PM2, proxied by Nginx (`http://127.0.0.1:5000`).
- **Database**: SQLite (`fillosoft_careers.db` in `server/`).
- **File Uploads**: Resumes stored safely in `/var/www/fillosoft_career/server/uploads/`.

---

## 🚀 Step 1: Install System Prerequisites on Ubuntu

Run these commands on your Ubuntu server terminal:

```bash
# 1. Update system packages
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git build-essential unzip ufw

# 2. Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 3. Install PM2 globally (Process Manager)
sudo npm install -g pm2

# 4. Install Nginx & Certbot
sudo apt install -y nginx certbot python3-certbot-nginx
```

---

## 📦 Step 2: Clone Repository & Build Project

```bash
# 1. Create project folder & assign ownership
sudo mkdir -p /var/www/fillosoft_career
sudo chown -R $USER:$USER /var/www/fillosoft_career

# 2. Clone your repository
git clone https://github.com/chinmoydeka/fillosoft_career.git /var/www/fillosoft_career

# 3. Setup Backend Server
cd /var/www/fillosoft_career/server
npm install --production
mkdir -p uploads
chmod 755 uploads

# 4. Build Frontend Bundle
cd /var/www/fillosoft_career/client
npm install
npm run build
```

---

## ⚡ Step 3: Run Backend Server with PM2

```bash
# Start backend Express server
cd /var/www/fillosoft_career/server
pm2 start index.js --name "fillosoft-career"

# Save PM2 state & enable auto-start on reboot
pm2 save
pm2 startup
```
*(Note: Execute the `sudo env PATH=...` command that `pm2 startup` outputs on screen)*

---

## 🌐 Step 4: Configure Nginx Web Server

Create a new Nginx site configuration file:

```bash
sudo nano /etc/nginx/sites-available/careers.fillosoft.com
```

Paste the following complete **Nginx Server Block**:

```nginx
server {
    listen 80;
    server_name careers.fillosoft.com;

    # Allow file uploads up to 10MB
    client_max_body_size 10M;

    # 1. Serve Built React Frontend
    root /var/www/fillosoft_career/client/dist;
    index index.html;

    # Single Page Application (SPA) Routing Fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 2. Proxy REST API Requests to Node.js Backend (Port 5000)
    location /api/ {
        proxy_pass http://127.0.0.1:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # 3. Secure File Uploads Delivery (Enforces Download, Anti-Script Execution)
    location /uploads/ {
        alias /var/www/fillosoft_career/server/uploads/;
        add_header Content-Disposition attachment;
        add_header X-Content-Type-Options nosniff;
        add_header Content-Security-Policy "default-src 'none'";
        expires 30d;
    }

    # 4. SEO & AEO Routes (Sitemap & Robots)
    location = /sitemap.xml {
        proxy_pass http://127.0.0.1:5000/sitemap.xml;
    }

    location = /robots.txt {
        proxy_pass http://127.0.0.1:5000/robots.txt;
    }
}
```

Save and exit (`Ctrl + O`, `Enter`, `Ctrl + X`).

---

## 🔗 Step 5: Enable Nginx Configuration & Reload

```bash
# Enable the site configuration link
sudo ln -s /etc/nginx/sites-available/careers.fillosoft.com /etc/nginx/sites-enabled/

# Test Nginx syntax
sudo nginx -t

# If output says 'syntax is ok', reload Nginx
sudo systemctl reload nginx
```

---

## 🔒 Step 6: Enable Free HTTPS (SSL Certificate)

1. Ensure your domain `careers.fillosoft.com` has an **A Record** pointing to your Ubuntu server's IP address.
2. Run Certbot to generate and configure SSL automatically:

```bash
sudo certbot --nginx -d careers.fillosoft.com
```

Certbot will automatically update your Nginx configuration to force HTTPS (Port 443) and manage auto-renewal.

---

## 🛡️ Step 7: Configure Firewall (UFW)

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

---

## 🔄 Updating Project Code in the Future

When you push new updates to GitHub in the future, run this quick script on your server:

```bash
cd /var/www/fillosoft_career
git pull origin main

# Rebuild client
cd client && npm install && npm run build

# Restart backend
cd ../server && npm install --production && pm2 restart fillosoft-career
```
