const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, 'data.js');
const imagesDir = path.join(__dirname, 'images');

// 1. data.js 파일 읽기
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

// 2. images 폴더 내의 유효한(크기가 0보다 큰) 이미지 파일 수집
const files = fs.readdirSync(imagesDir);
const validImageMap = {};
files.forEach(file => {
  const filepath = path.join(imagesDir, file);
  const stat = fs.statSync(filepath);
  if (stat.isFile() && stat.size > 0) {
    validImageMap[file] = true;
  }
});

// 3. snackData 돌면서 이미지 덮어쓰기
let updateCount = 0;
snackData.forEach(item => {
  const jpgName = `${item.id}.jpg`;
  const pngName = `${item.id}.png`;

  let newImage = null;
  // 우선순위: 전용 jpg -> 전용 png -> 기존 이미지 유지
  if (validImageMap[jpgName]) {
    newImage = `images/${jpgName}`;
  } else if (validImageMap[pngName]) {
    newImage = `images/${pngName}`;
  }

  if (newImage && item.image !== newImage) {
    console.log(`- [업데이트] ${item.name} (${item.id}): ${item.image} -> ${newImage}`);
    item.image = newImage;
    updateCount++;
  }
});

console.log(`\n총 ${updateCount}개의 과자 이미지 경로가 동기화되었습니다.`);

// 4. data.js 저장
const updatedContent = `const SNACK_DATA = ${JSON.stringify(snackData, null, 2)};\n\nif (typeof module !== 'undefined') {\n  module.exports = SNACK_DATA;\n}\n`;
fs.writeFileSync(dataFilePath, updatedContent, 'utf8');
console.log('data.js 파일 동기화 저장 완료!');
