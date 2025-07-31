import React from 'react';
import { Clock, Flame } from 'lucide-react';
import { useTimeSaleCountdown } from '../../hooks/usePromotions';
import { TimeSaleBadge } from '../product/DiscountBadge';

/**
 * 타임세일 컴포넌트
 * @param {Object} props
 * @param {Object} props.event - 타임세일 이벤트 정보
 * @param {Array} props.products - 타임세일 상품 목록
 * @param {Function} props.onProductClick - 상품 클릭 핸들러
 */
const TimeSale = ({ event, products = [], onProductClick }) => {
  const { timeLeft, isExpired } = useTimeSaleCountdown(event?.endDate);

  if (!event || isExpired) {
    return (
      <div className="bg-gray-100 rounded-lg p-6 text-center">
        <div className="text-gray-500 mb-2">
          <Clock className="w-8 h-8 mx-auto mb-2" />
          <p className="text-lg font-semibold">타임세일이 종료되었습니다</p>
          <p className="text-sm">다음 타임세일을 기대해주세요!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-lg p-6 text-white shadow-lg">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Flame className="w-6 h-6 text-yellow-300" />
          <h2 className="text-xl font-bold">타임세일</h2>
        </div>
        
        {/* 카운트다운 타이머 */}
        <div className="bg-black bg-opacity-30 rounded-lg px-4 py-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className="font-mono text-lg font-bold">
              {timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}
            </span>
          </div>
          <p className="text-xs text-center mt-1">남은 시간</p>
        </div>
      </div>

      {/* 이벤트 설명 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
        <p className="text-sm opacity-90">{event.description}</p>
      </div>

      {/* 상품 목록 */}
      {products.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <TimeSaleProductCard
              key={product.id}
              product={product}
              discountValue={event.discountValue}
              onClick={() => onProductClick?.(product)}
            />
          ))}
        </div>
      )}

      {/* 주의사항 */}
      <div className="mt-6 pt-4 border-t border-white border-opacity-30">
        <p className="text-xs opacity-75">
          * 타임세일은 한정 시간 동안만 진행됩니다. 
          * 재고 소진 시 조기 종료될 수 있습니다.
        </p>
      </div>
    </div>
  );
};

/**
 * 타임세일 상품 카드
 */
const TimeSaleProductCard = ({ product, discountValue, onClick }) => {
  const discountAmount = Math.floor(product.originalPrice * (discountValue / 100));
  const finalPrice = product.originalPrice - discountAmount;

  return (
    <div
      className="bg-white rounded-lg p-3 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      {/* 상품 이미지 */}
      <div className="relative mb-2">
        <img
          src={product.image || '/images/placeholder-product.jpg'}
          alt={product.name}
          className="w-full h-24 object-cover rounded-md"
        />
        <div className="absolute top-1 right-1">
          <TimeSaleBadge
            discountRate={discountValue}
            className="text-xs"
          />
        </div>
      </div>

      {/* 상품 정보 */}
      <div className="text-gray-900">
        <h4 className="text-sm font-semibold mb-1 line-clamp-2">
          {product.name}
        </h4>
        
        {/* 가격 정보 */}
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <span className="text-lg font-bold text-red-600">
              {finalPrice.toLocaleString()}원
            </span>
          </div>
          <div className="text-xs text-gray-500 line-through">
            {product.originalPrice.toLocaleString()}원
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 타임세일 미니 위젯 (메인 페이지용)
 */
export const TimeSaleMiniWidget = ({ event, className = '' }) => {
  const { timeLeft, isExpired } = useTimeSaleCountdown(event?.endDate);

  if (!event || isExpired) {
    return null;
  }

  return (
    <div className={`bg-red-500 text-white rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-yellow-300" />
          <span className="font-bold">타임세일</span>
        </div>
        <div className="text-right">
          <div className="font-mono text-sm">
            {timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}
          </div>
          <div className="text-xs opacity-75">남은 시간</div>
        </div>
      </div>
      <div className="mt-2">
        <p className="text-sm font-semibold">{event.title}</p>
        <p className="text-xs opacity-90">{event.discountValue}% 할인</p>
      </div>
    </div>
  );
};

export default TimeSale;