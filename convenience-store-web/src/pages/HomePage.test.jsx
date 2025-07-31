import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import HomePage from './HomePage'

// 테스트용 래퍼 컴포넌트
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
)

describe('HomePage 컴포넌트', () => {
  it('메인 제목이 올바르게 렌더링된다', () => {
    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    )
    
    expect(screen.getByText('한국 편의점 웹사이트')).toBeInTheDocument()
    expect(screen.getByText('24시간 언제나 편리한 쇼핑을 경험하세요')).toBeInTheDocument()
  })

  it('주요 서비스 섹션이 표시된다', () => {
    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    )
    
    expect(screen.getByText('주요 서비스')).toBeInTheDocument()
    expect(screen.getByText('온라인 주문')).toBeInTheDocument()
    // 서비스 섹션의 매장 찾기만 확인 (h3 태그)
    expect(screen.getByRole('heading', { name: '매장 찾기' })).toBeInTheDocument()
    expect(screen.getByText('할인 혜택')).toBeInTheDocument()
  })

  it('추천 상품 섹션이 표시된다', () => {
    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    )
    
    expect(screen.getByText('추천 상품')).toBeInTheDocument()
    expect(screen.getAllByText(/추천 상품 \d/)).toHaveLength(4)
  })

  it('CTA 버튼들이 올바르게 렌더링된다', () => {
    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    )
    
    expect(screen.getByText('상품 둘러보기')).toBeInTheDocument()
    // 버튼 역할로 매장 찾기 버튼 확인
    expect(screen.getByRole('button', { name: '매장 찾기' })).toBeInTheDocument()
  })
})