import https from 'node:https';

// New target API (production)
const BASE_URL = 'https://afrilingo-server-v1.onrender.com/api/v1';

// New: ping the primary API health endpoint (lightweight)
function pingHealth() {
  const url = `${BASE_URL.replace(/\/$/, '')}/health`;
  const req = https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => (data += chunk));
    res.on('end', () => {
      console.log(`[${new Date().toISOString()}] HEALTH ${url} -> ${res.statusCode}`);
    });
  });
  req.on('error', (err) => console.error(`[${new Date().toISOString()}] HEALTH error:`, err.message));
  req.setTimeout(10000, () => {
    req.destroy(new Error('HEALTH timeout'));
  });
}

// New: ping a public listing endpoint to keep app warm
function pingLanguages() {
  const url = `${BASE_URL.replace(/\/$/, '')}/languages`;
  const req = https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => (data += chunk));
    res.on('end', () => {
      console.log(`[${new Date().toISOString()}] LANGUAGES ${url} -> ${res.statusCode}`);
    });
  });
  req.on('error', (err) => console.error(`[${new Date().toISOString()}] LANGUAGES error:`, err.message));
  req.setTimeout(10000, () => {
    req.destroy(new Error('LANGUAGES timeout'));
  });
}

// Main ping function
function pingServers() {
  // Only ping the new production API
  pingHealth();
  pingLanguages();
}

// Ping immediately, then every 5 minutes (be nice to the server)
pingServers();
setInterval(pingServers, 300000);
