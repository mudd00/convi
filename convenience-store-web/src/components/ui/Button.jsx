import { forwardRef } from 'react'

/**
 * 재사용 가능한 버튼 컴포넌트
 * @param {Object} props - 버튼 속성
 * @param {string} props.variant - 버튼 스타일 ('primary', 'secondary', 'outline', 'ghost')
 * @param {string} props.size - 버튼 크기 ('sm', 'md', 'lg')
 * @param {boolean} props.disabled - 비활성화 상태
 * @param {boolean} props.loading - 로딩 상태
 * @param {React.ReactNode} props.children - 버튼 내용
 * @param {string} props.className - 추가 CSS 클래스
 */
const Button = forwardRef(({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  children,
  className = '',
  ...props
}, ref) => {
  // 기본 스타일
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  // 변형별 스타일
  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary-600 focus:ring-primary-500 disabled:hover:bg-primary',
    secondary: 'bg-secondary text-white hover:bg-secondary-600 focus:ring-secondary-500 disabled:hover:bg-secondary',
    outline: 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-gray-500 disabled:hover:bg-white',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500 disabled:hover:bg-transparent'
  }
  
  // 크기별 스타일
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }
  
  // 최종 클래스명 조합
  const buttonClasses = [
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    className
  ].filter(Boolean).join(' ')
  
  return (
    <button
      ref={ref}
      className={buttonClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
          aria-hidden="true"
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
      )}
      {children}
    </button>
  )
})

Button.displayName = 'Button'

export default Button