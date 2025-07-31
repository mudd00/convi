import { useState } from 'react'
import { Plus, Minus, Calendar, Filter } from 'lucide-react'
import { Card, Button } from '@/components/ui'
import { formatPrice, formatDate, formatRelativeTime } from '@/utils/format'

/**
 * 포인트 적립/사용 내역 컴포넌트
 */
export const PointHistory = ({ className = "" }) => {
  const [filter, setFilter] = useState('all') // 'all' | 'earned' | 'used'
  const [period, setPeriod] = useState('3months') // '1month' | '3months' | '6months' | '1year'

  // 임시 포인트 내역 데이터
  const pointHistory = [
    {
      id: '1',
      type: 'earned',
      amount: 150,
      description: '상품 구매 적립',
      orderNumber: 'ORD-2024-001',
      date: new Date('2024-01-15T14:30:00'),
      balance: 2150
    },
    {
      id: '2',
      type: 'used',
      amount: -500,
      description: '포인트 사용',
      orderNumber: 'ORD-2024-002',
      date: new Date('2024-01-14T10:15:00'),
      balance: 2000
    },
    {
      id: '3',
      type: 'earned',
      amount: 200,
      description: '리뷰 작성 보너스',
      date: new Date('2024-01-13T16:45:00'),
      balance: 2500
    },
    {
      id: '4',
      type: 'earned',
      amount: 100,
      description: '생일 축하 포인트',
      date: new Date('2024-01-10T00:00:00'),
      balance: 2300
    },
    {
      id: '5',
      type: 'used',
      amount: -300,
      description: '포인트 사용',
      orderNumber: 'ORD-2024-003',
      date: new Date('2024-01-08T12:20:00'),
      balance: 2200
    }
  ]

  // 필터링된 내역
  const filteredHistory = pointHistory.filter(item => {
    if (filter === 'earned') return item.type === 'earned'
    if (filter === 'used') return item.type === 'used'
    return true
  })

  // 포인트 타입별 아이콘 및 색상
  const getPointTypeInfo = (type, amount) => {
    if (type === 'earned') {
      return {
        icon: Plus,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        sign: '+'
      }
    } else {
      return {
        icon: Minus,
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        sign: ''
      }
    }
  }

  // 기간별 통계
  const getStatistics = () => {
    const earned = pointHistory
      .filter(item => item.type === 'earned')
      .reduce((sum, item) => sum + item.amount, 0)
    
    const used = pointHistory
      .filter(item => item.type === 'used')
      .reduce((sum, item) => sum + Math.abs(item.amount), 0)

    return { earned, used }
  }

  const stats = getStatistics()

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 포인트 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">적립 포인트</p>
              <p className="text-2xl font-bold text-green-600">
                +{formatPrice(stats.earned)}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Plus className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">사용 포인트</p>
              <p className="text-2xl font-bold text-red-600">
                -{formatPrice(stats.used)}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <Minus className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">순 증감</p>
              <p className={`text-2xl font-bold ${
                stats.earned - stats.used >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {stats.earned - stats.used >= 0 ? '+' : ''}
                {formatPrice(stats.earned - stats.used)}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* 필터 및 기간 선택 */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
          {/* 타입 필터 */}
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <Button
                variant={filter === 'all' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                전체
              </Button>
              <Button
                variant={filter === 'earned' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilter('earned')}
              >
                적립
              </Button>
              <Button
                variant={filter === 'used' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilter('used')}
              >
                사용
              </Button>
            </div>
          </div>

          {/* 기간 선택 */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {[
              { value: '1month', label: '1개월' },
              { value: '3months', label: '3개월' },
              { value: '6months', label: '6개월' },
              { value: '1year', label: '1년' }
            ].map((option) => (
              <Button
                key={option.value}
                variant={period === option.value ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setPeriod(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* 포인트 내역 목록 */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            포인트 내역 ({filteredHistory.length}건)
          </h3>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredHistory.length > 0 ? (
            filteredHistory.map((item) => {
              const typeInfo = getPointTypeInfo(item.type, item.amount)
              const IconComponent = typeInfo.icon

              return (
                <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${typeInfo.bgColor}`}>
                        <IconComponent className={`h-5 w-5 ${typeInfo.color}`} />
                      </div>
                      
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {item.description}
                        </p>
                        {item.orderNumber && (
                          <p className="text-sm text-gray-500">
                            주문번호: {item.orderNumber}
                          </p>
                        )}
                        <p className="text-sm text-gray-500">
                          {formatDate(item.date)} ({formatRelativeTime(item.date)})
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className={`text-lg font-semibold ${typeInfo.color}`}>
                        {typeInfo.sign}{formatPrice(Math.abs(item.amount))}P
                      </p>
                      <p className="text-sm text-gray-500">
                        잔액: {formatPrice(item.balance)}P
                      </p>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">💰</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                포인트 내역이 없습니다
              </h3>
              <p className="text-gray-600">
                상품을 구매하거나 활동을 통해 포인트를 적립해보세요!
              </p>
            </div>
          )}
        </div>

        {/* 더 보기 버튼 */}
        {filteredHistory.length > 0 && (
          <div className="p-4 border-t border-gray-200 text-center">
            <Button variant="outline">
              더 보기
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}

export default PointHistory