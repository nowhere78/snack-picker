const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, 'images');

const preciseDownloads = [
  {
    id: 'jjanggu_choco',
    url: 'http://t1.daumcdn.net/news/201201/10/ilgansports/20120110132204164.jpg',
    filename: 'jjanggu_choco_new.png'
  },
  {
    id: 'indianbab',
    url: 'https://m.nongshimmall.com/web/product/big/202407/a4085415aeb539bf25bf65686fa9344e.jpg',
    filename: 'indianbab_new.png'
  },
  {
    id: 'chocochip_cookie',
    url: 'https://sitem.ssgcdn.com/71/39/38/item/1000282383971_i1_500.jpg',
    filename: 'chocochip_cookie_new.png'
  },
  {
    id: 'gobukchip_vanilla',
    url: 'https://t1.daumcdn.net/news/202201/04/Edaily/20220104085242081awkk.jpg',
    filename: 'gobukchip_vanilla_new.png'
  },
  {
    id: 'yegam_cheese',
    url: 'https://sitem.ssgcdn.com/51/87/42/item/1000560428751_i1_500.jpg',
    filename: 'yegam_cheese_new.png'
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
  console.log('과자 정밀 이미지 다운로드 및 복사 시작...');
  
  // 1. 포테토칩 이미지 복사
  const uploadedPotatoPath = 'C:\\Users\\smile\\.gemini\\antigravity\\brain\\6d0100cc-6ef4-4462-840a-81e15521927e\\media__1779489297916.png';
  const targetPotatoPath = path.join(IMAGES_DIR, 'potetochip_new.png');
  console.log(`- 포테토칩 복사 시도: ${uploadedPotatoPath} -> ${targetPotatoPath}`);
  try {
    fs.copyFileSync(uploadedPotatoPath, targetPotatoPath);
    console.log(`  [성공] 포테토칩 복사 완료 (${fs.statSync(targetPotatoPath).size} bytes)`);
  } catch (e) {
    console.error(`  [실패] 포테토칩 복사 실패:`, e.message);
  }

  // 2. 다른 과자 이미지 다운로드
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
  
  console.log('프로세스 완료!');
}

run();
