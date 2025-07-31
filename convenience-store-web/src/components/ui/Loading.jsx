/**
 * 로딩 상태를 표시하는 컴포넌트들
 */

// 기본 스피너 컴포넌트
export const Spinner = ({ 
  size = 'md', 
  color = 'primary',
  className = '' 
}) => {
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }
  
  const colorStyles = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    white: 'text-white',
    gray: 'text-gray-500'
  }
  
  return (
    <svg 
      className={`animate-spin ${sizeStyles[size]} ${colorStyles[color]} ${className}`}
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
      role="status"
      aria-label="로딩 중"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

// 전체 화면 로딩 컴포넌트
export const FullScreenLoading = ({ message = '로딩 중...' }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90">
    <div className="text-center">
      <Spinner size="xl" />
      <p className="mt-4 text-lg text-gray-600">{message}</p>
    </div>
  </div>
)

// 인라인 로딩 컴포넌트
export const InlineLoading = ({ 
  message = '로딩 중...', 
  size = 'md',
  className = '' 
}) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <Spinner size={size} />
    <span className="text-gray-600">{message}</span>
  </div>
)

// 스켈레톤 UI 컴포넌트들
export const SkeletonText = ({ 
  lines = 1, 
  className = '' 
}) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, index) => (
      <div 
        key={index}
        className="h-4 bg-gray-200 rounded animate-pulse"
        style={{ 
          width: index === lines - 1 ? '75%' : '100%' 
        }}
      />
    ))}
  </div>
)

export const SkeletonCard = ({ className = '' }) => (
  <div className={`bg-white rounded-lg p-4 shadow-sm border border-gray-200 ${className}`}>
    <div className="animate-pulse">
      {/* 이미지 영역 */}
      <div className="w-full h-48 bg-gray-200 rounded-lg mb-4" />
      
      {/* 제목 */}
      <div className="h-4 bg-gray-200 rounded mb-2" />
      
      {/* 설명 */}
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-gray-200 rounded" />
        <div className="h-3 bg-gray-200 rounded w-3/4" />
      </div>
      
      {/* 가격 */}
      <div className="h-6 bg-gray-200 rounded w-1/3" />
    </div>
  </div>
)

export const SkeletonList = ({ 
  count = 3, 
  className = '' 
}) => (
  <div className={`space-y-4 ${className}`}>
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200">
        <div className="animate-pulse flex space-x-4 w-full">
          {/* 아바타/이미지 */}
          <div className="rounded-full bg-gray-200 h-12 w-12" />
          
          {/* 내용 */}
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="h-3 bg-gray-200 rounded w-1/3" />
          </div>
        </div>
      </div>
    ))}
  </div>
)

// 상품 카드 스켈레톤
export const ProductCardSkeleton = ({ className = '' }) => (
  <div className={`bg-white rounded-lg p-4 shadow-sm border border-gray-200 ${className}`}>
    <div className="animate-pulse">
      {/* 상품 이미지 */}
      <div className="w-full h-40 bg-gray-200 rounded-lg mb-3" />
      
      {/* 상품명 */}
      <div className="h-4 bg-gray-200 rounded mb-2" />
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
      
      {/* 가격 */}
      <div className="flex items-center justify-between mb-3">
        <div className="h-5 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-1/4" />
      </div>
      
      {/* 버튼 */}
      <div className="h-9 bg-gray-200 rounded" />
    </div>
  </div>
)

// 매장 카드 스켈레톤
export const StoreCardSkeleton = ({ className = '' }) => (
  <div className={`bg-white rounded-lg p-4 shadow-sm border border-gray-200 ${className}`}>
    <div className="animate-pulse">
      {/* 매장 정보 */}
      <div className="flex items-start space-x-3 mb-3">
        <div className="w-12 h-12 bg-gray-200 rounded-lg" />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded mb-2" />
          <div className="h-3 bg-gray-200 rounded w-2/3" />
        </div>
      </div>
      
      {/* 운영시간 */}
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
      
      {/* 서비스 아이콘들 */}
      <div className="flex space-x-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="w-6 h-6 bg-gray-200 rounded" />
        ))}
      </div>
    </div>
  </div>
)

// 기본 로딩 컴포넌트 (default export)
const Loading = ({ 
  type = 'spinner',
  size = 'md',
  message,
  className = '',
  ...props 
}) => {
  switch (type) {
    case 'fullscreen':
      return <FullScreenLoading message={message} {...props} />
    case 'inline':
      return <InlineLoading message={message} size={size} className={className} {...props} />
    case 'skeleton-text':
      return <SkeletonText className={className} {...props} />
    case 'skeleton-card':
      return <SkeletonCard className={className} {...props} />
    case 'skeleton-list':
      return <SkeletonList className={className} {...props} />
    case 'product-skeleton':
      return <ProductCardSkeleton className={className} {...props} />
    case 'store-skeleton':
      return <StoreCardSkeleton className={className} {...props} />
    default:
      return <Spinner size={size} className={className} {...props} />
  }
}

export default Loading