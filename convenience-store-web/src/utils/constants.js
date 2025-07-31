// API 관련 상수
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// 편의점 브랜드 정보
export const CONVENIENCE_STORE_BRANDS = {
  GS25: {
    name: 'GS25',
    color: '#00A651',
    slogan: '당신의 편리한 세상'
  },
  CU: {
    name: 'CU',
    color: '#7B68EE',
    slogan: '편의점을 넘어선 편의점'
  },
  SEVEN_ELEVEN: {
    name: '세븐일레븐',
    color: '#FF6B35',
    slogan: 'Oh Thank Heaven'
  },
  EMART24: {
    name: '이마트24',
    color: '#FFD700',
    slogan: '24시간 편리한 생활'
  },
  MINISTOP: {
    name: '미니스톱',
    color: '#4A90E2',
    slogan: 'Always Something Special'
  }
};

// 상품 카테고리
export const PRODUCT_CATEGORIES = {
  INSTANT_FOOD: {
    code: 'instant-food',
    name: '즉석식품',
    icon: '🍱'
  },
  BEVERAGES: {
    code: 'beverages',
    name: '음료',
    icon: '🥤'
  },
  SNACKS: {
    code: 'snacks',
    name: '과자',
    icon: '🍿'
  },
  ICE_CREAM: {
    code: 'ice-cream',
    name: '아이스크림',
    icon: '🍦'
  },
  DAILY_NECESSITIES: {
    code: 'daily-necessities',
    name: '생활용품',
    icon: '🧴'
  },
  HEALTH_BEAUTY: {
    code: 'health-beauty',
    name: '건강/미용',
    icon: '💄'
  }
};

// 주문 상태
export const ORDER_STATUS = {
  PENDING: {
    code: 'pending',
    name: '주문 대기',
    color: 'warning'
  },
  CONFIRMED: {
    code: 'confirmed',
    name: '주문 확인',
    color: 'primary'
  },
  PREPARING: {
    code: 'preparing',
    name: '준비 중',
    color: 'secondary'
  },
  READY: {
    code: 'ready',
    name: '픽업 대기',
    color: 'success'
  },
  COMPLETED: {
    code: 'completed',
    name: '완료',
    color: 'success'
  },
  CANCELLED: {
    code: 'cancelled',
    name: '취소',
    color: 'error'
  }
};

// 페이지네이션 기본값
export const PAGINATION_DEFAULTS = {
  PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100
};

// 로컬 스토리지 키
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_INFO: 'user_info',
  CART_ITEMS: 'cart_items',
  RECENT_SEARCHES: 'recent_searches',
  FAVORITE_STORES: 'favorite_stores'
};

// 정규식 패턴
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^010-\d{4}-\d{4}$/,
  PASSWORD: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
};

// 에러 메시지
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '네트워크 연결을 확인해주세요.',
  INVALID_EMAIL: '올바른 이메일 주소를 입력해주세요.',
  INVALID_PHONE: '올바른 전화번호 형식을 입력해주세요. (예: 010-1234-5678)',
  WEAK_PASSWORD: '비밀번호는 8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다.',
  REQUIRED_FIELD: '필수 입력 항목입니다.',
  SERVER_ERROR: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
};