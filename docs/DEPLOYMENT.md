# Deployment Specification

Since this application uses a dynamic Node/Express backend that persists site changes by writing directly to local JSON flat-file database records (`site-db.json` and `projects-db.json`), standard serverless platforms (like Vercel or Netlify) are **not recommended** because their ephemeral filesystem wipes all database edits on every serverless function container spin-up.

For this project, the best deployment platforms are **Render**, **Railway**, or a **VPS** (e.g. DigitalOcean), which support persistent disk mounts or persistent filesystems.

---

## 1. Primary Option: Render Web Service (with Persistent Disk)

Render is the recommended hosting platform as it provides a managed Node.js runtime and allows mounting a persistent disk volume to protect database records.

### Step-by-Step Configuration:

1. **Create Web Service**:
   - Link your GitHub repository to Render.
   - Choose **Node** as the runtime.

2. **Build and Start Commands**:
   - **Build Command**: `npm run build` (compiles frontend assets and bundles the Express server to `dist/server.cjs`).
   - **Start Command**: `npm run start` (runs the bundled server).

3. **Configure Environment Variables**:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `ADMIN_PASSWORD`: `anshayadmin` (or your secure passcode string)
   - `GEMINI_API_KEY`: Your Google Gemini API Key

4. **Attach Persistent Disk (Volume)**:
   - Go to the **Disk** settings tab.
   - Click **Add Disk**.
   - **Name**: `portfolio-db`
   - **Mount Path**: `/backend/data`
   - **Size**: `1 GB` (more than sufficient for flat JSON arrays)
   - *This ensures changes saved via the admin panel persist permanently when the service restarts or redeploys.*

---

## 2. Alternative Option: VPS Deployment (DigitalOcean, Linode)

For full control over files and system processes, deploy to a virtual private server (Linux/Ubuntu).

### Step-by-Step Instructions:

1. **Server Setup**:
   - Connect via SSH and install Node.js (v20+), Git, and PM2:
     ```bash
     curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
     sudo apt-get install -y nodejs git
     sudo npm install -g pm2
     ```

2. **Clone and Install**:
   - Clone the source repository to the `/var/www/portfolio` directory:
     ```bash
     git clone https://github.com/your-username/portfolio.git /var/www/portfolio
     cd /var/www/portfolio
     npm install
     ```

3. **Production Build**:
   - Compile both client assets and server bundle:
     ```bash
     npm run build
     ```

4. **Process Management**:
   - Start the PM2 daemon with required environmental variables:
     ```bash
     PORT=5000 NODE_ENV=production PM2_HOME=/root/.pm2 pm2 start dist/server.cjs --name "portfolio-app"
     pm2 save
     pm2 startup
     ```

5. **Nginx Reverse Proxy**:
   - Direct port 80/443 traffic to Node on port 5000:
     ```nginx
     server {
         listen 80;
         server_name yourdomain.com;

         location / {
             proxy_pass http://127.0.0.1:5000;
             proxy_http_version 1.1;
             proxy_set_header Upgrade $http_upgrade;
             proxy_set_header Connection 'upgrade';
             proxy_set_header Host $host;
             proxy_cache_bypass $http_upgrade;
         }
     }
     ```
   - Install **Certbot** to automatically provision free Let's Encrypt SSL certificates.
