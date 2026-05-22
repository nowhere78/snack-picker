const https = require('https');
const fs = require('fs');
const path = require('path');

// 1. data.js 로드
const dataFilePath = path.join(__dirname, 'data.js');
let rawData = fs.readFileSync(dataFilePath, 'utf8');

let snackData;
try {
  const sandbox = {};
  const fn = new Function('sandbox', rawData + '\nreturn SNACK_DATA;');
  snackData = fn();
} catch (e) {
  const match = rawData.match(/const\s+SNACK_DATA\s*=\s*([\s\S]+?);/);
  if (match) {
    snackData = eval(match[1]);
  }
}

if (!snackData) {
  console.error("데이터 로드 불가.");
  process.exit(1);
}

// 2. http 주소도 https로 바꾸어 안전하게 다운로드받을 수 있는 헬퍼
function download(url, filepath) {
  // http: 프로토콜이 온 경우 https: 로 프로토콜 강제 치환
  if (url.startsWith('http:')) {
    url = url.replace('http:', 'https:');
  }
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    };
    https.get(url, options, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Status Code ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

// 3. Daum 이미지 검색 (정확도를 높인 다양한 검색 키워드)
function fetchDaumImageUrl(snackName, retryCount = 0) {
  return new Promise((resolve) => {
    // 1차 검색어: 과자이름 + " 봉지"
    // 2차 검색어: 과자이름 + " 과자"
    let queryKeyword = snackName + ' 봉지';
    if (retryCount === 1) {
      queryKeyword = snackName + ' 과자';
    } else if (retryCount === 2) {
      queryKeyword = snackName;
    }

    const query = encodeURIComponent(queryKeyword);
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
        // 이미지 주소 정규식
        const regex = /(?:https?:)?\/\/t1\.daumcdn\.net\/(?:news|cafeattach|cfile|images|uf)\/[0-9a-zA-Z_./?-]+/g;
        const matches = html.match(regex);
        if (matches && matches.length > 0) {
          let matchUrl = matches[0];
          if (matchUrl.startsWith('//')) {
            matchUrl = 'https:' + matchUrl;
          }
          resolve(matchUrl);
        } else {
          // 넓은 매칭
          const wideRegex = /(?:https?:)?\/\/t1\.daumcdn\.net\/[^"'\s<>]+/g;
          const wideMatches = html.match(wideRegex);
          const filtered = wideMatches ? wideMatches.filter(u => !u.includes('.js') && !u.includes('.ico') && !u.includes('tiara')) : [];
          if (filtered.length > 0) {
            let matchUrl = filtered[0];
            if (matchUrl.startsWith('//')) {
              matchUrl = 'https:' + matchUrl;
            }
            resolve(matchUrl);
          } else {
            // 결과가 없고 재시도 횟수가 남았다면 검색어를 변경하여 재시도
            if (retryCount < 2) {
              resolve(fetchDaumImageUrl(snackName, retryCount + 1));
            } else {
              resolve(null);
            }
          }
        }
      });
    }).on('error', (err) => {
      resolve(null);
    });
  });
}

// 4. 메인 실행 루프
async function start() {
  const imagesDir = path.join(__dirname, 'images');
  console.log("시작: 미수집된 과자들의 실물 이미지 다운로드를 시작합니다 (2차 보완)...");

  let updatedCount = 0;

  for (let i = 0; i < snackData.length; i++) {
    const item = snackData[i];
    
    // 이미지가 default 이미지이거나 수집되지 않은 경우에만 수집
    const isDefaultImage = item.image.includes('default_') || item.image.includes('placeholder') || item.image === '';
    
    if (isDefaultImage) {
      console.log(`\n[보완 필요] '${item.name}' 실물 이미지 수집 중...`);
      
      let success = false;
      const filename = `${item.id}.jpg`;
      const filepath = path.join(imagesDir, filename);

      // Daum 이미지 검색 호출
      const daumUrl = await fetchDaumImageUrl(item.name);
      if (daumUrl) {
        console.log(`- 찾은 실물 이미지 URL: ${daumUrl}`);
        try {
          await download(daumUrl, filepath);
          console.log(`- 다운로드 완료: ${filename}`);
          item.image = `images/${filename}`;
          success = true;
          updatedCount++;
        } catch (err) {
          console.error(`- 다운로드 실패:`, err.message);
        }
      }

      if (!success) {
        console.log(`- 실물 이미지를 찾지 못했습니다. 기존 이미지 유지.`);
      }

      // 차단 방지를 위한 딜레이 1초
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  console.log(`\n작업 완료! 총 ${updatedCount}개의 이미지가 실물 이미지로 추가 업데이트되었습니다.`);

  // data.js 저장
  if (updatedCount > 0) {
    const updatedContent = `const SNACK_DATA = ${JSON.stringify(snackData, null, 2)};\n\nif (typeof module !== 'undefined') {\n  module.exports = SNACK_DATA;\n}\n`;
    fs.writeFileSync(dataFilePath, updatedContent, 'utf8');
    console.log("data.js 파일 갱신 완료!");
  } else {
    console.log("새로 업데이트된 내용이 없어 data.js는 갱신되지 않았습니다.");
  }
}

start();
