# Next.js i18n Domain-Based Routing Setup

This guide explains how to set up domain-based internationalization (i18n) routing for local development on macOS.

## Overview

This project uses `next-intl` with domain-based routing, where different domains serve different languages:
- `en.school.local` → English
- `cz.school.local` → Czech

## Prerequisites

- Node.js installed
- macOS (for the setup commands below)
- Terminal access with sudo privileges

## Local Development Setup

### 1. Configure Local Domains

Add custom domain entries to your hosts file:

```bash
sudo nano /etc/hosts
```

Add these lines at the end of the file:

```
127.0.0.1 en.school.local
127.0.0.1 cz.school.local
```

**Save and exit:** Press `Ctrl + X`, then `Y`, then `Enter`

**Flush DNS cache** to make changes take effect immediately:

```bash
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
```

### 2. Set Up Port Forwarding (Optional)

If you want to access the app on port 80 instead of 3000:

```bash
# Forward port 80 to port 3000
echo "rdr pass on lo0 inet proto tcp from any to any port 80 -> 127.0.0.1 port 3000" | sudo pfctl -ef -
```

**Note:** This forwarding is temporary and will be removed after a system restart.

### 3. Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Add your domain configuration:

```env
NEXT_PUBLIC_EN_DOMAIN=en.school.local
NEXT_PUBLIC_CZ_DOMAIN=cz.school.local
```

### 4. Run Development Server

```bash
npm run dev
```

### 5. Access the Application

**With port forwarding (port 80):**
- English: http://en.school.local
- Czech: http://cz.school.local

**Without port forwarding (port 3000):**
- English: http://en.school.local:3000
- Czech: http://cz.school.local:3000

## Troubleshooting

### Issue: Getting 404 errors

**Solution:** Ensure you have the `[locale]` folder in your app directory. All routes must be inside `src/app/[locale]/`.

### Issue: Still showing English on Czech domain

**Solution:** 
1. Clear Next.js cache: `rm -rf .next`
2. Restart the dev server
3. Make sure you're accessing via the correct domain (not `localhost`)

### Issue: Cross-origin warnings

**Solution:** Add this to your `next.config.js`:

```javascript
const nextConfig = {
  allowedDevOrigins: [
    'http://en.school.local',
    'http://cz.school.local',
  ],
};
```

## Production Deployment

In production, point your actual domains to your server:
- `en.yourdomain.com` → Your server IP
- `cz.yourdomain.com` → Your server IP

Update environment variables:
```env
NEXT_PUBLIC_EN_DOMAIN=en.yourdomain.com
NEXT_PUBLIC_CZ_DOMAIN=cz.yourdomain.com
```

No hosts file modifications or port forwarding needed in production.