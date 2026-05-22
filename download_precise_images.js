const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, 'images');

const preciseDownloads = [
  {
    id: 'swingchip_chicken',
    url: 'https://cdn.thinkfood.co.kr/news/photo/201604/68552_82450_924.jpg',
    filename: 'swingchip_chicken_new.png'
  }
];

function download(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    const client = url.startsWith('https') ? https : http;
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
      },
      timeout: 15000
    };

    const req = client.get(url, options, (response) => {
      if (response.statusCode !== 200) {
        file.close();
        fs.unlink(filepath, () => {});
        reject(new Error(`Status Code ${response.statusCode} for ${url}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close((err) => {
          if (err) reject(err);
          else {
            const stats = fs.statSync(filepath);
            if (stats.size === 0) {
              fs.unlink(filepath, () => {});
              reject(new Error(`Downloaded file is 0 bytes for ${url}`));
            } else {
              resolve();
            }
          }
        });
      });
    });

    req.on('error', (err) => {
      file.close();
      fs.unlink(filepath, () => {});
      reject(err);
    });

    req.on('timeout', () => {
      req.destroy();
      file.close();
      fs.unlink(filepath, () => {});
      reject(new Error('Request timeout'));
    });
  });
}

async function run() {
  console.log('고화질 패키지 컷 정밀 다운로드 시작...');
  for (const item of preciseDownloads) {
    const filepath = path.join(IMAGES_DIR, item.filename);
    console.log(`- ${item.id} 다운로드 시도: ${item.url}`);
    try {
      await download(item.url, filepath);
      console.log(`  [성공] ${item.filename} (${fs.statSync(filepath).size} bytes)`);
    } catch (e) {
      console.error(`  [실패] ${item.id}:`, e.message);
    }
    await new Promise(r => setTimeout(r, 1000));
  }
  console.log('정밀 다운로드 프로세스 완료!');
}

run();
