import { forwardRef, useState } from 'react'

/**
 * 재사용 가능한 입력 필드 컴포넌트
 * @param {Object} props - 입력 필드 속성
 * @param {string} props.label - 라벨 텍스트
 * @param {string} props.error - 에러 메시지
 * @param {string} props.helperText - 도움말 텍스트
 * @param {boolean} props.required - 필수 입력 여부
 * @param {string} props.size - 입력 필드 크기 ('sm', 'md', 'lg')
 * @param {React.ReactNode} props.leftIcon - 왼쪽 아이콘
 * @param {React.ReactNode} props.rightIcon - 오른쪽 아이콘
 * @param {string} props.className - 추가 CSS 클래스
 */
const Input = forwardRef(({
  label,
  error,
  helperText,
  required = false,
  size = 'md',
  leftIcon,
  rightIcon,
  className = '',
  type = 'text',
  ...props
}, ref) => {
  const [focused, setFocused] = useState(false)
  
  // 기본 스타일
  const baseStyles = 'w-full border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1'
  
  // 상태별 스타일
  const stateStyles = error 
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
    : focused
    ? 'border-primary-300 focus:border-primary-500 focus:ring-primary-500'
    : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
  
  // 크기별 스타일
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-3 py-2 text-base',
    lg: 'px-4 py-3 text-lg'
  }
  
  // 아이콘이 있을 때 패딩 조정
  const iconPadding = leftIcon ? 'pl-10' : rightIcon ? 'pr-10' : ''
  
  // 최종 클래스명 조합
  const inputClasses = [
    baseStyles,
    stateStyles,
    sizeStyles[size],
    iconPadding,
    className
  ].filter(Boolean).join(' ')
  
  // 고유 ID 생성 (라벨과 연결용)
  const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`
  
  return (
    <div className="w-full">
      {/* 라벨 */}
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {/* 입력 필드 컨테이너 */}
      <div className="relative">
        {/* 왼쪽 아이콘 */}
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="h-5 w-5 text-gray-400">
              {leftIcon}
            </div>
          </div>
        )}
        
        {/* 입력 필드 */}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={inputClasses}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${inputId}-error` : 
            helperText ? `${inputId}-helper` : undefined
          }
          {...props}
        />
        
        {/* 오른쪽 아이콘 */}
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <div className="h-5 w-5 text-gray-400">
              {rightIcon}
            </div>
          </div>
        )}
      </div>
      
      {/* 에러 메시지 */}
      {error && (
        <p 
          id={`${inputId}-error`}
          className="mt-1 text-sm text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}
      
      {/* 도움말 텍스트 */}
      {helperText && !error && (
        <p 
          id={`${inputId}-helper`}
          className="mt-1 text-sm text-gray-500"
        >
          {helperText}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input