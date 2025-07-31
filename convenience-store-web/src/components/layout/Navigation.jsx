import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

/**
 * 네비게이션 컴포넌트
 * 모바일 햄버거 메뉴 및 데스크톱 네비게이션
 */
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  // 네비게이션 메뉴 항목
  const navItems = [
    {
      path: '/',
      label: '홈',
      icon: '🏠',
      description: '메인 페이지'
    },
    {
      path: '/products',
      label: '상품',
      icon: '🛒',
      description: '상품 둘러보기'
    },
    {
      path: '/stores',
      label: '매장찾기',
      icon: '🏪',
      description: '가까운 매장 찾기'
    },
    {
      path: '/orders',
      label: '주문내역',
      icon: '📦',
      description: '주문 상태 확인'
    },
    {
      path: '/profile',
      label: '마이페이지',
      icon: '👤',
      description: '계정 관리'
    }
  ]

  // 현재 경로 확인
  const isActivePath = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <>
      {/* 데스크톱 네비게이션 */}
      <nav className="hidden lg:flex items-center space-x-8">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              isActivePath(item.path)
                ? 'text-primary bg-primary-50'
                : 'text-gray-700 hover:text-primary hover:bg-gray-50'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* 모바일 햄버거 메뉴 버튼 */}
      <button
        className="lg:hidden p-2 text-gray-700 hover:text-primary transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="메뉴 열기/닫기"
      >
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* 모바일 메뉴 오버레이 */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* 배경 오버레이 */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          />
          
          {/* 메뉴 패널 */}
          <div className="fixed top-0 right-0 h-full w-80 max-w-full bg-white shadow-xl">
            <div className="flex flex-col h-full">
              {/* 메뉴 헤더 */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">메뉴</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="메뉴 닫기"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* 메뉴 항목들 */}
              <nav className="flex-1 p-6">
                <div className="space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center space-x-4 p-4 rounded-lg transition-colors ${
                        isActivePath(item.path)
                          ? 'text-primary bg-primary-50 border border-primary-200'
                          : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <div className="font-medium">{item.label}</div>
                        <div className="text-sm text-gray-500">{item.description}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </nav>

              {/* 메뉴 푸터 */}
              <div className="p-6 border-t border-gray-200">
                <div className="space-y-3">
                  <button className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors">
                    로그인
                  </button>
                  <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                    회원가입
                  </button>
                </div>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500">고객센터</p>
                  <p className="text-lg font-semibold text-gray-900">1588-1234</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Navigation