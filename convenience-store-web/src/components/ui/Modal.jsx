import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

/**
 * 접근성을 지원하는 모달 컴포넌트
 * @param {Object} props - 모달 속성
 * @param {boolean} props.isOpen - 모달 열림 상태
 * @param {Function} props.onClose - 모달 닫기 함수
 * @param {React.ReactNode} props.children - 모달 내용
 * @param {string} props.size - 모달 크기 ('sm', 'md', 'lg', 'xl', 'full')
 * @param {boolean} props.closeOnOverlayClick - 오버레이 클릭 시 닫기 여부
 * @param {boolean} props.closeOnEscape - ESC 키로 닫기 여부
 * @param {string} props.className - 추가 CSS 클래스
 */
const Modal = ({
  isOpen,
  onClose,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = ''
}) => {
  const modalRef = useRef(null)
  const previousFocusRef = useRef(null)
  
  // 크기별 스타일
  const sizeStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4'
  }
  
  // ESC 키 처리
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return
    
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, closeOnEscape, onClose])
  
  // 포커스 관리
  useEffect(() => {
    if (isOpen) {
      // 현재 포커스된 요소 저장
      previousFocusRef.current = document.activeElement
      
      // 모달에 포커스 설정
      setTimeout(() => {
        if (modalRef.current) {
          const focusableElement = modalRef.current.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
          if (focusableElement) {
            focusableElement.focus()
          } else {
            modalRef.current.focus()
          }
        }
      }, 100)
    } else {
      // 모달이 닫힐 때 이전 포커스 복원
      if (previousFocusRef.current) {
        previousFocusRef.current.focus()
      }
    }
  }, [isOpen])
  
  // 바디 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])
  
  // 오버레이 클릭 처리
  const handleOverlayClick = (event) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose()
    }
  }
  
  // 포커스 트랩 (Tab 키 처리)
  const handleKeyDown = (event) => {
    if (event.key === 'Tab') {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]
      
      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    }
  }
  
  if (!isOpen) return null
  
  const modalContent = (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* 오버레이 */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
      
      {/* 모달 컨테이너 */}
      <div
        ref={modalRef}
        className={`relative bg-white rounded-lg shadow-xl w-full ${sizeStyles[size]} ${className}`}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        {children}
      </div>
    </div>
  )
  
  // 포털을 사용하여 body에 렌더링
  return createPortal(modalContent, document.body)
}

// 모달 헤더 컴포넌트
const ModalHeader = ({ children, onClose, className = '' }) => (
  <div className={`flex items-center justify-between p-6 border-b border-gray-200 ${className}`}>
    <div className="flex-1">
      {children}
    </div>
    {onClose && (
      <button
        onClick={onClose}
        className="ml-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg p-1"
        aria-label="모달 닫기"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    )}
  </div>
)

// 모달 제목 컴포넌트
const ModalTitle = ({ children, className = '' }) => (
  <h2 
    id="modal-title"
    className={`text-xl font-semibold text-gray-900 ${className}`}
  >
    {children}
  </h2>
)

// 모달 내용 컴포넌트
const ModalContent = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
)

// 모달 푸터 컴포넌트
const ModalFooter = ({ children, className = '' }) => (
  <div className={`flex items-center justify-end gap-3 p-6 border-t border-gray-200 ${className}`}>
    {children}
  </div>
)

// 서브 컴포넌트들을 Modal에 연결
Modal.Header = ModalHeader
Modal.Title = ModalTitle
Modal.Content = ModalContent
Modal.Footer = ModalFooter

export default Modal