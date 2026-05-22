const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8082;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.json': 'application/json'
};

const server = http.createServer((req, res) => {
  // Decode URI component to handle Korean file names if any
  let decodedUrl = decodeURIComponent(req.url);
  let filePath = path.join(__dirname, decodedUrl === '/' ? 'index.html' : decodedUrl);
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code == 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>404 파일을 찾을 수 없습니다</h1>', 'utf-8');
      } else {
        res.writeHead(500);
        res.end(`서버 오류가 발생했습니다: ${error.code}\n`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
