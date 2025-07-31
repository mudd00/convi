import React, { useState } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { useIsInWishlist, useToggleWishlist } from '../../hooks/useWishlist';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../ui/Button';

/**
 * 관심 상품 추가/제거 버튼 컴포넌트
 * @param {Object} props
 * @param {string} props.productId - 상품 ID
 * @param {string} props.variant - 버튼 스타일 ('icon' | 'button' | 'floating')
 * @param {string} props.size - 버튼 크기 ('sm' | 'md' | 'lg')
 * @param {string} props.className - 추가 CSS 클래스
 * @param {Function} props.onToggle - 토글 시 콜백 함수
 * @param {Object} props.notificationOptions - 알림 설정 옵션
 */
const WishlistButton = ({
  productId,
  variant = 'icon',
  size = 'md',
  className = '',
  onToggle,
  notificationOptions = { notifyOnSale: true, notifyOnRestock: false }
}) => {
  const { isAuthenticated } = useAuthStore();
  const [showTooltip, setShowTooltip] = useState(false);

  // 관심 상품 상태 확인
  const { data: wishlistCheck, isLoading: isCheckingWishlist } = useIsInWishlist(productId);
  const isInWishlist = wishlistCheck?.isInWishlist || false;

  // 관심 상품 토글
  const { toggleWishlist, isLoading } = useToggleWishlist();

  // 클릭 핸들러
  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      window.location.href = '/login';
      return;
    }

    try {
      const result = await toggleWishlist(productId, isInWishlist, notificationOptions);
      
      // 성공 메시지 표시
      if (result.action === 'added') {
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 2000);
      }

      // 부모 컴포넌트에 결과 전달
      onToggle?.(result);
    } catch (error) {
      console.error('관심 상품 토글 실패:', error);
      alert('오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  // 크기별 스타일
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          icon: 'w-4 h-4',
          button: 'px-2 py-1 text-xs',
          floating: 'w-8 h-8'
        };
      case 'lg':
        return {
          icon: 'w-6 h-6',
          button: 'px-4 py-2 text-base',
          floating: 'w-12 h-12'
        };
      case 'md':
      default:
        return {
          icon: 'w-5 h-5',
          button: 'px-3 py-1.5 text-sm',
          floating: 'w-10 h-10'
        };
    }
  };

  const sizeStyles = getSizeStyles();

  // 로딩 중이거나 확인 중일 때
  if (isLoading || isCheckingWishlist) {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <Loader2 className={`${sizeStyles.icon} animate-spin text-gray-400`} />
      </div>
    );
  }

  // 아이콘 버튼 스타일
  if (variant === 'icon') {
    return (
      <div className="relative">
        <button
          onClick={handleClick}
          className={`
            inline-flex items-center justify-center
            transition-all duration-200 hover:scale-110
            ${className}
          `}
          aria-label={isInWishlist ? '관심 상품에서 제거' : '관심 상품에 추가'}
        >
          <Heart
            className={`
              ${sizeStyles.icon}
              transition-colors duration-200
              ${isInWishlist 
                ? 'fill-red-500 text-red-500' 
                : 'text-gray-400 hover:text-red-500'
              }
            `}
          />
        </button>

        {/* 추가 완료 툴팁 */}
        {showTooltip && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
            관심 상품에 추가됨
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-2 border-transparent border-t-black"></div>
          </div>
        )}
      </div>
    );
  }

  // 플로팅 버튼 스타일
  if (variant === 'floating') {
    return (
      <div className="relative">
        <button
          onClick={handleClick}
          className={`
            ${sizeStyles.floating}
            fixed bottom-20 right-4 z-50
            bg-white shadow-lg rounded-full
            flex items-center justify-center
            border-2 transition-all duration-200
            hover:scale-110 hover:shadow-xl
            ${isInWishlist 
              ? 'border-red-500 bg-red-50' 
              : 'border-gray-300 hover:border-red-500'
            }
            ${className}
          `}
          aria-label={isInWishlist ? '관심 상품에서 제거' : '관심 상품에 추가'}
        >
          <Heart
            className={`
              ${sizeStyles.icon}
              ${isInWishlist 
                ? 'fill-red-500 text-red-500' 
                : 'text-gray-600'
              }
            `}
          />
        </button>

        {showTooltip && (
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            관심 상품에 추가됨
          </div>
        )}
      </div>
    );
  }

  // 일반 버튼 스타일
  return (
    <Button
      onClick={handleClick}
      variant={isInWishlist ? 'solid' : 'outline'}
      size={size}
      className={`
        flex items-center gap-2
        ${isInWishlist 
          ? 'bg-red-500 text-white hover:bg-red-600' 
          : 'border-red-500 text-red-500 hover:bg-red-50'
        }
        ${className}
      `}
    >
      <Heart
        className={`
          ${sizeStyles.icon}
          ${isInWishlist ? 'fill-current' : ''}
        `}
      />
      {isInWishlist ? '관심 상품 제거' : '관심 상품 추가'}
    </Button>
  );
};

/**
 * 관심 상품 개수 표시 배지
 */
export const WishlistBadge = ({ count, className = '' }) => {
  if (!count || count === 0) return null;

  return (
    <span className={`
      absolute -top-1 -right-1 
      bg-red-500 text-white text-xs 
      rounded-full w-5 h-5 
      flex items-center justify-center
      font-bold
      ${className}
    `}>
      {count > 99 ? '99+' : count}
    </span>
  );
};

/**
 * 관심 상품 상태 표시 아이콘
 */
export const WishlistStatusIcon = ({ 
  isInWishlist, 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <Heart
      className={`
        ${sizeClasses[size]}
        transition-colors duration-200
        ${isInWishlist 
          ? 'fill-red-500 text-red-500' 
          : 'text-gray-300'
        }
        ${className}
      `}
    />
  );
};

/**
 * 관심 상품 빠른 추가 버튼 (상품 카드용)
 */
export const QuickWishlistButton = ({ 
  productId, 
  className = '',
  onToggle 
}) => {
  return (
    <div className={`absolute top-2 right-2 ${className}`}>
      <WishlistButton
        productId={productId}
        variant="icon"
        size="sm"
        onToggle={onToggle}
        className="bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-1.5 shadow-sm"
      />
    </div>
  );
};

export default WishlistButton;