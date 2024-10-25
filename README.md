# CapRover IP Address Returner

A simple Node.js application that returns the visitor's IP address. This app is designed to work with CapRover and handles various deployment scenarios including CloudFlare integration.

## Features

- Returns visitor's IP address
- Supports both IPv4 and IPv6
- Handles various proxy scenarios:
  - Direct connections
  - Behind CapRover proxy
  - Behind CloudFlare
  - Behind Nginx
  - Behind Azure
  - Multiple proxy layers
- Intelligent IP detection using headers:
  - CF-Connecting-IP (CloudFlare)
  - X-Forwarded-For (Standard proxy)
  - X-Real-IP (Nginx)
  - X-Client-IP (Azure)
  - Direct socket connection

## Installation

```bash
# Clone the repository
git clone https://github.com/EnkodoNL/caprover-return-ip.git

# Install dependencies
npm install

# Start the server
npm start
```

## Deployment to CapRover

1. Create a new app in your CapRover dashboard

2. Deploy using one of these methods:

   ### Method 1: CLI Deployment

   Make sure you have the CapRover CLI installed:

   ```bash
   npm install -g caprover
   ```

   ```bash
   caprover deploy
   ```

   ### Method 2: Manual Deployment

   - Download the caprover-deploy.tar tarball from the Releases page
   - Upload the tarball in the CapRover dashboard under "Method 2: Tarball"

   ### Method 3: GitHub Integration

   - Push your code to GitHub
   - Set up automatic deployment in CapRover dashboard using your repository URL

## How It Works

The application uses a hierarchical approach to determine the correct IP address:

1. First checks for CloudFlare's `CF-Connecting-IP` header
2. Falls back to `X-Forwarded-For` header
3. Then checks `X-Real-IP` (Nginx)
4. Then checks `X-Client-IP` (Azure)
5. Finally uses the socket's remote address if no proxy headers are present

The app includes special handling for:

- IPv6 addresses with port information
- Multiple IP addresses in forwarded headers (takes the first one)
- Different IP address formats
- Port information removal

## Environment Variables

- `PORT`: Server port (default: 3000)
- `FORMAT`: Response format
  - If not set: returns plain IP address
  - If set to "json": returns JSON with IP and version
- `EMPTY_RESPONSE`: Custom response when IP cannot be determined (default: "x.x.x.x")

## Example Response

### Default Format

```
192.168.1.1
```

or

```
2001:db8::1
```

### JSON Format (FORMAT=json)

```json
{
  "ip": "192.168.1.1",
  "version": "ipv4"
}
```

or

```json
{
  "ip": "2001:db8::1",
  "version": "ipv6"
}
```

## Technical Details

- Built with Node.js and Express
- Minimal dependencies for better security and performance
- Uses CapRover's Node.js 20 template
- Includes IP cleaning functionality:
  - Removes port information
  - Handles IPv6 addresses in brackets
  - Extracts first IP from forwarded headers
  - Automatic IP version detection (ipv4/ipv6)

## License

MIT
