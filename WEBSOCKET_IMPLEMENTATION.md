# WebSocket Real-Time Notification System

## Overview

This document describes the complete WebSocket implementation for real-time notifications in the Giftspire application. The system uses **Laravel Reverb** (backend) and **Laravel Echo with Pusher JS** (frontend) to deliver instant notifications when gift search results are ready.

---

## Architecture

### Backend (Laravel)
- **WebSocket Server**: Laravel Reverb (running on port 9000)
- **Broadcasting Driver**: Reverb (using Pusher protocol)
- **Queue System**: Database-based queue
- **Authentication**: Laravel Sanctum
- **Channel Type**: Private channels (user-specific)

### Frontend (Vue.js)
- **WebSocket Client**: Laravel Echo + Pusher JS
- **State Management**: Pinia stores
- **Authentication**: Bearer token from localStorage
- **Broadcaster**: `pusher` (Reverb is Pusher-protocol compatible)

---

## Security Features ✅

### 1. **Private Channel Authorization**
- Each user can only subscribe to their own private channel
- Channel format: `App.Models.User.{userId}`
- Authorization handled via `UserChannel` class (backend/app/Broadcasting/UserChannel.php:21-23)

```php
public function join(User $user, UserId $id): array|bool
{
    return $user->id === $id->value; // Only allow if user IDs match
}
```

### 2. **Sanctum Token Authentication**
- All WebSocket connections require valid Sanctum bearer token
- Token sent in Authorization header for channel subscription
- Verified via `/api/broadcasting/auth` endpoint (routes/api.php)

### 3. **CORS Configuration**
- Strict origin validation in `config/cors.php:22`
- Only allowed origins can connect
- Production: Must update `REVERB_ALLOWED_ORIGINS` and `CORS_ALLOWED_ORIGINS`

### 4. **Broadcast Route Protection**
```php
Broadcast::routes(['middleware' => ['auth:sanctum']]);
```

### 5. **Channel Isolation**
- Users can ONLY receive notifications on their private channel
- No cross-user notification leakage
- Event broadcasting uses `toOthers()` to prevent self-notification

### 6. **Input Validation**
- All notification data is type-checked
- Max notification storage: 50 (prevents memory issues)
- Request size limits: 10,000 bytes (configurable)

---

## Implementation Details

### Backend Files

#### 1. **ProcessSearchRequestJob** (app/Jobs/ProcessSearchRequestJob.php:61-70)
Dispatches notification when search completes:
```php
broadcast(new SearchCompletedNotification(
    userId: $this->user->id,
    orderId: $generatedOrder->id,
    title: 'Gift Search Completed!',
    message: "We found {$recommendationsCount} perfect gift matches for you",
    icon: '🎁',
    type: 'success',
))->toOthers();
```

#### 2. **SearchCompletedNotification Event** (app/Events/SearchCompletedNotification.php)
- Implements `ShouldBroadcast` interface
- Broadcast channel: `new PrivateChannel('App.Models.User.' . $this->userId->value)`
- Event name: `search.completed` (line 50-52)
- Payload: order_id, title, message, icon, type, timestamp

#### 3. **UserChannel Authorization** (app/Broadcasting/UserChannel.php)
- Verifies user can only access their own channel
- Called automatically by Laravel when client subscribes

#### 4. **Docker Compose Configuration** (docker-compose.yml:29-48)
Reverb service runs separately:
```yaml
reverb:
  command: "php artisan reverb:start --host=0.0.0.0 --port=9000"
  ports:
    - "9000:9000"
```

### Frontend Files

#### 1. **WebSocket Configuration** (src/config/websocket.ts)
- Reads from environment variables
- Sets up authentication headers
- Configures reconnection behavior

#### 2. **Notification Store** (src/stores/notification.ts)
- Manages notification state
- Handles WebSocket events
- Provides unread count
- Max 50 notifications stored

#### 3. **Echo Plugin** (src/plugins/echo.ts)
- Initializes Laravel Echo instance
- Sets up channel listeners
- Handles authentication state changes
- Auto-reconnects when user logs in/out

Key listener (line 57-74):
```typescript
echo
  .private(`App.Models.User.${userId}`)
  .listen('.search.completed', (data) => {
    notificationStore.handleWebSocketNotification(data)
    toastStore.success(data.message, data.title, { duration: 7000 })
  })
```

#### 4. **AppHeader Component** (src/components/pagination/AppHeader.vue)
- Displays notifications in real-time
- Shows unread count
- Formats timestamps
- Handles navigation to search results

---

## Testing Instructions

### 1. **Start Backend Services**

```bash
cd giftspire-backend

# Start all Docker services (app, webserver, reverb, db)
docker compose up -d

# IMPORTANT: Clear and cache configuration (if .env was changed)
docker compose exec app php artisan config:clear
docker compose exec app php artisan config:cache

# Run database migrations if not done
docker compose exec app php artisan migrate

# Start the queue worker (IMPORTANT!)
docker compose exec app php artisan queue:work --tries=3
```

**Important Notes:**
- The queue worker MUST be running for jobs to process and notifications to be sent!
- If you change `.env`, always run `config:clear` and `config:cache` before restarting services

**⚠️ Docker Networking:** The backend `.env` must use `REVERB_HOST="reverb"` (Docker service name) while `VITE_REVERB_HOST="localhost"` for frontend browser connection. See `../WEBSOCKET_FIX.md` for details.

### 2. **Start Frontend Development Server**

```bash
cd giftspire-frontend

# Install dependencies if not done
npm install

# Start dev server
npm run dev
```

Frontend should run on `http://localhost:5173` (or port configured in Vite)

### 3. **Test the Flow**

1. **Login to the application**
   - Go to frontend URL
   - Login with valid credentials
   - Check browser console for: `[WebSocket] Echo initialized on app start`

2. **Verify WebSocket Connection**
   - Open browser DevTools → Network tab → WS filter
   - Should see connection to `ws://localhost:9000`
   - Status should be "101 Switching Protocols" (success)

3. **Trigger a Gift Search**
   - Fill out the gift search form
   - Submit the search
   - Backend will dispatch `ProcessSearchRequestJob` to the queue

4. **Watch for Notification**
   - Queue worker processes the job
   - Searches for products
   - Broadcasts `SearchCompletedNotification`
   - Frontend receives via WebSocket
   - Toast notification appears
   - Bell icon shows unread count
   - Notification appears in dropdown

5. **Console Logs to Watch**
   - Backend: Check queue worker output for job processing
   - Frontend console:
     - `[WebSocket] Listening on private channel: App.Models.User.{id}`
     - `[WebSocket] Search completed notification received:`

### 4. **Troubleshooting**

**⚠️ "Connection reset by peer" error in Laravel logs:**
- **SOLUTION**: Backend must use Docker service name, not localhost
- Check `.env`: `REVERB_HOST="reverb"` (NOT "localhost")
- Run: `docker compose exec app php artisan config:clear && docker compose exec app php artisan config:cache`
- Restart: `docker compose restart app reverb`
- See `../WEBSOCKET_FIX.md` for detailed explanation

**WebSocket connection fails:**
- Verify Reverb service is running: `docker compose ps`
- Check port 9000 is not blocked by firewall
- Verify `.env` variables match frontend config
- Check Reverb logs: `docker compose logs -f reverb`

**No notifications received:**
- Ensure queue worker is running
- Check job was dispatched: `docker compose exec app php artisan queue:failed`
- Verify user is authenticated (check localStorage for `auth_token`)
- Check browser console for channel subscription errors
- Check Laravel logs: `tail -f storage/logs/laravel.log`

**Authorization failed:**
- Verify Sanctum token is valid
- Check CORS configuration includes `broadcasting/auth`
- Ensure `Broadcast::routes(['middleware' => ['auth:sanctum']])` is in routes/api.php

---

## Production Deployment Guide

### 1. **Environment Variables**

#### Backend (.env)

```bash
# Application
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com
FRONTEND_URL=https://yourdomain.com

# Broadcasting
BROADCAST_CONNECTION=reverb

# Reverb WebSocket Server
REVERB_APP_ID=your-production-app-id
REVERB_APP_KEY=your-production-app-key
REVERB_APP_SECRET=your-production-app-secret
REVERB_HOST=yourdomain.com
REVERB_PORT=443
REVERB_SCHEME=https  # CRITICAL: Use HTTPS in production

# Reverb Server
REVERB_SERVER_HOST=0.0.0.0
REVERB_ALLOWED_ORIGINS=https://yourdomain.com

# CORS
CORS_ALLOWED_ORIGINS=https://yourdomain.com

# Queue (use Redis in production for better performance)
QUEUE_CONNECTION=redis

# Redis
REDIS_HOST=your-redis-host
REDIS_PASSWORD=your-redis-password
REDIS_PORT=6379
```

#### Frontend (.env.production)

```bash
VITE_API_BASE_URL=https://yourdomain.com/api

# Laravel Reverb WebSocket Configuration
VITE_REVERB_APP_KEY=your-production-app-key
VITE_REVERB_HOST=yourdomain.com
VITE_REVERB_PORT=443
VITE_REVERB_SCHEME=https  # CRITICAL: Use WSS (secure WebSocket)
```

### 2. **Infrastructure Requirements**

#### WebSocket Server
- **SSL/TLS Certificate**: REQUIRED for production (wss://)
- **Reverse Proxy**: Nginx or similar
- **Port**: 443 (standard HTTPS)
- **Process Manager**: Supervisor (keep Reverb running)

#### Queue Worker
- **Process Manager**: Supervisor (keep worker running)
- **Worker Count**: 2-4 workers depending on load
- **Max Tries**: 3
- **Timeout**: 60 seconds

#### Database
- **Queue Table**: Ensure `jobs` table exists
- **Failed Jobs**: Monitor `failed_jobs` table

### 3. **Nginx Configuration**

```nginx
# HTTP to HTTPS redirect
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/key.pem;

    # Laravel application
    location / {
        proxy_pass http://localhost:9090;  # Or your app port
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket (Reverb)
    location /app {
        proxy_pass http://localhost:9000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 86400;
    }
}
```

### 4. **Supervisor Configuration**

#### Queue Worker (/etc/supervisor/conf.d/laravel-queue-worker.conf)

```ini
[program:giftspire-queue-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/giftspire-backend/artisan queue:work redis --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=4
redirect_stderr=true
stdout_logfile=/var/www/giftspire-backend/storage/logs/worker.log
stopwaitsecs=3600
```

#### Reverb Server (/etc/supervisor/conf.d/laravel-reverb.conf)

```ini
[program:giftspire-reverb]
command=php /var/www/giftspire-backend/artisan reverb:start --host=0.0.0.0 --port=9000
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
redirect_stderr=true
stdout_logfile=/var/www/giftspire-backend/storage/logs/reverb.log
```

**Start Supervisor:**
```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start all
```

### 5. **Security Hardening for Production**

#### ✅ **SSL/TLS (CRITICAL)**
- Use Let's Encrypt or commercial SSL certificate
- Force WSS (secure WebSocket) - never use WS in production
- Enable HSTS header in Nginx

#### ✅ **Environment Variables**
- Generate new `REVERB_APP_KEY` and `REVERB_APP_SECRET` for production
- Never commit production credentials to git
- Use environment variable management (e.g., AWS Secrets Manager, .env.production)

#### ✅ **CORS & Origins**
- Set `REVERB_ALLOWED_ORIGINS` to ONLY your production domain
- Set `CORS_ALLOWED_ORIGINS` to ONLY your production domain
- Never use wildcards (*) in production

#### ✅ **Rate Limiting**
- Enable rate limiting on `/api/broadcasting/auth` endpoint
- Limit WebSocket connections per IP
- Set `REVERB_APP_MAX_CONNECTIONS` appropriately

#### ✅ **Monitoring**
- Monitor Reverb server logs
- Monitor queue worker logs
- Set up alerts for failed jobs
- Monitor WebSocket connection count

#### ✅ **Firewall**
- Only expose ports 80 and 443
- Block direct access to port 9000 (WebSocket should go through Nginx reverse proxy)
- Use security groups/firewall rules to restrict access

### 6. **Deployment Checklist**

**Before Deployment:**
- [ ] Update `.env` files with production values
- [ ] Generate new Reverb credentials
- [ ] Configure SSL certificate
- [ ] Set up Nginx reverse proxy
- [ ] Install and configure Supervisor
- [ ] Test queue worker processes jobs
- [ ] Test Reverb server starts correctly

**Deploy Backend:**
```bash
cd giftspire-backend

# Pull latest code
git pull origin main

# Install dependencies
composer install --no-dev --optimize-autoloader

# Run migrations
php artisan migrate --force

# Clear and cache config
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Restart services
sudo supervisorctl restart giftspire-queue-worker:*
sudo supervisorctl restart giftspire-reverb
```

**Deploy Frontend:**
```bash
cd giftspire-frontend

# Pull latest code
git pull origin main

# Install dependencies
npm ci

# Build for production
npm run build

# Deploy dist/ folder to your web server
# (e.g., upload to S3, Netlify, Vercel, or serve via Nginx)
```

**After Deployment:**
- [ ] Verify WebSocket connects over WSS (check browser DevTools)
- [ ] Test full notification flow end-to-end
- [ ] Verify SSL certificate is valid
- [ ] Check Supervisor processes are running
- [ ] Monitor logs for errors
- [ ] Test from multiple browsers/devices

### 7. **Monitoring & Maintenance**

**Daily:**
- Check failed jobs: `php artisan queue:failed`
- Monitor Reverb connection count
- Check error logs

**Weekly:**
- Review WebSocket connection patterns
- Analyze notification delivery times
- Check for memory leaks in queue workers

**Monthly:**
- Update dependencies (security patches)
- Review and clean old notifications from database
- Performance audit

---

## Additional Resources

- [Laravel Reverb Documentation](https://laravel.com/docs/11.x/reverb)
- [Laravel Broadcasting Documentation](https://laravel.com/docs/11.x/broadcasting)
- [Laravel Echo Documentation](https://laravel.com/docs/11.x/broadcasting#client-side-installation)
- [Laravel Sanctum Documentation](https://laravel.com/docs/11.x/sanctum)
