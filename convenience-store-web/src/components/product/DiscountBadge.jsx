import React from 'react';
import { calculateDiscount } from '../../hooks/usePromotions';

/**
 * 할인 정보를 표시하는 배지 컴포넌트
 * @param {Object} props
 * @param {number} props.originalPrice - 원가
 * @param {number} props.discountPrice - 할인가 (선택사항)
 * @param {string} props.discountType - 할인 타입 ('percentage' | 'fixed')
 * @param {number} props.discountValue - 할인 값
 * @param {string} props.promotionType - 프로모션 타입 ('discount' | 'buy_one_get_one' | 'time_sale')
 * @param {string} props.size - 배지 크기 ('sm' | 'md' | 'lg')
 * @param {string} props.className - 추가 CSS 클래스
 */
const DiscountBadge = ({
  originalPrice,
  discountPrice,
  discountType,
  discountValue,
  promotionType,
  size = 'md',
  className = ''
}) => {
  // 할인이 없는 경우 렌더링하지 않음
  if (!promotionType || (!discountType && !discountPrice)) {
    return null;
  }

  // 할인 정보 계산
  const discountInfo = discountPrice 
    ? {
        discountAmount: originalPrice - discountPrice,
        finalPrice: discountPrice,
        discountRate: Math.floor(((originalPrice - discountPrice) / originalPrice) * 100)
      }
    : calculateDiscount(originalPrice, discountType, discountValue);

  // 프로모션 타입별 스타일 및 텍스트
  const getPromotionStyle = () => {
    switch (promotionType) {
      case 'buy_one_get_one':
        return {
          bgColor: 'bg-green-500',
          textColor: 'text-white',
          label: '1+1'
        };
      case 'buy_two_get_one':
        return {
          bgColor: 'bg-blue-500',
          textColor: 'text-white',
          label: '2+1'
        };
      case 'time_sale':
        return {
          bgColor: 'bg-red-500',
          textColor: 'text-white',
          label: `${discountInfo.discountRate}%`
        };
      case 'discount':
      default:
        return {
          bgColor: 'bg-orange-500',
          textColor: 'text-white',
          label: `${discountInfo.discountRate}%`
        };
    }
  };

  // 크기별 스타일
  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return 'px-1.5 py-0.5 text-xs';
      case 'lg':
        return 'px-3 py-1.5 text-base';
      case 'md':
      default:
        return 'px-2 py-1 text-sm';
    }
  };

  const promotionStyle = getPromotionStyle();
  const sizeStyle = getSizeStyle();

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {/* 할인 배지 */}
      <span
        className={`
          ${promotionStyle.bgColor} 
          ${promotionStyle.textColor} 
          ${sizeStyle}
          font-bold rounded-md shadow-sm
        `}
      >
        {promotionStyle.label}
      </span>

      {/* 가격 정보 */}
      {discountInfo.discountAmount > 0 && (
        <div className="flex flex-col">
          {/* 할인가 */}
          <span className="font-bold text-red-600">
            {discountInfo.finalPrice.toLocaleString()}원
          </span>
          
          {/* 원가 (취소선) */}
          <span className="text-sm text-gray-500 line-through">
            {originalPrice.toLocaleString()}원
          </span>
        </div>
      )}

      {/* 1+1, 2+1 등의 경우 원가만 표시 */}
      {(promotionType === 'buy_one_get_one' || promotionType === 'buy_two_get_one') && (
        <span className="font-bold text-gray-900">
          {originalPrice.toLocaleString()}원
        </span>
      )}
    </div>
  );
};

/**
 * 간단한 할인율 배지 (상품 카드용)
 */
export const SimpleDiscountBadge = ({ 
  discountRate, 
  promotionType, 
  className = '' 
}) => {
  if (!promotionType || discountRate <= 0) {
    return null;
  }

  const getPromotionConfig = () => {
    switch (promotionType) {
      case 'buy_one_get_one':
        return { label: '1+1', color: 'bg-green-500' };
      case 'buy_two_get_one':
        return { label: '2+1', color: 'bg-blue-500' };
      case 'time_sale':
        return { label: `${discountRate}%`, color: 'bg-red-500' };
      default:
        return { label: `${discountRate}%`, color: 'bg-orange-500' };
    }
  };

  const config = getPromotionConfig();

  return (
    <div
      className={`
        absolute top-2 left-2 
        ${config.color} text-white 
        px-2 py-1 text-xs font-bold rounded-md
        shadow-md z-10
        ${className}
      `}
    >
      {config.label}
    </div>
  );
};

/**
 * 타임세일 전용 배지 (카운트다운 포함)
 */
export const TimeSaleBadge = ({ 
  discountRate, 
  timeLeft, 
  isExpired, 
  className = '' 
}) => {
  if (isExpired) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <span className="bg-gray-400 text-white px-2 py-1 text-sm font-bold rounded-md">
          종료됨
        </span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span className="bg-red-500 text-white px-2 py-1 text-sm font-bold rounded-md animate-pulse">
        타임세일 {discountRate}%
      </span>
      {timeLeft && (
        <span className="text-red-600 font-mono text-sm">
          {timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}
        </span>
      )}
    </div>
  );
};

export default DiscountBadge;