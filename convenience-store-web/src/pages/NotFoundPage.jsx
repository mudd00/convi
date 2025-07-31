import { Link } from 'react-router-dom'
import { Button } from '@/components/ui'

/**
 * 404 페이지 컴포넌트
 * 존재하지 않는 페이지에 접근했을 때 표시
 */
const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 일러스트 */}
        <div className="text-8xl mb-6">🔍</div>
        
        {/* 메인 메시지 */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          페이지를 찾을 수 없습니다
        </h2>
        <p className="text-gray-600 mb-8">
          요청하신 페이지가 존재하지 않거나<br />
          이동되었을 수 있습니다.
        </p>

        {/* 액션 버튼들 */}
        <div className="space-y-3 mb-8">
          <Link to="/">
            <Button className="w-full">
              홈으로 돌아가기
            </Button>
          </Link>
          <Link to="/products">
            <Button variant="outline" className="w-full">
              상품 둘러보기
            </Button>
          </Link>
        </div>

        {/* 추천 링크들 */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            이런 페이지는 어떠세요?
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Link 
              to="/stores"
              className="p-3 bg-white rounded-lg border border-gray-200 hover:border-primary hover:shadow-sm transition-all text-center"
            >
              <div className="text-2xl mb-1">🏪</div>
              <div className="text-sm font-medium text-gray-700">매장찾기</div>
            </Link>
            <Link 
              to="/orders"
              className="p-3 bg-white rounded-lg border border-gray-200 hover:border-primary hover:shadow-sm transition-all text-center"
            >
              <div className="text-2xl mb-1">📦</div>
              <div className="text-sm font-medium text-gray-700">주문내역</div>
            </Link>
          </div>
        </div>

        {/* 고객센터 정보 */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-2">
            도움이 필요하시면 고객센터로 문의해주세요
          </p>
          <p className="text-sm font-medium text-gray-700">
            📞 1588-1234 (24시간 운영)
          </p>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage