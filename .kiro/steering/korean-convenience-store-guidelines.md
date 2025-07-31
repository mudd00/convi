# 한국 편의점 웹사이트 개발 가이드라인

## 편의점 브랜드 특성

### 주요 편의점 체인
- **GS25**: GS리테일, 초록색 브랜드 컬러, "당신의 편리한 세상"
- **CU**: BGF리테일, 보라색 브랜드 컬러, "편의점을 넘어선 편의점"
- **세븐일레븐**: 빨간색/주황색/초록색 브랜드 컬러, "Oh Thank Heaven"
- **이마트24**: 노란색 브랜드 컬러, "24시간 편리한 생활"
- **미니스톱**: 파란색 브랜드 컬러, "Always Something Special"

### 한국 편의점 특징
- 24시간 운영 매장이 많음 (약 70% 이상)
- 다양한 즉석식품 (도시락, 삼각김밥, 컵라면, 핫바 등)
- 생활 서비스 허브 역할 (택배, 공과금 납부, 교통카드 충전)
- 프라이빗 브랜드(PB) 상품 적극 운영
- 빈번한 할인 이벤트 (1+1, 2+1, 덤증정)
- 계절별 한정 상품 출시
- 멤버십 포인트 적립 시스템

## 상품 카테고리 구조

상품 카테고리는 requirements.md에 정의된 구조를 따릅니다. 개발 시 다음 사항을 고려하세요:

- **카테고리 코드**: 영문 소문자와 하이픈 사용 (예: `instant-food`, `beverages`)
- **다국어 지원**: 카테고리명은 i18n 키로 관리
- **동적 카테고리**: 관리자가 카테고리를 추가/수정할 수 있도록 설계
- **SEO 최적화**: 카테고리별 메타데이터 및 구조화된 데이터 적용

## UI/UX 디자인 가이드라인

### 색상 체계
```css
/* 기본 브랜드 컬러 */
--primary-color: #00A651; /* GS25 그린 */
--secondary-color: #7B68EE; /* CU 퍼플 */
--accent-color: #FF6B35; /* 세븐일레븐 오렌지 */

/* 기능별 컬러 */
--discount-color: #FF4444; /* 할인/세일 */
--new-product-color: #FF8C00; /* 신상품 */
--sold-out-color: #999999; /* 품절 */
--premium-color: #FFD700; /* 프리미엄/VIP */
--success-color: #28A745; /* 성공/완료 */
--warning-color: #FFC107; /* 경고/주의 */
--error-color: #DC3545; /* 오류/실패 */
```

### 레이아웃 원칙
- **모바일 우선 설계** (Mobile First Approach)
- **터치 친화적 인터페이스** (최소 44px 터치 영역)
- **직관적 네비게이션** (최대 3단계 깊이)
- **빠른 로딩** (3초 이내 초기 로딩)
- **일관된 디자인 시스템** (컴포넌트 재사용)

### 한국어 타이포그래피
```css
/* 한글 폰트 스택 */
font-family: 'Noto Sans KR', 'Malgun Gothic', '맑은 고딕', 
             'Apple SD Gothic Neo', sans-serif;

/* 텍스트 처리 */
word-break: keep-all; /* 한글 단어 단위 줄바꿈 */
line-height: 1.6; /* 한글 가독성을 위한 줄간격 */

/* 가격 표시 */
.price::after { content: '원'; }
.currency { font-weight: bold; color: var(--primary-color); }
```

## 기술 스택 및 아키텍처

### 프론트엔드 스택 (React + Vite 기반)
```json
{
  "framework": "React 18+ with TypeScript",
  "build": "Vite 5+",
  "styling": "Tailwind CSS",
  "state": "Zustand (가벼운 상태 관리)",
  "routing": "React Router v6",
  "forms": "React Hook Form + Zod",
  "http": "Axios with TanStack Query (React Query)",
  "ui": "Headless UI + Radix UI",
  "icons": "Lucide React",
  "testing": "Vitest + React Testing Library",
  "e2e": "Playwright",
  "linting": "ESLint + Prettier",
  "bundler": "Vite with SWC"
}
```

### Vite 설정 예시
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@pages': resolve(__dirname, './src/pages'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@utils': resolve(__dirname, './src/utils'),
      '@types': resolve(__dirname, './src/types'),
      '@api': resolve(__dirname, './src/api'),
      '@stores': resolve(__dirname, './src/stores')
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@headlessui/react', '@radix-ui/react-dialog']
        }
      }
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  }
})
```

### 백엔드 스택
```json
{
  "runtime": "Node.js 18+ with TypeScript",
  "framework": "Express.js or Fastify",
  "database": "PostgreSQL + Redis (cache)",
  "orm": "Prisma or TypeORM",
  "auth": "JWT + Passport.js",
  "validation": "Joi or Zod",
  "testing": "Jest + Supertest",
  "docs": "Swagger/OpenAPI"
}
```

### React + Vite 프로젝트 구조
```
convenience-store-web/
├── public/
│   ├── images/
│   │   ├── products/
│   │   ├── stores/
│   │   └── brands/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── ui/           # 재사용 가능한 UI 컴포넌트
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Card.tsx
│   │   ├── layout/       # 레이아웃 컴포넌트
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Navigation.tsx
│   │   ├── product/      # 상품 관련 컴포넌트
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductList.tsx
│   │   │   ├── ProductDetail.tsx
│   │   │   └── ProductSearch.tsx
│   │   ├── store/        # 매장 관련 컴포넌트
│   │   │   ├── StoreCard.tsx
│   │   │   ├── StoreMap.tsx
│   │   │   └── StoreList.tsx
│   │   └── order/        # 주문 관련 컴포넌트
│   │       ├── Cart.tsx
│   │       ├── OrderForm.tsx
│   │       └── OrderHistory.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── ProductsPage.tsx
│   │   ├── StoresPage.tsx
│   │   ├── OrderPage.tsx
│   │   ├── ProfilePage.tsx
│   │   └── AdminPage.tsx
│   ├── hooks/
│   │   ├── useProducts.ts
│   │   ├── useStores.ts
│   │   ├── useAuth.ts
│   │   └── useCart.ts
│   ├── stores/           # Zustand 스토어
│   │   ├── authStore.ts
│   │   ├── cartStore.ts
│   │   └── uiStore.ts
│   ├── api/
│   │   ├── client.ts
│   │   ├── products.ts
│   │   ├── stores.ts
│   │   └── auth.ts
│   ├── types/
│   │   ├── product.ts
│   │   ├── store.ts
│   │   ├── user.ts
│   │   └── api.ts
│   ├── utils/
│   │   ├── format.ts
│   │   ├── validation.ts
│   │   └── constants.ts
│   ├── styles/
│   │   ├── globals.css
│   │   └── components.css
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── tests/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   └── utils/
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

### 컴포넌트 개발 가이드라인
```typescript
// 컴포넌트 작성 예시
interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  className = ''
}) => {
  const { addToCart } = useCartStore();
  
  const handleAddToCart = () => {
    addToCart(product);
    onAddToCart?.(product);
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      <img 
        src={product.images[0]?.url} 
        alt={product.name}
        className="w-full h-48 object-cover rounded-md"
        loading="lazy"
      />
      <div className="mt-3">
        <h3 className="font-semibold text-gray-900">{product.name}</h3>
        <div className="flex items-center justify-between mt-2">
          <span className="text-lg font-bold text-primary">
            {formatPrice(product.price)}원
          </span>
          {product.discountPrice && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.discountPrice)}원
            </span>
          )}
        </div>
        <Button 
          onClick={handleAddToCart}
          className="w-full mt-3"
          variant="primary"
        >
          장바구니 담기
        </Button>
      </div>
    </div>
  );
};
```

### 인프라 및 DevOps
```yaml
# Docker Compose 예시
services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - VITE_API_URL=http://localhost:8000
  
  api:
    image: node:18-alpine
    ports:
      - "8000:8000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@db:5432/convenience_store
  
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=convenience_store
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
  
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf

volumes:
  postgres_data:
```

## 데이터 모델 가이드라인

데이터 모델의 상세한 구조는 design.md에 정의되어 있습니다. 개발 시 다음 원칙을 따르세요:

### 네이밍 컨벤션
- **테이블명**: snake_case (예: `product_categories`, `user_addresses`)
- **컬럼명**: snake_case (예: `created_at`, `is_active`)
- **인덱스명**: `idx_table_column` 형식
- **외래키명**: `fk_table_reference` 형식

### 데이터 타입 가이드라인
- **ID**: UUID v4 사용
- **날짜**: ISO 8601 형식 (YYYY-MM-DDTHH:mm:ssZ)
- **가격**: 정수형 (원 단위, 소수점 없음)
- **좌표**: Decimal(10,8) 정밀도
- **전화번호**: 하이픈 포함 문자열 (010-1234-5678)

### 성능 최적화
- **인덱스**: 자주 조회되는 컬럼에 복합 인덱스 생성
- **파티셔닝**: 대용량 테이블(주문, 로그)은 날짜별 파티셔닝
- **캐싱**: 자주 변경되지 않는 데이터는 Redis 캐싱

## API 설계 가이드라인

### RESTful API 구조
```typescript
// 상품 관련 API
GET    /api/v1/products              // 상품 목록 조회
GET    /api/v1/products/:id          // 상품 상세 조회
GET    /api/v1/products/search       // 상품 검색
GET    /api/v1/categories            // 카테고리 목록
GET    /api/v1/products/featured     // 추천 상품
GET    /api/v1/products/discounts    // 할인 상품

// 매장 관련 API
GET    /api/v1/stores                // 매장 목록
GET    /api/v1/stores/:id            // 매장 상세 정보
GET    /api/v1/stores/nearby         // 주변 매장 검색
GET    /api/v1/stores/:id/products   // 매장별 상품 재고

// 주문 관련 API
POST   /api/v1/orders               // 주문 생성
GET    /api/v1/orders/:id           // 주문 상세 조회
PUT    /api/v1/orders/:id/status    // 주문 상태 업데이트
DELETE /api/v1/orders/:id           // 주문 취소

// 사용자 관련 API
POST   /api/v1/auth/register        // 회원가입
POST   /api/v1/auth/login           // 로그인
POST   /api/v1/auth/refresh         // 토큰 갱신
GET    /api/v1/users/profile        // 프로필 조회
PUT    /api/v1/users/profile        // 프로필 수정
```

### 응답 형식 표준화
```typescript
// 성공 응답
interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 오류 응답
interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
  path: string;
}
```

## 보안 및 인증

### 인증/인가 체계
```typescript
// JWT 토큰 구조
interface JWTPayload {
  userId: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'STORE_MANAGER';
  membershipTier: string;
  iat: number;
  exp: number;
}

// 권한 레벨
enum Permission {
  READ_PRODUCTS = 'products:read',
  WRITE_PRODUCTS = 'products:write',
  READ_ORDERS = 'orders:read',
  WRITE_ORDERS = 'orders:write',
  READ_USERS = 'users:read',
  WRITE_USERS = 'users:write',
  ADMIN_ACCESS = 'admin:access'
}
```

### 보안 체크리스트
- [ ] HTTPS 강제 적용
- [ ] JWT 토큰 보안 (HttpOnly 쿠키)
- [ ] Rate Limiting 구현
- [ ] SQL Injection 방지
- [ ] XSS 방지 (CSP 헤더)
- [ ] CSRF 토큰 적용
- [ ] 민감 데이터 암호화
- [ ] 로그 모니터링
- [ ] 정기 보안 감사

## 상태 관리 (Zustand)

### 스토어 구조
```typescript
// stores/authStore.ts
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  
  login: async (email, password) => {
    try {
      const response = await authApi.login({ email, password });
      set({ user: response.user, isAuthenticated: true });
    } catch (error) {
      throw error;
    }
  },
  
  logout: () => {
    authApi.logout();
    set({ user: null, isAuthenticated: false });
  },
  
  register: async (userData) => {
    const response = await authApi.register(userData);
    set({ user: response.user, isAuthenticated: true });
  }
}));

// stores/cartStore.ts
interface CartState {
  items: CartItem[];
  totalAmount: number;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  totalAmount: 0,
  
  addItem: (product) => {
    const { items } = get();
    const existingItem = items.find(item => item.product.id === product.id);
    
    if (existingItem) {
      set({
        items: items.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      });
    } else {
      set({
        items: [...items, { product, quantity: 1 }]
      });
    }
    
    // 총액 계산
    const newTotal = get().items.reduce(
      (sum, item) => sum + (item.product.price * item.quantity), 0
    );
    set({ totalAmount: newTotal });
  },
  
  removeItem: (productId) => {
    set({
      items: get().items.filter(item => item.product.id !== productId)
    });
  },
  
  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    
    set({
      items: get().items.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    });
  },
  
  clearCart: () => set({ items: [], totalAmount: 0 })
}));
```

### TanStack Query 사용법
```typescript
// hooks/useProducts.ts
export const useProducts = (params?: ProductQueryParams) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productApi.getProducts(params),
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 10 * 60 * 1000, // 10분
    refetchOnWindowFocus: false
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getProduct(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000 // 10분
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: orderApi.createOrder,
    onSuccess: () => {
      // 주문 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      // 장바구니 초기화
      useCartStore.getState().clearCart();
    },
    onError: (error) => {
      console.error('주문 생성 실패:', error);
    }
  });
};

// 무한 스크롤을 위한 useInfiniteQuery
export const useInfiniteProducts = (category?: string) => {
  return useInfiniteQuery({
    queryKey: ['products', 'infinite', category],
    queryFn: ({ pageParam = 1 }) => 
      productApi.getProducts({ page: pageParam, category }),
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasMore ? pages.length + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000
  });
};
```

## 성능 최적화 가이드라인

성능 최적화의 상세한 전략은 design.md에 정의되어 있습니다. 개발 시 다음 체크리스트를 따르세요:

### 프론트엔드 최적화 체크리스트
- [ ] 코드 스플리팅 적용 (페이지별, 컴포넌트별)
- [ ] 이미지 최적화 (WebP, 지연 로딩, 반응형 이미지)
- [ ] 번들 크기 분석 및 최적화
- [ ] 메모이제이션 적용 (React.memo, useMemo, useCallback)
- [ ] Virtual Scrolling 적용 (긴 목록)
- [ ] 중요 리소스 프리로딩
- [ ] 서비스 워커 캐싱 전략

### 백엔드 최적화 체크리스트
- [ ] 데이터베이스 인덱스 최적화
- [ ] 쿼리 성능 분석 및 최적화
- [ ] Redis 캐싱 전략 구현
- [ ] API 응답 압축 (gzip)
- [ ] 커넥션 풀링 설정
- [ ] 페이지네이션 최적화 (커서 기반)
- [ ] 불필요한 데이터 로딩 방지 (N+1 문제 해결)

### 성능 목표
- **First Contentful Paint**: < 1.5초
- **Largest Contentful Paint**: < 2.5초
- **First Input Delay**: < 100ms
- **Cumulative Layout Shift**: < 0.1
- **API 응답 시간**: < 500ms (평균)

## 테스트 전략 (Vitest + React Testing Library)

### Vitest 설정
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
})

// src/test/setup.ts
import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})
```

### 컴포넌트 테스트
```typescript
// tests/components/ProductCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ProductCard } from '@/components/product/ProductCard'

const mockProduct = {
  id: '1',
  name: '참치마요 삼각김밥',
  price: 1500,
  images: [{ url: '/test-image.jpg' }],
  category: 'instant-food'
}

describe('ProductCard', () => {
  it('상품 정보를 올바르게 렌더링한다', () => {
    render(<ProductCard product={mockProduct} />)
    
    expect(screen.getByText('참치마요 삼각김밥')).toBeInTheDocument()
    expect(screen.getByText('1,500원')).toBeInTheDocument()
    expect(screen.getByAltText('참치마요 삼각김밥')).toBeInTheDocument()
  })

  it('장바구니 담기 버튼 클릭 시 콜백이 호출된다', () => {
    const onAddToCart = vi.fn()
    render(<ProductCard product={mockProduct} onAddToCart={onAddToCart} />)
    
    fireEvent.click(screen.getByText('장바구니 담기'))
    expect(onAddToCart).toHaveBeenCalledWith(mockProduct)
  })
})
```

### 커스텀 훅 테스트
```typescript
// tests/hooks/useProducts.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useProducts } from '@/hooks/useProducts'
import * as productApi from '@/api/products'

vi.mock('@/api/products')

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  })
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('useProducts', () => {
  it('상품 목록을 성공적으로 가져온다', async () => {
    const mockProducts = [
      { id: '1', name: '상품1', price: 1000 },
      { id: '2', name: '상품2', price: 2000 }
    ]
    
    vi.mocked(productApi.getProducts).mockResolvedValue({
      data: mockProducts,
      total: 2
    })

    const { result } = renderHook(() => useProducts(), {
      wrapper: createWrapper()
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data?.data).toEqual(mockProducts)
  })
})
```

### Zustand 스토어 테스트
```typescript
// tests/stores/cartStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useCartStore } from '@/stores/cartStore'

const mockProduct = {
  id: '1',
  name: '테스트 상품',
  price: 1000
}

describe('CartStore', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart()
  })

  it('상품을 장바구니에 추가할 수 있다', () => {
    const { addItem, items } = useCartStore.getState()
    
    addItem(mockProduct)
    
    expect(items).toHaveLength(1)
    expect(items[0].product).toEqual(mockProduct)
    expect(items[0].quantity).toBe(1)
  })

  it('동일한 상품을 추가하면 수량이 증가한다', () => {
    const { addItem, items } = useCartStore.getState()
    
    addItem(mockProduct)
    addItem(mockProduct)
    
    expect(items).toHaveLength(1)
    expect(items[0].quantity).toBe(2)
  })

  it('총액이 올바르게 계산된다', () => {
    const { addItem, totalAmount } = useCartStore.getState()
    
    addItem(mockProduct)
    addItem(mockProduct)
    
    expect(totalAmount).toBe(2000)
  })
})
```

### E2E 테스트 (Playwright)
```typescript
// tests/e2e/product-purchase.spec.ts
import { test, expect } from '@playwright/test'

test.describe('상품 구매 플로우', () => {
  test('사용자가 상품을 구매할 수 있다', async ({ page }) => {
    // 홈페이지 접속
    await page.goto('/')
    
    // 상품 페이지로 이동
    await page.click('[data-testid="products-link"]')
    await expect(page).toHaveURL('/products')
    
    // 첫 번째 상품 선택
    await page.click('[data-testid="product-card"]:first-child')
    
    // 장바구니에 추가
    await page.click('[data-testid="add-to-cart"]')
    
    // 장바구니 확인
    await page.click('[data-testid="cart-icon"]')
    await expect(page.locator('[data-testid="cart-item"]')).toBeVisible()
    
    // 주문하기
    await page.click('[data-testid="checkout-button"]')
    
    // 주문 완료 확인
    await expect(page.locator('[data-testid="order-success"]')).toBeVisible()
  })

  test('상품 검색이 정상 작동한다', async ({ page }) => {
    await page.goto('/products')
    
    // 검색어 입력
    await page.fill('[data-testid="search-input"]', '삼각김밥')
    await page.press('[data-testid="search-input"]', 'Enter')
    
    // 검색 결과 확인
    await expect(page.locator('[data-testid="product-card"]')).toContainText('삼각김밥')
  })
})
```

### 테스트 실행 스크립트
```json
// package.json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

## 접근성 (Accessibility) 가이드

### WCAG 2.1 AA 준수
```html
<!-- 시맨틱 HTML -->
<main role="main">
  <section aria-labelledby="products-heading">
    <h2 id="products-heading">추천 상품</h2>
    <ul role="list">
      <li role="listitem">
        <article>
          <img src="product.jpg" alt="참치마요 삼각김밥 1개입">
          <h3>참치마요 삼각김밥</h3>
          <p>가격: <span class="price">1,500원</span></p>
        </article>
      </li>
    </ul>
  </section>
</main>

<!-- 키보드 네비게이션 -->
<button 
  tabindex="0" 
  aria-label="장바구니에 담기"
  onKeyDown={handleKeyDown}
>
  담기
</button>
```

### 다국어 지원
```typescript
// i18n 설정
const translations = {
  ko: {
    'product.addToCart': '장바구니에 담기',
    'product.price': '가격',
    'product.discount': '할인'
  },
  en: {
    'product.addToCart': 'Add to Cart',
    'product.price': 'Price',
    'product.discount': 'Discount'
  },
  zh: {
    'product.addToCart': '加入购物车',
    'product.price': '价格',
    'product.discount': '折扣'
  }
};
```

## 모니터링 및 로깅

### 로그 구조
```typescript
interface LogEntry {
  timestamp: string;
  level: 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
  service: string;
  userId?: string;
  sessionId?: string;
  action: string;
  details: any;
  duration?: number;
  ip?: string;
  userAgent?: string;
}

// 예시 로그
{
  "timestamp": "2024-01-15T10:30:00Z",
  "level": "INFO",
  "service": "product-service",
  "userId": "user123",
  "action": "PRODUCT_VIEW",
  "details": { "productId": "prod456", "category": "instant-food" },
  "duration": 150,
  "ip": "192.168.1.1"
}
```

### 메트릭 수집
- 응답 시간 (Response Time)
- 처리량 (Throughput)
- 오류율 (Error Rate)
- 사용자 활동 (User Activity)
- 비즈니스 메트릭 (매출, 주문 수 등)

## 접근성 및 다국어 지원

접근성 설계의 상세한 내용은 design.md를 참조하세요. 개발 시 다음 사항을 준수하세요:

### 접근성 체크리스트
- [ ] WCAG 2.1 AA 기준 준수
- [ ] 키보드 네비게이션 완전 지원
- [ ] 스크린 리더 호환성 (ARIA 라벨)
- [ ] 색상 대비 4.5:1 이상 유지
- [ ] 포커스 인디케이터 명확히 표시
- [ ] 텍스트 200% 확대 지원
- [ ] 움직임 감소 옵션 제공

### 다국어 지원 체크리스트
- [ ] i18n 라이브러리 설정 (react-i18next)
- [ ] 번역 키 체계적 관리
- [ ] 날짜/시간/숫자 현지화
- [ ] RTL 언어 지원 준비 (향후 확장)
- [ ] 언어별 폰트 최적화
- [ ] URL 다국어 라우팅

### 지원 언어
- **한국어** (기본): 완전 지원
- **영어**: 주요 기능 지원
- **중국어**: 기본 기능 지원
- **일본어**: 기본 기능 지원

---

이 가이드라인을 따라 개발하면 한국 편의점의 특성을 잘 반영한 현대적이고 안정적인 웹 플랫폼을 구축할 수 있습니다.