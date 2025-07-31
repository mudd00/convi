import { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Header, Footer } from '@/components/layout'
import ErrorBoundary from '@/components/ErrorBoundary'
import { FullScreenLoading } from '@/components/ui'
import './styles/globals.css'

// QueryClient 인스턴스 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // 401, 403, 404 에러는 재시도하지 않음
        if (error?.status && [401, 403, 404].includes(error.status)) {
          return false
        }
        return failureCount < 3
      },
      staleTime: 5 * 60 * 1000, // 5분
      cacheTime: 10 * 60 * 1000, // 10분
      refetchOnWindowFocus: false,
      refetchOnReconnect: true
    },
    mutations: {
      retry: (failureCount, error) => {
        // 클라이언트 에러는 재시도하지 않음
        if (error?.status && error.status >= 400 && error.status < 500) {
          return false
        }
        return failureCount < 2
      }
    }
  }
})

// 코드 스플리팅을 위한 lazy loading
const HomePage = lazy(() => import('@/pages/HomePage'))
const ProductsPage = lazy(() => import('@/pages/ProductsPage'))
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'))
const StoresPage = lazy(() => import('@/pages/StoresPage'))
const OrdersPage = lazy(() => import('@/pages/OrdersPage'))
const ProfilePage = lazy(() => import('@/pages/ProfilePage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'))
const DiscountsPage = lazy(() => import('@/pages/DiscountsPage'))
const CouponsPage = lazy(() => import('@/pages/CouponsPage'))
const WishlistPage = lazy(() => import('@/pages/WishlistPage'))
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage'))
const SupportPage = lazy(() => import('@/pages/SupportPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <Router>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* 헤더 */}
            <Header />
            
            {/* 메인 컨텐츠 */}
            <main className="flex-1">
              <Suspense fallback={<FullScreenLoading message="페이지를 불러오는 중..." />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/products/:id" element={<ProductDetailPage />} />
                  <Route path="/stores" element={<StoresPage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/discounts" element={<DiscountsPage />} />
                  <Route path="/coupons" element={<CouponsPage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/support" element={<SupportPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </main>
            
            {/* 푸터 */}
            <Footer />
          </div>
        </Router>
      </ErrorBoundary>
      
      {/* React Query Devtools (개발 환경에서만) */}
      {/* {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />} */}
    </QueryClientProvider>
  )
}

export default App
