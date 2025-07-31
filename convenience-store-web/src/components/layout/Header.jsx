import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import CartDrawer from '@/components/cart/CartDrawer'
import { useCartStore } from '@/stores/cartStore'

/**
 * 헤더 컴포넌트
 * 로고, 네비게이션, 검색바, 장바구니 아이콘 포함
 */
const Header = () => {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isCartOpen, setIsCartOpen] = useState(false)
  
  const { items } = useCartStore()

  // 네비게이션 메뉴 항목
  const navItems = [
    { path: '/', label: '홈', icon: '🏠' },
    { path: '/products', label: '상품', icon: '🛒' },
    { path: '/stores', label: '매장찾기', icon: '🏪' },
    { path: '/orders', label: '주문내역', icon: '📦' },
    { path: '/profile', label: '마이페이지', icon: '👤' }
  ]

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        {/* 메인 헤더 */}
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">편</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">
              편의점
            </span>
          </Link>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center space-x-1 text-gray-700 hover:text-primary transition-colors"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* 검색바 (데스크톱) */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <Input
              placeholder="상품을 검색하세요..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
          </div>

          {/* 우측 액션 버튼들 */}
          <div className="flex items-center space-x-4">
            {/* 장바구니 */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-700 hover:text-primary transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {/* 장바구니 아이템 수 배지 */}
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </button>

            {/* 로그인/회원가입 */}
            <div className="hidden sm:flex items-center space-x-2">
              <Button variant="outline" size="sm">
                로그인
              </Button>
              <Button size="sm">
                회원가입
              </Button>
            </div>

            {/* 모바일 메뉴 버튼 */}
            <button
              className="lg:hidden p-2 text-gray-700 hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* 모바일 검색바 */}
        <div className="md:hidden pb-4">
          <Input
            placeholder="상품을 검색하세요..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <nav className="container mx-auto px-4 py-4">
            <div className="space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center space-x-3 text-gray-700 hover:text-primary transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
              
              {/* 모바일 로그인/회원가입 */}
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <Button variant="outline" className="w-full">
                  로그인
                </Button>
                <Button className="w-full">
                  회원가입
                </Button>
              </div>
            </div>
          </nav>
        </div>
      )}

      {/* 장바구니 드로어 */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => navigate('/checkout')}
      />
    </header>
  )
}

export default Header