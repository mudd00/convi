import { useState } from 'react'
import { Card, Button } from '@/components/ui'

/**
 * 주문 내역 페이지 컴포넌트
 * 주문 내역 조회, 주문 상태 확인 기능
 */
const OrdersPage = () => {
  const [activeTab, setActiveTab] = useState('all')

  // 임시 주문 데이터
  const orders = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      status: 'completed',
      statusText: '완료',
      store: 'GS25 강남점',
      items: [
        { name: '참치마요 삼각김밥', quantity: 2, price: 1500 },
        { name: '코카콜라 500ml', quantity: 1, price: 1800 }
      ],
      total: 4800,
      pickupTime: '14:30'
    },
    {
      id: 'ORD-002',
      date: '2024-01-14',
      status: 'ready',
      statusText: '픽업 대기',
      store: 'CU 역삼점',
      items: [
        { name: '김치볶음밥', quantity: 1, price: 4500 },
        { name: '허니버터칩', quantity: 1, price: 2200 }
      ],
      total: 6700,
      pickupTime: '18:00'
    },
    {
      id: 'ORD-003',
      date: '2024-01-13',
      status: 'preparing',
      statusText: '준비 중',
      store: '세븐일레븐 선릉점',
      items: [
        { name: '바닐라 아이스크림', quantity: 2, price: 3000 }
      ],
      total: 6000,
      pickupTime: '16:45'
    }
  ]

  // 상태별 필터링
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true
    return order.status === activeTab
  })

  // 상태별 색상 매핑
  const statusColors = {
    completed: 'bg-green-100 text-green-800',
    ready: 'bg-blue-100 text-blue-800',
    preparing: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 페이지 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">주문 내역</h1>
          <p className="text-gray-600">주문 상태를 확인하고 관리하세요</p>
        </div>

        {/* 탭 메뉴 */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeTab === 'all' ? 'primary' : 'outline'}
              onClick={() => setActiveTab('all')}
            >
              전체
            </Button>
            <Button
              variant={activeTab === 'preparing' ? 'primary' : 'outline'}
              onClick={() => setActiveTab('preparing')}
            >
              준비 중
            </Button>
            <Button
              variant={activeTab === 'ready' ? 'primary' : 'outline'}
              onClick={() => setActiveTab('ready')}
            >
              픽업 대기
            </Button>
            <Button
              variant={activeTab === 'completed' ? 'primary' : 'outline'}
              onClick={() => setActiveTab('completed')}
            >
              완료
            </Button>
          </div>
        </div>

        {/* 주문 목록 */}
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="p-6">
              {/* 주문 헤더 */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 pb-4 border-b border-gray-200">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      주문번호: {order.id}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
                      {order.statusText}
                    </span>
                  </div>
                  <div className="text-gray-600 space-y-1">
                    <p>📅 주문일시: {order.date}</p>
                    <p>🏪 매장: {order.store}</p>
                    <p>🕒 픽업 예정: {order.pickupTime}</p>
                  </div>
                </div>
                
                <div className="text-right mt-4 lg:mt-0">
                  <p className="text-2xl font-bold text-primary">
                    {order.total.toLocaleString()}원
                  </p>
                </div>
              </div>

              {/* 주문 상품 목록 */}
              <div className="space-y-3 mb-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <span className="text-gray-500 ml-2">x{item.quantity}</span>
                    </div>
                    <span className="font-medium">
                      {(item.price * item.quantity).toLocaleString()}원
                    </span>
                  </div>
                ))}
              </div>

              {/* 액션 버튼들 */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                <Button variant="outline" className="flex-1">
                  주문 상세보기
                </Button>
                {order.status === 'completed' && (
                  <Button className="flex-1">
                    재주문하기
                  </Button>
                )}
                {order.status === 'ready' && (
                  <Button className="flex-1">
                    픽업 완료
                  </Button>
                )}
                {(order.status === 'preparing' || order.status === 'ready') && (
                  <Button variant="outline" className="flex-1 text-red-600 border-red-300 hover:bg-red-50">
                    주문 취소
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* 주문이 없을 때 */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              주문 내역이 없습니다
            </h3>
            <p className="text-gray-600 mb-6">
              첫 주문을 시작해보세요!
            </p>
            <Button>
              상품 둘러보기
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrdersPage