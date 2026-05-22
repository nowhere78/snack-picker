const https = require('https');
const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, 'images');

// 1. 새우깡 png -> jpg 복사
try {
  const pngPath = path.join(IMAGES_DIR, 'saewookkang.png');
  const jpgPath = path.join(IMAGES_DIR, 'saewookkang.jpg');
  if (fs.existsSync(pngPath)) {
    fs.copyFileSync(pngPath, jpgPath);
    console.log('새우깡 png 이미지를 jpg로 복사했습니다.');
  } else {
    console.log('새우깡 png 이미지가 존재하지 않습니다.');
  }
} catch (e) {
  console.error('새우깡 복사 실패:', e);
}

// 2. 다운로드 대상 설정 (검색 키워드와 매핑)
const targets = [
  { id: 'squidpeanut', keyword: '오리온 오징어땅콩 봉지', filename: 'squidpeanut.jpg' },
  { id: 'ace', keyword: '해태 에이스 과자 봉지', filename: 'ace.jpg' },
  { id: 'haribo', keyword: '하리보 골드베렌 100g 봉지', filename: 'haribo.jpg' },
  { id: 'mygumi_peach', keyword: '오리온 마이구미 복숭아 봉지', filename: 'mygumi_peach.jpg' },
  { id: 'butterwaffle', keyword: '크라운 버터와플 과자', filename: 'butterwaffle.jpg' },
  { id: 'cheetos', keyword: '치토스 매콤한맛 봉지', filename: 'cheetos.jpg' },
  { id: 'gogalcorn', keyword: '롯데 꼬깔콘 고소한맛 봉지', filename: 'gogalcorn.jpg' },
  { id: 'honeybutter', keyword: '해태 허니버터칩 봉지', filename: 'honeybutter.jpg' },
  { id: 'maplecorn', keyword: '크라운 메이플콘 봉지', filename: 'maplecorn.jpg' },
  { id: 'ivy', keyword: '해태 아이비 과자 박스', filename: 'ivy.jpg' },
  { id: 'jagalchi', keyword: '농심 자갈치 봉지', filename: 'jagalchi.jpg' },
  { id: 'vegtime', keyword: '빙그레 야채타임 봉지', filename: 'vegtime.jpg' }
];

// http 주소를 https로 바꾸어 안전하게 다운로드받을 수 있는 헬퍼
function download(url, filepath) {
  if (url.startsWith('http:')) {
    url = url.replace('http:', 'https:');
  }
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
      },
      timeout: 10000
    };

    const req = https.get(url, options, (response) => {
      if (response.statusCode !== 200) {
        file.close();
        fs.unlink(filepath, () => {});
        reject(new Error(`Status Code ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close((err) => {
          if (err) reject(err);
          else {
            // 다운로드 후 파일 크기 확인
            const stats = fs.statSync(filepath);
            if (stats.size === 0) {
              fs.unlink(filepath, () => {});
              reject(new Error('Downloaded file is 0 bytes'));
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

// Daum 이미지 검색을 통해 과자 패키지 샷 URL 가져오기
function fetchDaumImageUrl(keyword, index = 0) {
  return new Promise((resolve) => {
    const query = encodeURIComponent(keyword);
    const url = `https://search.daum.net/search?w=img&q=${query}`;
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.8,en-US;q=0.5,en;q=0.3'
      }
    };

    https.get(url, options, (res) => {
      if (res.statusCode !== 200) {
        resolve(null);
        return;
      }

      let html = '';
      res.on('data', (chunk) => { html += chunk; });
      res.on('end', () => {
        // Daum CDN 이미지 패턴 추출
        const regex = /(?:https?:)?\/\/t1\.daumcdn\.net\/(?:news|cafeattach|cfile|images|uf)\/[0-9a-zA-Z_./?-]+/g;
        const matches = html.match(regex);
        if (matches && matches.length > index) {
          // index 번째 이미지를 반환하여 첫 번째 이미지가 이상할 경우 대비
          let matchUrl = matches[index];
          if (matchUrl.startsWith('//')) {
            matchUrl = 'https:' + matchUrl;
          }
          resolve(matchUrl);
        } else {
          // 넓은 매칭
          const wideRegex = /(?:https?:)?\/\/t1\.daumcdn\.net\/[^"'\s<>]+/g;
          const wideMatches = html.match(wideRegex);
          const filtered = wideMatches ? wideMatches.filter(u => !u.includes('.js') && !u.includes('.ico') && !u.includes('tiara')) : [];
          if (filtered.length > index) {
            let matchUrl = filtered[index];
            if (matchUrl.startsWith('//')) {
              matchUrl = 'https:' + matchUrl;
            }
            resolve(matchUrl);
          } else {
            resolve(null);
          }
        }
      });
    }).on('error', (err) => {
      resolve(null);
    });
  });
}

// 메인 실행 루프
async function start() {
  console.log('과자 고증 이미지 수정 작업을 시작합니다...');

  for (const target of targets) {
    console.log(`\n[대상] ${target.id} (${target.keyword}) 처리 중...`);
    const filepath = path.join(IMAGES_DIR, target.filename);
    
    let downloadedSuccessfully = false;
    // 첫 번째, 두 번째, 세 번째 검색 결과까지 시도해본다. (엉뚱한 사진 피하기 위해)
    for (let tryIdx = 0; tryIdx < 3; tryIdx++) {
      console.log(`  - Daum 이미지 검색 시도 (인덱스: ${tryIdx})...`);
      const imgUrl = await fetchDaumImageUrl(target.keyword, tryIdx);
      if (imgUrl) {
        console.log(`  - 찾은 이미지 URL: ${imgUrl}`);
        try {
          await download(imgUrl, filepath);
          console.log(`  - 다운로드 성공! (${target.filename})`);
          downloadedSuccessfully = true;
          break;
        } catch (err) {
          console.error(`  - 다운로드 실패 (인덱스 ${tryIdx}):`, err.message);
        }
      } else {
        console.log(`  - 이미지를 찾지 못했습니다 (인덱스 ${tryIdx}).`);
      }
      // 차단 방지를 위한 약간의 딜레이
      await new Promise(r => setTimeout(r, 1000));
    }

    if (!downloadedSuccessfully) {
      console.log(`  [경고] ${target.id} 이미지 수집 실패!`);
    }

    // 다음 항목 처리 전 딜레이
    await new Promise(r => setTimeout(r, 1500));
  }

  console.log('\n모든 수정 대상 이미지 다운로드 프로세스가 종료되었습니다.');
}

start();
