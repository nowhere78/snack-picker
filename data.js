const SNACK_DATA = [
  {
    "id": "saewookkang",
    "name": "새우깡",
    "category": "snack",
    "image": "images/saewookkang.jpg",
    "link": "https://link.coupang.com/a/example1",
    "desc": "손이 가요 손이 가~ 고소하고 짭조름한 한국인의 소울 원조 스낵!",
    "defaultVotes": 1500
  },
  {
    "id": "pocachip",
    "name": "포카칩 오리지널",
    "category": "potato",
    "image": "images/pocachip.jpg",
    "link": "https://link.coupang.com/a/example2",
    "desc": "100% 생감자로 만든 바삭함의 끝판왕 생감자칩 1위 브랜드!",
    "defaultVotes": 1485
  },
  {
    "id": "chocopie",
    "name": "초코파이 정(情)",
    "category": "choco",
    "image": "images/chocopie.jpg",
    "link": "https://link.coupang.com/a/example12",
    "desc": "말하지 않아도 알아요~ 한국 역사와 정을 대변하는 부드러운 마시멜로 파이!",
    "defaultVotes": 1470
  },
  {
    "id": "pepero",
    "name": "아몬드 빼빼로",
    "category": "choco",
    "image": "images/pepero.jpg",
    "link": "https://link.coupang.com/a/example7",
    "desc": "고소한 아몬드 토핑과 초콜릿의 조화! 빼빼로 시리즈 중 부동의 1위 인기작.",
    "defaultVotes": 1455
  },
  {
    "id": "pringles",
    "name": "프링글스 오리지널",
    "category": "potato",
    "image": "images/pringles.jpg",
    "link": "https://link.coupang.com/a/example5",
    "desc": "한 번 열면 멈출 수 없는 짭조름하고 바삭한 세계적인 원통형 감자칩!",
    "defaultVotes": 1440
  },
  {
    "id": "gogalcorn",
    "name": "꼬깔콘 고소한맛",
    "category": "snack",
    "image": "images/gogalcorn.jpg",
    "link": "https://link.coupang.com/a/example18",
    "desc": "손가락에 끼워 먹어야 제맛! 옥수수의 고소함이 고소하고 바삭하게 씹힙니다.",
    "defaultVotes": 1425
  },
  {
    "id": "homerunball",
    "name": "홈런볼 초코",
    "category": "choco",
    "image": "images/homerunball.jpg",
    "link": "https://link.coupang.com/a/example6",
    "desc": "입안에서 사르르 녹는 부드러운 슈 속에 달콤한 초콜릿 가득! 대한민국 과자 판매량 부동의 1위 그룹.",
    "defaultVotes": 1410
  },
  {
    "id": "squidpeanut",
    "name": "오징어땅콩",
    "category": "snack",
    "image": "images/squidpeanut.png",
    "link": "https://link.coupang.com/a/example17",
    "desc": "바삭한 오징어 맛 볼 속에 고소한 진짜 땅콩! 맥주 안주로 손꼽히는 정통 스낵.",
    "defaultVotes": 1395
  },
  {
    "id": "gobukchip",
    "name": "꼬북칩 초코츄러스",
    "category": "snack",
    "image": "images/gobukchip.png",
    "link": "https://link.coupang.com/a/example3",
    "desc": "네 겹의 극강 바삭함 속에 진한 초코츄러스 시나몬 맛이 듬뿍!",
    "defaultVotes": 1380
  },
  {
    "id": "diget",
    "name": "다이제 초코",
    "category": "biscuit",
    "image": "images/diget.jpg",
    "link": "https://link.coupang.com/a/example14",
    "desc": "통밀 비스킷의 든든한 고소함 위에 듬뿍 얹어진 진한 초콜릿 코팅!",
    "defaultVotes": 1365
  },
  {
    "id": "binch",
    "name": "빈츠",
    "category": "choco",
    "image": "images/binch.png",
    "link": "https://link.coupang.com/a/example8",
    "desc": "한쪽은 바삭한 유럽풍 비스킷, 한쪽은 부드러운 초콜릿의 황홀한 콤비네이션!",
    "defaultVotes": 1350
  },
  {
    "id": "honeybutter",
    "name": "허니버터칩",
    "category": "potato",
    "image": "images/honeybutter.png",
    "link": "https://link.coupang.com/a/example4",
    "desc": "달콤한 아카시아 꿀과 고소한 고메 버터의 조화로 품절 대란을 일으켰던 감자칩!",
    "defaultVotes": 1335
  },
  {
    "id": "moncher",
    "name": "몽쉘 크림",
    "category": "choco",
    "image": "images/moncher.jpg",
    "link": "https://link.coupang.com/a/example11",
    "desc": "입안 가득 사르르 녹아내리는 생크림과 부드러운 카카오 시트의 촉촉한 만남!",
    "defaultVotes": 1320
  },
  {
    "id": "ohyes",
    "name": "오예스",
    "category": "choco",
    "image": "images/ohyes.png",
    "link": "https://link.coupang.com/a/example10",
    "desc": "촉촉한 시트와 진한 초코 크림, 먹는 샘물 수분감을 머금은 정통 사각 케이크 스낵!",
    "defaultVotes": 1305
  },
  {
    "id": "ace",
    "name": "에이스",
    "category": "biscuit",
    "image": "images/ace.jpg",
    "link": "https://link.coupang.com/a/example13",
    "desc": "믹스커피에 콕 찍어 먹으면 사르르 녹는 담백 고소함의 마성 비스킷!",
    "defaultVotes": 1290
  },
  {
    "id": "matdongsan",
    "name": "맛동산",
    "category": "snack",
    "image": "images/matdongsan.png",
    "link": "https://link.coupang.com/a/example20",
    "desc": "발효 반죽을 튀겨 락카사 꿀 조청 시럽과 아몬드 땅콩가루를 뿌린 고소함 최고봉!",
    "defaultVotes": 1275
  },
  {
    "id": "bananakick",
    "name": "바나나킥",
    "category": "snack",
    "image": "images/bananakick.jpg",
    "link": "https://link.coupang.com/a/example22",
    "desc": "입에 넣는 순간 사르르 녹아 없어지는 부드러운 달콤 바나나 향 스낵!",
    "defaultVotes": 1260
  },
  {
    "id": "chocochip",
    "name": "촉촉한 초코칩",
    "category": "biscuit",
    "image": "images/chocochip.jpg",
    "link": "https://link.coupang.com/a/example24",
    "desc": "부드럽고 쫀득한 초코 쿠키 도우 속에 촉촉하게 살아있는 초콜릿 칩!",
    "defaultVotes": 1245
  },
  {
    "id": "chicchoc",
    "name": "칙촉",
    "category": "biscuit",
    "image": "images/chicchoc.png",
    "link": "https://link.coupang.com/a/example25",
    "desc": "초콜릿 덩어리가 아낌없이 박혀 있어 바삭하게 부서지는 오리지널 쿠키!",
    "defaultVotes": 1230
  },
  {
    "id": "honeytwist",
    "name": "꿀꽈배기",
    "category": "snack",
    "image": "images/honeytwist.png",
    "link": "https://link.coupang.com/a/example21",
    "desc": "향긋하고 달콤한 진짜 아카시아 꿀이 꼬아놓은 스낵 사이사이 가득!",
    "defaultVotes": 1215
  },
  {
    "id": "goraebab",
    "name": "고래밥 볶음양념맛",
    "category": "snack",
    "image": "images/goraebab.jpg",
    "link": "https://link.coupang.com/a/example30",
    "desc": "재미있는 아기자기한 바다 생물 과자 모양에 짭짤한 특제 볶음양념 시즈닝!",
    "defaultVotes": 1200
  },
  {
    "id": "jjanggu",
    "name": "왕짱구",
    "category": "snack",
    "image": "images/jjanggu.png",
    "link": "https://link.coupang.com/a/example31",
    "desc": "최초의 짱구! 바삭한 과자 겉면에 아카시아 꿀과 참깨가 솔솔 뿌려진 오리지널 추억의 스낵!",
    "defaultVotes": 1185
  },
  {
    "id": "cornchip",
    "name": "크라운 콘칩",
    "category": "snack",
    "image": "images/cornchip.png",
    "link": "https://link.coupang.com/a/example27",
    "desc": "고소한 옥수수 가루로 얇게 튀겨내어 짭조름한 군옥수수 양념을 더한 스테디셀러!",
    "defaultVotes": 1170
  },
  {
    "id": "pepero_crunky",
    "name": "빼빼로 크런키",
    "category": "choco",
    "image": "images/pepero_crunky.jpg",
    "link": "https://link.coupang.com/a/example62",
    "desc": "빼빼로 위에 바삭한 크런키 초코칩 볼들이 한가득 붙어 식감을 높인 베스트셀러!",
    "defaultVotes": 1155
  },
  {
    "id": "pepero_white",
    "name": "빼빼로 화이트쿠키",
    "category": "choco",
    "image": "images/pepero_white.jpg",
    "link": "https://link.coupang.com/a/example63",
    "desc": "달콤한 화이트 초콜릿에 블랙 쿠키 크런치가 빽빽이 코팅된 달달함 최강자!",
    "defaultVotes": 1140
  },
  {
    "id": "pepero_chocofilled",
    "name": "빼빼로 초코필드",
    "category": "choco",
    "image": "images/pepero_chocofilled.png",
    "link": "https://link.coupang.com/a/example61",
    "desc": "바삭한 비스킷 속에 달콤한 초콜릿이 마지막까지 듬뿍 채워진 초코필드 빼빼로!",
    "defaultVotes": 1125
  },
  {
    "id": "pepero_original",
    "name": "오리지널 빼빼로",
    "category": "choco",
    "image": "images/pepero_original.jpg",
    "link": "https://link.coupang.com/a/example60",
    "desc": "가늘고 길쭉한 비스킷에 진한 정통 초콜릿 코팅을 입힌 오리지널 막대과자!",
    "defaultVotes": 1110
  },
  {
    "id": "pocachip_onion",
    "name": "포카칩 어니언맛",
    "category": "potato",
    "image": "images/pocachip_onion.png",
    "link": "https://link.coupang.com/a/example34",
    "desc": "생감자의 신선한 맛 속에 은은하게 감도는 양파 향의 질리지 않는 감자칩!",
    "defaultVotes": 1095
  },
  {
    "id": "pringles_onion",
    "name": "프링글스 사워크림 앤 어니언",
    "category": "potato",
    "image": "images/pringles_sourcream.png",
    "link": "https://link.coupang.com/a/example42",
    "desc": "새콤한 사워크림과 달콤 짭짤한 어니언 시즈닝이 칩마다 가득 밴 인기 맛!",
    "defaultVotes": 1080
  },
  {
    "id": "swingchip",
    "name": "오리온 스윙칩 볶음고추장맛",
    "category": "potato",
    "image": "images/swingchip_hot.png",
    "link": "https://link.coupang.com/a/example19",
    "desc": "두껍고 큼직한 굴곡 감자칩 사이에 한국인 취향 저격 매콤한 고추장 시즈닝!",
    "defaultVotes": 1065
  },
  {
    "id": "cheetos",
    "name": "치토스 매콤한 맛",
    "category": "snack",
    "image": "images/cheetos_spicy.png",
    "link": "https://link.coupang.com/a/example58",
    "desc": "매콤하고 자극적인 양념과 크런치한 옥수수 식감으로 언제나 손이 가는 스낵!",
    "defaultVotes": 1050
  },
  {
    "id": "nunegamja",
    "name": "눈을 감자",
    "category": "potato",
    "image": "images/nunegamja_new.png",
    "link": "https://link.coupang.com/a/example53",
    "desc": "통감자를 거칠게 썰어 오독오독하고 짭조름하게 씹는 재미를 살린 감자과자!",
    "defaultVotes": 1035
  },
  {
    "id": "sunchip",
    "name": "태양의 맛 썬",
    "category": "snack",
    "image": "images/sunchip_new.png",
    "link": "https://link.coupang.com/a/example43",
    "desc": "통곡물의 거친 바삭함 속에 배어 나오는 화끈하고 매콤달콤한 태양의 맛!",
    "defaultVotes": 1020
  },
  {
    "id": "haribo",
    "name": "하리보 골드베렌",
    "category": "jelly",
    "image": "images/haribo.jpg",
    "link": "https://link.coupang.com/a/example32",
    "desc": "100년 전통의 쫀득말랑한 과일 맛 곰돌이 젤리! 전 세계 베스트셀러.",
    "defaultVotes": 1005
  },
  {
    "id": "butterwaffle",
    "name": "버터와플",
    "category": "biscuit",
    "image": "images/butterwaffle.jpg",
    "link": "https://link.coupang.com/a/example71",
    "desc": "고소한 버터의 진한 풍미가 얇고 바삭한 와플 모양 속에 사르르 녹아든 비스킷!",
    "defaultVotes": 990
  },
  {
    "id": "margaret",
    "name": "마가렛트",
    "category": "biscuit",
    "image": "images/margaret.jpg",
    "link": "https://link.coupang.com/a/example15",
    "desc": "부드럽고 촉촉한 쿠키 빵 속에 땅콩 크림이 고소하게 채워진 소프트 쿠키!",
    "defaultVotes": 975
  },
  {
    "id": "chocosongi",
    "name": "초코송이",
    "category": "choco",
    "image": "images/chocosongi.jpg",
    "link": "https://link.coupang.com/a/example64",
    "desc": "귀여운 머쉬룸 모양 비스킷 머리에 달콤한 밀크 초콜릿 모자를 얹은 과자!",
    "defaultVotes": 960
  },
  {
    "id": "shrimpchip",
    "name": "알새우칩",
    "category": "snack",
    "image": "images/default_snack.png",
    "link": "https://link.coupang.com/a/example29",
    "desc": "입안 가득 차오르는 파삭함, 생새우 향이 입안에 퍼져 안주나 간식으로 최고!",
    "defaultVotes": 945
  },
  {
    "id": "conchi",
    "name": "콘치 크림치즈",
    "category": "biscuit",
    "image": "images/default_biscuit.png",
    "link": "https://link.coupang.com/a/example46",
    "desc": "바삭한 옥수수 콘 칩 위에 부드럽고 짭조름한 덴마크산 고소한 크림치즈 퐁듀!",
    "defaultVotes": 930
  },
  {
    "id": "mygumi_peach",
    "name": "마이구미 복숭아",
    "category": "jelly",
    "image": "images/mygumi_peach.jpg",
    "link": "https://link.coupang.com/a/example74",
    "desc": "리얼 복숭아 과즙의 과일 향과 쫄깃하고 달콤한 하트 젤리의 사랑스러운 맛!",
    "defaultVotes": 915
  },
  {
    "id": "yegam_plain",
    "name": "예감 오리지널",
    "category": "potato",
    "image": "images/yegam_plain.jpg",
    "link": "https://link.coupang.com/a/example54",
    "desc": "기름기 없이 구워 감자 본연의 담백한 맛과 바삭바삭한 식감을 극대화한 감자칩!",
    "defaultVotes": 900
  },
  {
    "id": "custard",
    "name": "카스타드",
    "category": "choco",
    "image": "images/custard.jpg",
    "link": "https://link.coupang.com/a/example23",
    "desc": "계란을 듬뿍 넣어 촉촉하고 부드러운 빵 속에 커스타드 크림이 듬뿍!",
    "defaultVotes": 885
  },
  {
    "id": "couque",
    "name": "쿠쿠다스 화이트",
    "category": "biscuit",
    "image": "images/default_biscuit.png",
    "link": "https://link.coupang.com/a/example16",
    "desc": "입에 대자마자 눈처럼 녹아내리는 부드러움의 정수! 멜랑슈 크림 쿠키.",
    "defaultVotes": 870
  },
  {
    "id": "chamcracker",
    "name": "참크래커",
    "category": "biscuit",
    "image": "images/default_biscuit.png",
    "link": "https://link.coupang.com/a/example72",
    "desc": "가벼운 담백 짭조름한 크래커의 정석. 잼이나 크림치즈를 발라 먹기 최고!",
    "defaultVotes": 855
  },
  {
    "id": "sweetpotatokkang",
    "name": "고구마깡",
    "category": "snack",
    "image": "images/default_snack.png",
    "link": "https://link.coupang.com/a/example37",
    "desc": "고소한 검은깨와 은은하고 진한 고구마 맛이 결합된 오독오독 스낵!",
    "defaultVotes": 840
  },
  {
    "id": "osatsu",
    "name": "오사쯔 고구마",
    "category": "snack",
    "image": "images/default_snack.png",
    "link": "https://link.coupang.com/a/example36",
    "desc": "국산 고구마 페이스트와 식이섬유가 든 입안에서 녹아내리는 웰빙 고구마 스낵!",
    "defaultVotes": 825
  },
  {
    "id": "kancho",
    "name": "칸쵸 초코",
    "category": "choco",
    "image": "images/kancho.jpg",
    "link": "https://link.coupang.com/a/example9",
    "desc": "동글동글 귀여운 바삭 비스킷 속에 부드럽고 달콤한 가나 초콜릿이 쏙!",
    "defaultVotes": 810
  },
  {
    "id": "ivy",
    "name": "아이비",
    "category": "biscuit",
    "image": "images/ivy.jpg",
    "link": "https://link.coupang.com/a/example73",
    "desc": "순수하고 담백한 발효 크래커. 카나페 파티나 깔끔한 티타임에 어울려요.",
    "defaultVotes": 795
  },
  {
    "id": "vegtime",
    "name": "야채타임",
    "category": "snack",
    "image": "images/vegtime.jpg",
    "link": "https://link.coupang.com/a/example40",
    "desc": "상큼한 야채맛 스낵 속에 담긴 새콤한 토마토 케첩 디핑 소스 찍먹 꿀잼!",
    "defaultVotes": 780
  },
  {
    "id": "potatokkang",
    "name": "감자깡",
    "category": "snack",
    "image": "images/potatokkang.jpg",
    "link": "https://link.coupang.com/a/example38",
    "desc": "농심의 깡 시리즈 중 하나! 짭조름한 바베큐 시즈닝 맛 감자스틱.",
    "defaultVotes": 765
  },
  {
    "id": "crabchip",
    "name": "꽃게랑",
    "category": "snack",
    "image": "images/crabchip.jpg",
    "link": "https://link.coupang.com/a/example26",
    "desc": "꽃게 모양으로 구워내 담백 고소하고 와사비/해물 특유의 짭짤함을 담은 스낵!",
    "defaultVotes": 750
  },
  {
    "id": "jagalchi",
    "name": "자갈치 문어",
    "category": "snack",
    "image": "images/jagalchi.jpg",
    "link": "https://link.coupang.com/a/example28",
    "desc": "귀여운 꼬마 문어 디자인 속에 바삭 짭짤한 문어 구이 맛 시즈닝이 가득!",
    "defaultVotes": 735
  },
  {
    "id": "onionkkang",
    "name": "양파깡",
    "category": "snack",
    "image": "images/onionkkang.jpg",
    "link": "https://link.coupang.com/a/example39",
    "desc": "양파의 은은하고 달큰한 감칠맛을 바삭한 링 스낵으로 재해석한 과자!",
    "defaultVotes": 720
  },
  {
    "id": "swingchip_chicken",
    "name": "스윙칩 간장치킨",
    "category": "potato",
    "image": "images/swingchip_chicken.jpg",
    "link": "https://link.coupang.com/a/example35",
    "desc": "단짠단짠의 대명사 간장치킨 특제 소스를 뿌려 맥주를 부르는 웨이브 감자칩!",
    "defaultVotes": 705
  },
  {
    "id": "beehivepizza",
    "name": "벌집피자",
    "category": "snack",
    "image": "images/default_snack.png",
    "link": "https://link.coupang.com/a/example41",
    "desc": "벌집 모양 그리드 틈으로 피자 소스 맛 시즈닝이 부드럽고 강하게 스며든 스낵!",
    "defaultVotes": 690
  },
  {
    "id": "gogalcorn_corn",
    "name": "꼬깔콘 군옥수수",
    "category": "snack",
    "image": "images/gogalcorn_corn.jpg",
    "link": "https://link.coupang.com/a/example33",
    "desc": "더욱 깊고 짭짤하게 볶아낸 군옥수수 풍미의 중독성 최강자 꼬깔콘!",
    "defaultVotes": 675
  },
  {
    "id": "sunchip_garlic",
    "name": "썬칩 갈릭바게트",
    "category": "snack",
    "image": "images/default_snack.png",
    "link": "https://link.coupang.com/a/example43",
    "desc": "바삭하고 거친 통곡물 칩 위에 고소하고 달달한 갈릭 바게트 마늘 버터 맛 가득!",
    "defaultVotes": 660
  },
  {
    "id": "nacho",
    "name": "도도한 나쵸 치즈",
    "category": "snack",
    "image": "images/nacho.jpg",
    "link": "https://link.coupang.com/a/example44",
    "desc": "오븐에 구워 기름기를 빼고 더욱 진하고 풍부한 체다 치즈 가루를 입힌 나초 칩!",
    "defaultVotes": 645
  },
  {
    "id": "concho",
    "name": "콘초 헤이즐넛초코",
    "category": "choco",
    "image": "images/default_choco.png",
    "link": "https://link.coupang.com/a/example45",
    "desc": "바삭바삭 옥수수 콘스낵 바닥에 초콜릿 퐁듀를 입힌 환상의 단짠 조합!",
    "defaultVotes": 630
  },
  {
    "id": "maplecorn",
    "name": "카라멜 메이플콘",
    "category": "snack",
    "image": "images/maplecorn.jpg",
    "link": "https://link.coupang.com/a/example47",
    "desc": "향긋하고 은은한 캐나다산 리얼 메이플 시럽 코팅으로 달콤바삭한 콘 스낵!",
    "defaultVotes": 615
  },
  {
    "id": "chocheong",
    "name": "조청유과 쌀",
    "category": "snack",
    "image": "images/chocheong.jpg",
    "link": "https://link.coupang.com/a/example48",
    "desc": "가마솥에서 끓인 전통 조청으로 쌀 과자의 겉면을 코팅해 한층 깊은 달콤고소함!",
    "defaultVotes": 600
  },
  {
    "id": "indianbab",
    "name": "인디안밥 콘",
    "category": "snack",
    "image": "images/indianbab.jpg",
    "link": "https://link.coupang.com/a/example49",
    "desc": "바삭하고 담백한 고소 옥수수 플레이크 스낵. 우유 시리얼 대용으로도 인기!",
    "defaultVotes": 585
  },
  {
    "id": "jjanggu_choco",
    "name": "초코 신짱",
    "category": "choco",
    "image": "images/default_choco.png",
    "link": "https://link.coupang.com/a/example50",
    "desc": "달콤 쌉싸름한 코코아 분말을 둘러 한 단계 더 디저트스러워진 짱구의 진화!",
    "defaultVotes": 570
  },
  {
    "id": "oguma",
    "name": "오구마 고구마",
    "category": "snack",
    "image": "images/default_snack.png",
    "link": "https://link.coupang.com/a/example51",
    "desc": "바삭바삭 네 겹의 식감 위에 깊은 군고구마 풍미와 꿀 코팅으로 중독성을 높인 과자!",
    "defaultVotes": 555
  },
  {
    "id": "potetochip",
    "name": "포테토칩",
    "category": "potato",
    "image": "images/potetochip.jpg",
    "link": "https://link.coupang.com/a/example52",
    "desc": "오리지널 생감자 본연의 은은한 고소함과 담백 바삭함을 지켜온 장수 감자칩!",
    "defaultVotes": 540
  },
  {
    "id": "bakedpotato",
    "name": "구운감자 석쇠",
    "category": "potato",
    "image": "images/default_potato.png",
    "link": "https://link.coupang.com/a/example55",
    "desc": "기름 없이 구워 담백하고 단단한 오독 식감을 자랑하는 원통형 감자 스틱!",
    "defaultVotes": 525
  },
  {
    "id": "chocochip_cookie",
    "name": "초코칩 쿠키 바삭",
    "category": "biscuit",
    "image": "images/chocochip_cookie.jpg",
    "link": "https://link.coupang.com/a/example56",
    "desc": "고소한 쿠키 반죽 속에 초코칩이 아기자기하게 들어있어 깔끔하게 조화를 이루는 비스킷!",
    "defaultVotes": 510
  },
  {
    "id": "bbasae",
    "name": "빠새 쉬림프",
    "category": "snack",
    "image": "images/bbasae.jpg",
    "link": "https://link.coupang.com/a/example57",
    "desc": "얇고 파삭파삭한 식감 속에 생새우의 짭조름한 감칠맛이 입안 가득 감도는 과자!",
    "defaultVotes": 495
  },
  {
    "id": "gobukchip_vanilla",
    "name": "꼬북칩 바닐라",
    "category": "snack",
    "image": "images/default_snack.png",
    "link": "https://link.coupang.com/a/example59",
    "desc": "꼬북칩 4겹 레이어에 바닐라 크림을 코팅하여 부드럽고 깊은 바닐라 향 가득!",
    "defaultVotes": 480
  },
  {
    "id": "diget_thin",
    "name": "다이제 씬 통밀",
    "category": "biscuit",
    "image": "images/default_biscuit.png",
    "link": "https://link.coupang.com/a/example65",
    "desc": "기존 다이제보다 훨씬 가볍고 부드러워져 모닝커피에 곁들이기 좋은 통밀 크래커!",
    "defaultVotes": 465
  },
  {
    "id": "margaret_choco",
    "name": "마가렛트 구운모카",
    "category": "biscuit",
    "image": "images/default_biscuit.png",
    "link": "https://link.coupang.com/a/example66",
    "desc": "커피 크림의 모카 풍미와 초코칩의 조화로 촉촉하게 구워낸 고급 소프트 쿠키!",
    "defaultVotes": 450
  },
  {
    "id": "binch_rye",
    "name": "빈츠 카페모카",
    "category": "choco",
    "image": "images/default_choco.png",
    "link": "https://link.coupang.com/a/example67",
    "desc": "진한 에스프레소 커피 향 초콜릿을 올려 티타임의 동반자로 거듭난 빈츠 시리즈!",
    "defaultVotes": 435
  },
  {
    "id": "yegam_cheese",
    "name": "예감 치즈그라탕맛",
    "category": "potato",
    "image": "images/yegam_cheese.jpg",
    "link": "https://link.coupang.com/a/example54",
    "desc": "기름에 튀기지 않고 오븐에 구워 담백하고 짭조름한 치즈그라탕 맛 예감!",
    "defaultVotes": 420
  },
  {
    "id": "haribo_cola",
    "name": "하리보 해피콜라",
    "category": "jelly",
    "image": "images/haribo_cola.jpg",
    "link": "https://link.coupang.com/a/example75",
    "desc": "귀여운 콜라병 디자인 속에 상큼하고 쫄깃쫄깃한 탄산 콜라 향이 가득!",
    "defaultVotes": 405
  }
];

if (typeof module !== 'undefined') {
  module.exports = SNACK_DATA;
}
