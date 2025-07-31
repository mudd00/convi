import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Input from './Input'

describe('Input 컴포넌트', () => {
  it('기본 입력 필드가 올바르게 렌더링된다', () => {
    render(<Input placeholder="입력하세요" />)
    
    const input = screen.getByPlaceholderText('입력하세요')
    expect(input).toBeInTheDocument()
    expect(input).toHaveClass('w-full', 'border', 'rounded-lg')
  })

  it('라벨이 올바르게 표시된다', () => {
    render(<Input label="이름" />)
    
    const label = screen.getByText('이름')
    expect(label).toBeInTheDocument()
    expect(label.tagName).toBe('LABEL')
  })

  it('필수 입력 표시가 올바르게 작동한다', () => {
    render(<Input label="이메일" required />)
    
    expect(screen.getByText('*')).toBeInTheDocument()
    expect(screen.getByText('*')).toHaveClass('text-red-500')
  })

  it('에러 메시지가 올바르게 표시된다', () => {
    render(<Input label="비밀번호" error="비밀번호가 너무 짧습니다" />)
    
    const errorMessage = screen.getByText('비밀번호가 너무 짧습니다')
    expect(errorMessage).toBeInTheDocument()
    expect(errorMessage).toHaveClass('text-red-600')
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveClass('border-red-300')
  })

  it('도움말 텍스트가 올바르게 표시된다', () => {
    render(<Input label="사용자명" helperText="영문과 숫자만 사용 가능합니다" />)
    
    const helperText = screen.getByText('영문과 숫자만 사용 가능합니다')
    expect(helperText).toBeInTheDocument()
    expect(helperText).toHaveClass('text-gray-500')
  })

  it('다양한 size가 올바르게 적용된다', () => {
    const { rerender } = render(<Input size="sm" />)
    expect(screen.getByRole('textbox')).toHaveClass('px-3', 'py-1.5', 'text-sm')

    rerender(<Input size="md" />)
    expect(screen.getByRole('textbox')).toHaveClass('px-3', 'py-2', 'text-base')

    rerender(<Input size="lg" />)
    expect(screen.getByRole('textbox')).toHaveClass('px-4', 'py-3', 'text-lg')
  })

  it('포커스 상태가 올바르게 처리된다', () => {
    render(<Input />)
    
    const input = screen.getByRole('textbox')
    
    fireEvent.focus(input)
    expect(input).toHaveClass('focus:border-primary-500')
    
    fireEvent.blur(input)
    // blur 후에도 클래스는 유지됨 (CSS에서 처리)
  })

  it('입력 이벤트가 올바르게 처리된다', () => {
    const handleChange = vi.fn()
    render(<Input onChange={handleChange} />)
    
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '테스트 입력' } })
    
    expect(handleChange).toHaveBeenCalledTimes(1)
    expect(input.value).toBe('테스트 입력')
  })

  it('왼쪽 아이콘이 올바르게 표시된다', () => {
    const SearchIcon = <span data-testid="search-icon">🔍</span>
    render(<Input leftIcon={SearchIcon} />)
    
    expect(screen.getByTestId('search-icon')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toHaveClass('pl-10')
  })

  it('오른쪽 아이콘이 올바르게 표시된다', () => {
    const EyeIcon = <span data-testid="eye-icon">👁️</span>
    render(<Input rightIcon={EyeIcon} />)
    
    expect(screen.getByTestId('eye-icon')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toHaveClass('pr-10')
  })

  it('다양한 input type이 올바르게 적용된다', () => {
    const { rerender } = render(<Input type="email" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email')

    rerender(<Input type="password" />)
    const passwordInput = document.querySelector('input[type="password"]')
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('forwardRef가 올바르게 작동한다', () => {
    const ref = { current: null }
    render(<Input ref={ref} />)
    
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })
})