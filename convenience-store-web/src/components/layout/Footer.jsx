import { Link } from 'react-router-dom'

/**
 * 푸터 컴포넌트
 * 회사 정보, 링크, 고객센터 정보 포함
 */
const Footer = () => {
  const currentYear = new Date().getFullYear()

  // 푸터 링크 그룹
  const linkGroups = [
    {
      title: '서비스',
      links: [
        { label: '상품 주문', path: '/products' },
        { label: '매장 찾기', path: '/stores' },
        { label: '주문 내역', path: '/orders' },
        { label: '멤버십', path: '/profile' }
      ]
    },
    {
      title: '고객지원',
      links: [
        { label: '자주 묻는 질문', path: '/faq' },
        { label: '공지사항', path: '/notices' },
        { label: '1:1 문의', path: '/inquiry' },
        { label: '이용약관', path: '/terms' }
      ]
    },
    {
      title: '회사소개',
      links: [
        { label: '회사 소개', path: '/about' },
        { label: '채용 정보', path: '/careers' },
        { label: '제휴 문의', path: '/partnership' },
        { label: '개인정보처리방침', path: '/privacy' }
      ]
    }
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* 메인 푸터 컨텐츠 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* 회사 정보 */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">편</span>
              </div>
              <span className="text-xl font-bold">편의점</span>
            </div>
            <p className="text-gray-400 mb-4">
              24시간 언제나 편리한 쇼핑을<br />
              경험할 수 있는 온라인 편의점입니다.
            </p>
            
            {/* 소셜 미디어 링크 */}
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                📘
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                📷
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                🐦
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">YouTube</span>
                📺
              </a>
            </div>
          </div>

          {/* 링크 그룹들 */}
          {linkGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-lg font-semibold mb-4">{group.title}</h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 고객센터 정보 */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">고객센터</h3>
              <div className="space-y-2 text-gray-400">
                <p className="flex items-center space-x-2">
                  <span>📞</span>
                  <span>1588-1234 (24시간 운영)</span>
                </p>
                <p className="flex items-center space-x-2">
                  <span>✉️</span>
                  <span>support@convenience-store.co.kr</span>
                </p>
                <p className="flex items-center space-x-2">
                  <span>💬</span>
                  <span>카카오톡 상담: @편의점</span>
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">사업자 정보</h3>
              <div className="space-y-1 text-gray-400 text-sm">
                <p>상호명: (주)편의점</p>
                <p>대표자: 홍길동</p>
                <p>사업자등록번호: 123-45-67890</p>
                <p>통신판매업신고번호: 제2024-서울강남-1234호</p>
                <p>주소: 서울시 강남구 테헤란로 123, 편의점빌딩 10층</p>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 저작권 */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} 편의점. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer