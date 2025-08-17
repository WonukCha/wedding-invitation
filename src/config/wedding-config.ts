const uniqueIdentifier = "JWK-WEDDING-TEMPLATE-V1";

// 갤러리 레이아웃 타입 정의
type GalleryLayout = "scroll" | "grid";
type GalleryPosition = "middle" | "bottom";

interface GalleryConfig {
  layout: GalleryLayout;
  position: GalleryPosition;
  images: string[];
}

export const weddingConfig = {
  // 메타 정보
  meta: {
    title: "차원욱 ❤️ 강혜미의 결혼식에 초대합니다",
    description: "결혼식 초대장",
    ogImage: "/wedding-invitation/images/image_main_v3.jpg",
    noIndex: true,
    _jwk_watermark_id: uniqueIdentifier,
  },

  // 메인 화면
  main: {
    title: "Wedding Invitation",
    image: "/wedding-invitation/images/image_main_v3.jpg",
    date: "2025년 11월 15일 토요일 18시 00분",
    venue: "AW 컨벤션 안산"
  },

  // 소개글
  intro: {
    title: "",
    text: "서로를 바라보며 걸어온\n소중한 발걸음이\n이제 하나의 길로 이어집니다.\n\n사랑과 믿음으로\n새 가정을 이루는 저희 두 사람의\n작은 시작을 알려드립니다."
  },

  // 결혼식 일정
  date: {
    year: 2025,
    month: 11,
    day: 15,
    hour: 18,
    minute: 0,
    displayDate: "2025.11.15 SAT PM 06:00",
  },

  // 장소 정보
  venue: {
    name: "AW 컨벤션 안산",
    address: "경기도 안산시 단원구 광덕1로 171",
    tel: "031-501-5900",
    naverMapId: "AW컨벤션안산", // 네이버 지도 검색용 장소명
    coordinates: {
      latitude: 37.3108,
      longitude: 126.8306,
    },
    placeId: "11491772", // 네이버 지도 장소 ID (AW컨벤션안산)
    mapZoom: "16", // 지도 줌 레벨
    mapNaverCoordinates: "127.8306,37.3108,16", // 네이버 지도 길찾기 URL용 좌표 파라미터
    transportation: {
      subway: "4호선 고잔역 2번 출구\n셔틀버스는 예식 2시간 후까지 운행합니다.\n(셔틀버스 7분~10분 간격 수시운행 / 도보 15~20분)",
      bus: "안산 문화숲의 광장 하차 : 3, 50, 98, 99-1, 123, 3103, 5609\n동남레이크빌 하차 : 3, 70A, 77, 98, 99-1, 3100, 3101",
    },
    parking: "제 1주차장 : AW 컨벤션 지상, 지하 1~2층\n제 2주차장 : 양지주차타워(AW 컨벤션 주차타워)\n제 3주차장 : AW컨벤션 정문 맞은편 공영주차장\n제 4주차장 : MK 주차타워",
  },

  // 갤러리
  gallery: {
    layout: "grid" as GalleryLayout, // "scroll" 또는 "grid" 선택
    position: "bottom" as GalleryPosition, // "middle" (현재 위치) 또는 "bottom" (맨 하단) 선택
    images: [
      "/wedding-invitation/images/gallery/image_01.jpg",
      "/wedding-invitation/images/gallery/image_02.jpg",
      "/wedding-invitation/images/gallery/image_03.jpg",
      "/wedding-invitation/images/gallery/image_04.jpg",
      "/wedding-invitation/images/gallery/image_05.jpg",
      "/wedding-invitation/images/gallery/image_06.jpg",
      "/wedding-invitation/images/gallery/image_07.jpg",
      "/wedding-invitation/images/gallery/image_09.jpg",
      "/wedding-invitation/images/gallery/image_13.jpg",
      "/wedding-invitation/images/gallery/image_14.jpg",
      "/wedding-invitation/images/gallery/image_15.jpg",
      "/wedding-invitation/images/gallery/image_18.jpg",
      "/wedding-invitation/images/gallery/image_19.jpg",
      "/wedding-invitation/images/gallery/image_20.jpg",
      "/wedding-invitation/images/gallery/image_21.jpg",
      "/wedding-invitation/images/gallery/image_22.jpg",
      "/wedding-invitation/images/gallery/image_23.jpg",
      "/wedding-invitation/images/gallery/image_24.jpg",
      "/wedding-invitation/images/gallery/image_25.jpg",
      "/wedding-invitation/images/gallery/image_26.jpg",
      "/wedding-invitation/images/gallery/image_27.jpg"
    ],
  } as GalleryConfig,

  // 초대의 말씀
  invitation: {
    message: "대학생 때 처음 만나\n함께 웃고, 울고, 성장하며\n9년을 걸어 왔습니다.\n\n이제는 서로의 '가족'이 되려 합니다.\n저희의 긴 연애의 끝이자\n새로운 시작을 함께 축하해 주세요.",
    groom: {
      name: "차원욱",
      label: "아들",
      father: "차영수",
      mother: "송미영",
    },
    bride: {
      name: "강혜미",
      label: "딸",
      father: "강대성",
      mother: "김미희",
    },
  },

  // 계좌번호
  account: {
    groom: {
      bank: "토스뱅크",
      number: "1000-5022-2839",
      holder: "차원욱",
    },
    bride: {
      bank: "케이뱅크",
      number: "100-128-580101",
      holder: "강혜미",
    },
    groomFather: {
      bank: "신한은행",
      number: "010-2254-2405",
      holder: "차영수",
    },
    groomMother: {
      bank: "농협은행",
      number: "110-12-157196",
      holder: "송미영",
    },
    brideFather: {
      bank: "우리은행",
      number: "168-430331-02-001",
      holder: "강대성",
    },
    brideMother: {
      bank: "하나은행",
      number: "490-910253-09407",
      holder: "김미희",
    }
  },

  // RSVP 설정
  rsvp: {
    enabled: false, // RSVP 섹션 표시 여부
    showMealOption: false, // 식사 여부 입력 옵션 표시 여부
  },
}; 
