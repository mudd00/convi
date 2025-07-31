import { Card } from '@/components/ui'

/**
 * 홈페이지 컴포넌트
 * 메인 배너, 추천 상품, 이벤트 등을 표시
 */
const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 메인 배너 섹션 */}
      <section className="bg-gradient-to-r from-primary to-primary-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            한국 편의점 웹사이트
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            24시간 언제나 편리한 쇼핑을 경험하세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              상품 둘러보기
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors">
              매장 찾기
            </button>
          </div>
        </div>
      </section>

      {/* 주요 서비스 섹션 */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            주요 서비스
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🛒</div>
              <h3 className="text-xl font-semibold mb-2">온라인 주문</h3>
              <p className="text-gray-600">
                집에서 편리하게 주문하고 매장에서 픽업하세요
              </p>
            </Card>
            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🏪</div>
              <h3 className="text-xl font-semibold mb-2">매장 찾기</h3>
              <p className="text-gray-600">
                가까운 편의점을 찾고 운영시간을 확인하세요
              </p>
            </Card>
            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🎁</div>
              <h3 className="text-xl font-semibold mb-2">할인 혜택</h3>
              <p className="text-gray-600">
                다양한 할인 이벤트와 쿠폰을 만나보세요
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 추천 상품 섹션 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            추천 상품
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <Card key={item} className="p-4 hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-gray-500">상품 이미지</span>
                </div>
                <h3 className="font-semibold mb-1">추천 상품 {item}</h3>
                <p className="text-primary font-bold">1,500원</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage