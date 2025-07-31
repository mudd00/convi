import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Clock, Flame } from 'lucide-react'
import { Button } from '../ui/Button'
import { usePromotions, useTimeSaleCountdown } from '../../hooks/usePromotions'
import { TimeSaleMiniWidget } from '../promotion/TimeSale'

/**
 * 메인 이벤트 배너 슬라이더 컴포넌트
 */
export const EventBanner = ({ className = "" }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  
  // 프로모션 데이터 가져오기
  const { data: promotionsData, isLoading } = usePromotions()
  const events = promotionsData?.data || []

  // 기본 배너 데이터 (프로모션 데이터가 없을 때 사용)
  const defaultBanners = [
    {
      id: 'default-1',
      title: '편의점 온라인 쇼핑',
      subtitle: '언제 어디서나 편리하게',
      description: '24시간 온라인 주문 서비스',
      bannerImage: '/images/banners/default-banner.jpg',
      backgroundColor: 'from-blue-500 to-blue-700',
      textColor: 'text-white',
      buttonText: '쇼핑 시작하기',
      link: '/products',
      type: 'default'
    }
  ]

  // 이벤트 데이터를 배너 형태로 변환
  const banners = events.length > 0 ? events.map(event => ({
    id: event.id,
    title: event.title,
    subtitle: event.description,
    description: getEventDescription(event),
    bannerImage: event.bannerImage,
    backgroundColor: getEventBackgroundColor(event.type),
    textColor: 'text-white',
    buttonText: getEventButtonText(event.type),
    link: getEventLink(event),
    type: event.type,
    event: event
  })) : defaultBanners

  // 이벤트 타입별 설명 생성
  const getEventDescription = (event) => {
    const endDate = new Date(event.endDate).toLocaleDateString('ko-KR')
    switch (event.type) {
      case 'time_sale':
        return '한정 시간 특가 혜택!';
      case 'buy_one_get_one':
        return `${endDate}까지 1+1 이벤트`;
      case 'buy_two_get_one':
        return `${endDate}까지 2+1 이벤트`;
      case 'discount':
        return `${endDate}까지 특가 할인`;
      default:
        return event.description;
    }
  }

  // 이벤트 타입별 배경색
  const getEventBackgroundColor = (type) => {
    switch (type) {
      case 'time_sale':
        return 'from-red-500 to-orange-500';
      case 'buy_one_get_one':
        return 'from-green-500 to-green-700';
      case 'buy_two_get_one':
        return 'from-blue-500 to-blue-700';
      case 'discount':
        return 'from-purple-500 to-purple-700';
      default:
        return 'from-gray-500 to-gray-700';
    }
  }

  // 이벤트 타입별 버튼 텍스트
  const getEventButtonText = (type) => {
    switch (type) {
      case 'time_sale':
        return '타임세일 보기';
      case 'buy_one_get_one':
      case 'buy_two_get_one':
        return '이벤트 상품 보기';
      case 'discount':
        return '할인 상품 보기';
      default:
        return '자세히 보기';
    }
  }

  // 이벤트 타입별 링크
  const getEventLink = (event) => {
    switch (event.type) {
      case 'time_sale':
        return '/discounts?type=time_sale';
      case 'buy_one_get_one':
        return '/discounts?type=1plus1';
      case 'buy_two_get_one':
        return '/discounts?type=2plus1';
      case 'discount':
        return '/discounts?type=discount';
      default:
        return '/products';
    }
  }

  // 자동 슬라이드
  useEffect(() => {
    if (!isAutoPlaying || banners.length <= 1) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length)
    }, 5000) // 5초마다 자동 전환

    return () => clearInterval(interval)
  }, [isAutoPlaying, banners.length])

  // 이전 슬라이드
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
    setIsAutoPlaying(false)
  }

  // 다음 슬라이드
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length)
    setIsAutoPlaying(false)
  }

  // 특정 슬라이드로 이동
  const goToSlide = (index) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
  }

  const currentBanner = banners[currentSlide]

  if (isLoading) {
    return (
      <div className={`bg-gray-200 rounded-xl animate-pulse ${className}`}>
        <div className="px-8 py-12 md:px-16 md:py-20">
          <div className="max-w-2xl">
            <div className="h-12 bg-gray-300 rounded mb-4"></div>
            <div className="h-6 bg-gray-300 rounded mb-2 w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded mb-8 w-1/2"></div>
            <div className="h-12 bg-gray-300 rounded w-40"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden rounded-xl ${className}`}>
      {/* 배너 컨테이너 */}
      <div 
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {banners.map((banner) => (
          <BannerSlide key={banner.id} banner={banner} />
        ))}
      </div>

      {/* 네비게이션 버튼 (배너가 2개 이상일 때만 표시) */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-200"
            aria-label="이전 슬라이드"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-200"
            aria-label="다음 슬라이드"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* 인디케이터 */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentSlide
                    ? 'bg-white'
                    : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                }`}
                aria-label={`슬라이드 ${index + 1}로 이동`}
              />
            ))}
          </div>

          {/* 자동재생 컨트롤 */}
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="absolute top-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full text-sm transition-all duration-200"
            aria-label={isAutoPlaying ? '자동재생 중지' : '자동재생 시작'}
          >
            {isAutoPlaying ? '⏸️' : '▶️'}
          </button>

          {/* 진행 바 */}
          {isAutoPlaying && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white bg-opacity-30">
              <div 
                className="h-full bg-white transition-all duration-100 ease-linear"
                style={{ 
                  width: `${((Date.now() % 5000) / 5000) * 100}%`,
                  animation: 'progress 5s linear infinite'
                }}
              />
            </div>
          )}
        </>
      )}

      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  )
}

/**
 * 개별 배너 슬라이드 컴포넌트
 */
const BannerSlide = ({ banner }) => {
  const { timeLeft, isExpired } = useTimeSaleCountdown(
    banner.type === 'time_sale' ? banner.event?.endDate : null
  )

  return (
    <div
      className={`w-full flex-shrink-0 bg-gradient-to-r ${banner.backgroundColor} relative min-h-[300px] md:min-h-[400px]`}
    >
      {/* 배경 이미지 (있는 경우) */}
      {banner.bannerImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${banner.bannerImage})` }}
        />
      )}
      
      {/* 컨텐츠 */}
      <div className="relative z-10 px-8 py-12 md:px-16 md:py-20 h-full flex items-center">
        <div className="max-w-2xl">
          {/* 타임세일 특별 표시 */}
          {banner.type === 'time_sale' && !isExpired && (
            <div className="flex items-center gap-2 mb-4">
              <Flame className="w-6 h-6 text-yellow-300" />
              <span className="bg-black bg-opacity-30 text-white px-3 py-1 rounded-full text-sm font-bold">
                타임세일
              </span>
              {timeLeft && (
                <span className="bg-black bg-opacity-30 text-white px-3 py-1 rounded-full text-sm font-mono">
                  {timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}
                </span>
              )}
            </div>
          )}

          <h2 className={`text-3xl md:text-5xl font-bold mb-4 ${banner.textColor}`}>
            {banner.title}
          </h2>
          <p className={`text-xl md:text-2xl mb-2 ${banner.textColor} opacity-90`}>
            {banner.subtitle}
          </p>
          <p className={`text-base md:text-lg mb-8 ${banner.textColor} opacity-80`}>
            {banner.description}
          </p>
          
          {/* 타임세일이 만료되지 않았거나 다른 타입의 이벤트인 경우 버튼 표시 */}
          {(banner.type !== 'time_sale' || !isExpired) && (
            <Button
              size="lg"
              className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-8 py-3"
              onClick={() => window.location.href = banner.link}
            >
              {banner.buttonText}
            </Button>
          )}

          {/* 타임세일 만료 시 메시지 */}
          {banner.type === 'time_sale' && isExpired && (
            <div className="bg-black bg-opacity-30 text-white px-4 py-2 rounded-lg inline-block">
              <Clock className="w-4 h-4 inline mr-2" />
              타임세일이 종료되었습니다
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EventBanner