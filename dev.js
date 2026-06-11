import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const DIST_DIR = path.join(__dirname, 'dist');
const SRC_DIR = path.join(__dirname, 'src');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml',
  '.ico': 'image/x-icon'
};

// Custom static file server
const server = http.createServer((req, res) => {
  console.log(`[HTTP] ${req.method} ${req.url}`);

  let urlPath = req.url.split('?')[0]; // Strip query parameters
  
  // Clean routing: map "/financial/mortgage-calculator" or "/financial" to their index.html files
  let filePath = path.join(DIST_DIR, urlPath);
  
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  // Handle sitemap.xml directly at root or other fallbacks
  if (!fs.existsSync(filePath) && !path.extname(filePath)) {
    filePath += '.html';
  }

  if (fs.existsSync(filePath)) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  } else {
    // 404 Fallback
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 Not Found</h1><p>The requested URL was not found on this server.</p>');
  }
});

// Run the build script
function runBuild(callback) {
  console.log('[Watcher] Rebuilding...');
  exec('node build.js', (err, stdout, stderr) => {
    if (err) {
      console.error(`[Build Error] ${stderr}`);
    } else {
      console.log(stdout.trim() || '[Build] Site compiled successfully.');
    }
    if (callback) callback();
  });
}

// Initial Build
runBuild(() => {
  server.listen(PORT, () => {
    console.log(`[Server] Running locally at http://localhost:${PORT}`);
    console.log(`[Watcher] Monitoring '${SRC_DIR}' directory for modifications...`);
  });
});

// Setup File Watcher
let watchDebounceTimeout;
fs.watch(SRC_DIR, { recursive: true }, (eventType, filename) => {
  if (filename) {
    // Debounce watcher so rapid multiple writes only trigger one build
    clearTimeout(watchDebounceTimeout);
    watchDebounceTimeout = setTimeout(() => {
      console.log(`[Watcher] Change detected in ${filename}`);
      runBuild();
    }, 200);
  }
});
