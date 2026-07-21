const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = 3006;
const PUBLIC_DIR = path.join(__dirname, 'public/launching-soon');

http.createServer((req, res) => {
  const filePath = path.join(PUBLIC_DIR, 'index.html');
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(data);
  });
}).listen(PORT, '127.0.0.1', () => console.log(`🚀 Static server: http://127.0.0.1:${PORT}/launching-soon`));
