const express = require("express");
const app = express();

function cleanIpAddress(ip) {
  // If we have multiple IPs (from X-Forwarded-For), take the first one
  ip = ip.split(",")[0].trim();

  // Remove port information if present (e.g., [IPv6]:port or IPv4:port)
  if (ip.includes("[") && ip.includes("]")) {
    ip = ip.substring(ip.indexOf("[") + 1, ip.indexOf("]"));
  } else if (ip.includes(":")) {
    // Check if this is an IPv6 address or IPv4 with port
    const parts = ip.split(":");
    if (parts.length > 2) {
      // This is an IPv6 address
      ip = ip;
    } else {
      // This is IPv4 with port, keep only the IP
      ip = parts[0];
    }
  }

  return ip;
}

function getIpVersion(ip) {
  return ip.includes(":") ? "ipv6" : "ipv4";
}

app.get("/", (req, res) => {
  // Check headers in order of reliability
  let ip =
    req.headers["cf-connecting-ip"] || // CloudFlare
    req.headers["x-forwarded-for"] || // Standard proxy
    req.headers["x-real-ip"] || // Nginx proxy
    req.headers["x-client-ip"] || // Azure
    req.socket.remoteAddress; // Direct connection

  if (!ip) {
    return res.send(
      typeof process?.env?.EMPTY_RESPONSE !== "undefined"
        ? process.env.EMPTY_RESPONSE
        : "x.x.x.x"
    );
  }

  ip = cleanIpAddress(ip);
  const version = getIpVersion(ip);

  if (process.env.FORMAT === "json") {
    return res.json({ ip, version });
  } else {
    return res.send(`${ip}`);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
