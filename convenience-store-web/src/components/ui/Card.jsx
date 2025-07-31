import { forwardRef } from 'react'

/**
 * 재사용 가능한 카드 컴포넌트
 * @param {Object} props - 카드 속성
 * @param {React.ReactNode} props.children - 카드 내용
 * @param {string} props.variant - 카드 스타일 ('default', 'outlined', 'elevated')
 * @param {string} props.padding - 패딩 크기 ('none', 'sm', 'md', 'lg')
 * @param {boolean} props.hoverable - 호버 효과 여부
 * @param {string} props.className - 추가 CSS 클래스
 */
const Card = forwardRef(({
  children,
  variant = 'default',
  padding = 'md',
  hoverable = false,
  className = '',
  ...props
}, ref) => {
  // 기본 스타일
  const baseStyles = 'bg-white rounded-lg transition-shadow duration-200'
  
  // 변형별 스타일
  const variantStyles = {
    default: 'shadow-sm border border-gray-200',
    outlined: 'border-2 border-gray-200',
    elevated: 'shadow-lg'
  }
  
  // 패딩 스타일
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  }
  
  // 호버 효과
  const hoverStyles = hoverable 
    ? 'hover:shadow-md cursor-pointer transform hover:-translate-y-0.5' 
    : ''
  
  // 최종 클래스명 조합
  const cardClasses = [
    baseStyles,
    variantStyles[variant],
    paddingStyles[padding],
    hoverStyles,
    className
  ].filter(Boolean).join(' ')
  
  return (
    <div
      ref={ref}
      className={cardClasses}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = 'Card'

// 카드 헤더 컴포넌트
const CardHeader = ({ children, className = '', ...props }) => (
  <div 
    className={`border-b border-gray-200 pb-3 mb-4 ${className}`}
    {...props}
  >
    {children}
  </div>
)

// 카드 제목 컴포넌트
const CardTitle = ({ children, className = '', ...props }) => (
  <h3 
    className={`text-lg font-semibold text-gray-900 ${className}`}
    {...props}
  >
    {children}
  </h3>
)

// 카드 설명 컴포넌트
const CardDescription = ({ children, className = '', ...props }) => (
  <p 
    className={`text-sm text-gray-600 mt-1 ${className}`}
    {...props}
  >
    {children}
  </p>
)

// 카드 내용 컴포넌트
const CardContent = ({ children, className = '', ...props }) => (
  <div 
    className={`${className}`}
    {...props}
  >
    {children}
  </div>
)

// 카드 푸터 컴포넌트
const CardFooter = ({ children, className = '', ...props }) => (
  <div 
    className={`border-t border-gray-200 pt-3 mt-4 ${className}`}
    {...props}
  >
    {children}
  </div>
)

// 서브 컴포넌트들을 Card에 연결
Card.Header = CardHeader
Card.Title = CardTitle
Card.Description = CardDescription
Card.Content = CardContent
Card.Footer = CardFooter

export default Card