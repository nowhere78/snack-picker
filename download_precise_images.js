const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, 'images');

const preciseDownloads = [
  {
    id: 'haribo',
    url: 'http://shop.daumcdn.net/shophow/p/N35401927012.jpg?ut=20251226113010',
    filename: 'haribo.jpg'
  },
  {
    id: 'ace',
    url: 'https://shop-phinf.pstatic.net/20260415_191/1776239763697s0XLP_JPEG/110372697847492552_1358914840.jpg?type=o1000',
    filename: 'ace.jpg'
  },
  {
    id: 'squidpeanut',
    url: 'https://thumbnail9.coupangcdn.com/thumbnails/remote/492x492ex/image/1025_amir_coupang_oct_80k/d88e/17c7292f48dedf50f4ccc380bf528c858c558e6fad6a78a5c682bee5debb.jpg',
    filename: 'squidpeanut.jpg'
  },
  {
    id: 'mygumi_peach',
    url: 'https://postfiles.pstatic.net/MjAxNzExMjVfMjY2/MDAxNTExNTk2MDY0OTU4.I0YxmYyN8NXok4Bf_e4WCUaijrpfPXydZd3qZYJFphEg.f7Y2uyfWPYUSiFWNP95wzSf-hX4feF8zGGomqAhhAZkg.JPEG.bqudcks/%EB%A7%88%EC%9D%B4%EA%B5%AC%EB%AF%B8%EB%B3%B5%EC%88%AD%EC%95%84_PB250739.JPG?type=w966',
    filename: 'mygumi_peach.jpg'
  },
  {
    id: 'vegtime',
    url: 'http://shop.daumcdn.net/shophow/p/E5270592985.jpg?ut=20260402180326',
    filename: 'vegtime.jpg'
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
