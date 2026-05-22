const https = require('https');
const fs = require('fs');
const path = require('path');

// 1. data.js 파일의 원본 데이터를 안전하게 읽고, require 가능하도록 임시 구성
const dataFilePath = path.join(__dirname, 'data.js');
let rawData = fs.readFileSync(dataFilePath, 'utf8');

// 브라우저용 스크립트 파일을 Node.js에서 읽기 위한 파싱
let snackData;
try {
  const sandbox = {};
  const fn = new Function('sandbox', rawData + '\nreturn SNACK_DATA;');
  snackData = fn();
} catch (e) {
  console.error("data.js 로드 실패, 수동 정규식 파싱 시도", e);
  const match = rawData.match(/const\s+SNACK_DATA\s*=\s*([\s\S]+?);/);
  if (match) {
    snackData = eval(match[1]);
  }
}

if (!snackData) {
  console.error("데이터 로드 불가. 작업을 중단합니다.");
  process.exit(1);
}

console.log(`로드된 과자 데이터 개수: ${snackData.length}개`);

// 2. 현실적인 대중 선호도 & 매출 순위 맵 구성 (FIS 2025 상반기 소매점 매출 기준 반영)
const realisticOrder = [
  "saewookkang",        // 1. 새우깡
  "pocachip",           // 2. 포카칩 오리지널
  "chocopie",           // 3. 초코파이 정
  "pepero",             // 4. 아몬드 빼빼로
  "pringles",           // 5. 프링글스 오리지널
  "gogalcorn",          // 6. 꼬깔콘 고소한맛
  "homerunball",        // 7. 홈런볼 초코
  "squidpeanut",        // 8. 오징어땅콩
  "gobukchip",          // 9. 꼬북칩 초코츄러스
  "diget",              // 10. 다이제 초코
  "binch",              // 11. 빈츠
  "honeybutter",        // 12. 허니버터칩
  "moncher",            // 13. 몽쉘 크림
  "ohyes",              // 14. 오예스
  "ace",                // 15. 에이스
  "matdongsan",         // 16. 맛동산 조청
  "bananakick",         // 17. 바나나킥
  "chocochip",          // 18. 촉촉한 초코칩
  "chicchoc",           // 19. 칙촉
  "honeytwist",         // 20. 꿀꽈배기
  "goraebab",           // 21. 고래밥 볶음양념맛
  "jjanggu",            // 22. 짱구 꿀시나몬
  "cornchip",           // 23. 콘칩 군옥수수맛
  "pepero_crunky",      // 24. 크런키 빼빼로
  "pepero_white",       // 25. 화이트쿠키 빼빼로
  "pepero_nude",        // 26. 누드 빼빼로
  "pepero_original",    // 27. 오리지널 빼빼로
  "pocachip_onion",     // 28. 포카칩 어니언맛
  "pringles_onion",     // 29. 프링글스 사워크림 어니언
  "swingchip",          // 30. 스윙칩 볶음고추장
  "cheetos",            // 31. 치토스 매콤한맛
  "nunegamja",          // 32. 눈을감자
  "sunchip",            // 33. 태양의 맛 썬
  "haribo",             // 34. 하리보 골드베렌
  "butterwaffle",       // 35. 버터와플
  "margaret",           // 36. 마가렛트
  "chocosongi",         // 37. 초코송이
  "shrimpchip",         // 38. 알새우칩
  "conchi",             // 39. 콘치 크림치즈
  "mygumi_peach",       // 40. 마이구미 복숭아
  "yegam_plain",        // 41. 예감 오리지널
  "custard",            // 42. 카스타드
  "couque",             // 43. 쿠쿠다스 화이트
  "chamcracker",        // 44. 참크래커
  "sweetpotatokkang",   // 45. 고구마깡
  "osatsu",             // 46. 오사쯔 고구마
  "kancho",             // 47. 칸쵸 초코
  "ivy",                // 48. 아이비
  "vegtime",            // 49. 야채타임
  "potatokkang",        // 50. 감자깡
  "crabchip",           // 51. 꽃게랑
  "jagalchi",           // 52. 자갈치 문어
  "onionkkang",         // 53. 양파깡
  "swingchip_chicken",  // 54. 스윙칩 간장치킨
  "beehivepizza",       // 55. 벌집피자
  "gogalcorn_corn",     // 56. 꼬깔콘 군옥수수
  "sunchip_garlic",     // 57. 썬칩 갈릭바게트
  "nacho",              // 58. 도도한 나쵸 치즈
  "concho",             // 59. 콘초 헤이즐넛초코
  "maplecorn",          // 60. 카라멜 메이플콘
  "chocheong",          // 61. 조청유과 쌀
  "indianbab",          // 62. 인디안밥 콘
  "jjanggu_choco",      // 63. 초코 신짱
  "oguma",              // 64. 오구마 고구마
  "potetochip",         // 65. 포테토칩
  "bakedpotato",        // 66. 구운감자 석쇠
  "chocochip_cookie",   // 67. 초코칩 쿠키 바삭
  "bbasae",             // 68. 빠새 쉬림프
  "gobukchip_vanilla",  // 69. 꼬북칩 바닐라
  "diget_thin",         // 70. 다이제 씬 통밀
  "margaret_choco",     // 71. 마가렛트 구운모카
  "binch_rye",          // 72. 빈츠 카페모카
  "yegam_cheese",       // 73. 예감 치즈그라탕맛
  "haribo_cola"         // 74. 하리보 해피콜라
];

// defaultVotes 재계산 및 정렬 적용 (1위 1500부터 차감)
snackData.forEach(item => {
  const rankIndex = realisticOrder.indexOf(item.id);
  if (rankIndex !== -1) {
    item.defaultVotes = 1500 - (rankIndex * 15);
  } else {
    item.defaultVotes = 200;
  }
});

// 순위에 맞게 정렬
snackData.sort((a, b) => b.defaultVotes - a.defaultVotes);

// 3. 이미지 다운로드 헬퍼
function download(url, filepath) {
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

// 4. SSG.com에서 실물 제품 이미지 주소 검색 후 추출
function fetchProductImageUrl(snackName) {
  return new Promise((resolve) => {
    const query = encodeURIComponent(snackName);
    const url = `https://www.ssg.com/search.ssg?target=all&query=${query}`;
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.8,en-US;q=0.5,en;q=0.3'
      }
    };

    https.get(url, options, (res) => {
      if (res.statusCode !== 200) {
        console.warn(`- [SSG.com] 상태코드 경고: ${res.statusCode} (${snackName})`);
        resolve(null);
        return;
      }

      let html = '';
      res.on('data', (chunk) => { html += chunk; });
      res.on('end', () => {
        const regex = /(?:https?:)?\/\/sitem\.ssgcdn\.com\/[^"'\s<>]*\/item\/[^"'\s<>]*_[0-9]+\.jpg/g;
        const matches = html.match(regex);
        if (matches && matches.length > 0) {
          let matchUrl = matches[0];
          if (!matchUrl.startsWith('http')) {
            matchUrl = 'https:' + matchUrl;
          }
          const hdUrl = matchUrl.replace(/_[0-9]+\.jpg$/, '_500.jpg');
          resolve({ defaultUrl: matchUrl, hdUrl: hdUrl });
        } else {
          resolve(null);
        }
      });
    }).on('error', (err) => {
      resolve(null);
    });
  });
}

// 5. Daum 이미지 검색을 통한 실물 이미지 주소 추출 (SSG.com 차단/검색 실패 대비 폴백)
function fetchDaumImageUrl(snackName) {
  return new Promise((resolve) => {
    const query = encodeURIComponent(snackName + ' 봉지');
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
        // Daum CDN 이미지 패턴 추출 (광고 및 favicon 배제용 필터링)
        const regex = /(?:https?:)?\/\/t1\.daumcdn\.net\/(?:news|cafeattach|cfile|images|uf)\/[0-9a-zA-Z_./?-]+/g;
        const matches = html.match(regex);
        if (matches && matches.length > 0) {
          let matchUrl = matches[0];
          if (matchUrl.startsWith('//')) {
            matchUrl = 'https:' + matchUrl;
          }
          resolve(matchUrl);
        } else {
          // 광범위한 daumcdn 패턴 fallback
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
            resolve(null);
          }
        }
      });
    }).on('error', (err) => {
      resolve(null);
    });
  });
}

// 6. 메인 실행 루프
async function start() {
  const imagesDir = path.join(__dirname, 'images');
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir);
  }

  console.log("시작: 과자 이미지 현실 고증 다운로드 및 data.js 순위 최적화 작업을 진행합니다...");

  for (let i = 0; i < snackData.length; i++) {
    const item = snackData[i];
    const rank = i + 1;
    console.log(`\n[${rank}/${snackData.length}] '${item.name}' 처리 중...`);

    let imageDownloaded = false;
    const filename = `${item.id}.jpg`;
    const filepath = path.join(imagesDir, filename);

    // 1단계: SSG.com 이미지 검색 시도
    const ssgUrls = await fetchProductImageUrl(item.name);
    if (ssgUrls) {
      console.log(`- [SSG.com] 검색 성공. 이미지 다운로드 중...`);
      try {
        await download(ssgUrls.hdUrl, filepath);
        console.log(`- 고화질 다운로드 완료: ${filename}`);
        item.image = `images/${filename}`;
        imageDownloaded = true;
      } catch (err) {
        console.log(`- 고화질 다운로드 실패(${err.message}). 기본 화질 시도...`);
        try {
          await download(ssgUrls.defaultUrl, filepath);
          console.log(`- 기본 화질 다운로드 완료: ${filename}`);
          item.image = `images/${filename}`;
          imageDownloaded = true;
        } catch (err2) {
          console.error(`- 기본 화질 다운로드 실패:`, err2.message);
        }
      }
    }

    // 2단계: SSG.com 실패 시 Daum 이미지 검색 폴백
    if (!imageDownloaded) {
      console.log(`- [폴백] SSG.com에서 이미지를 찾지 못했거나 차단되었습니다. Daum 이미지 검색을 사용합니다...`);
      const daumUrl = await fetchDaumImageUrl(item.name);
      if (daumUrl) {
        console.log(`- [Daum] 검색 성공. 이미지 다운로드 중: ${daumUrl}`);
        try {
          await download(daumUrl, filepath);
          console.log(`- Daum 이미지 다운로드 완료: ${filename}`);
          item.image = `images/${filename}`;
          imageDownloaded = true;
        } catch (err) {
          console.error(`- Daum 이미지 다운로드 실패:`, err.message);
        }
      }
    }

    if (!imageDownloaded) {
      console.log(`- 실물 이미지를 가져오는 데 완전히 실패했습니다. 기존 이미지 경로를 유지합니다: ${item.image}`);
    }

    // 서버 보호 및 차단 방지를 위해 1.2초 딜레이
    await new Promise(r => setTimeout(r, 1200));
  }

  // 7. data.js 갱신 저장
  console.log("\n모든 이미지 처리 완료! data.js 파일을 갱신합니다.");
  const updatedContent = `const SNACK_DATA = ${JSON.stringify(snackData, null, 2)};\n\nif (typeof module !== 'undefined') {\n  module.exports = SNACK_DATA;\n}\n`;
  fs.writeFileSync(dataFilePath, updatedContent, 'utf8');
  console.log("data.js 파일 갱신 완료!");
  console.log("작업이 완료되었습니다. 웹 서버를 실행하여 결과를 확인해보세요.");
}

start();
