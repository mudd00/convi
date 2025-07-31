import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Card from './Card'

describe('Card 컴포넌트', () => {
  it('기본 카드가 올바르게 렌더링된다', () => {
    render(
      <Card data-testid="card">
        <p>카드 내용</p>
      </Card>
    )
    
    expect(screen.getByText('카드 내용')).toBeInTheDocument()
    const card = screen.getByTestId('card')
    expect(card).toHaveClass('bg-white', 'rounded-lg', 'shadow-sm')
  })

  it('다양한 variant가 올바르게 적용된다', () => {
    const { rerender } = render(<Card variant="default" data-testid="card">Default</Card>)
    let card = screen.getByTestId('card')
    expect(card).toHaveClass('shadow-sm', 'border', 'border-gray-200')

    rerender(<Card variant="outlined" data-testid="card">Outlined</Card>)
    card = screen.getByTestId('card')
    expect(card).toHaveClass('border-2', 'border-gray-200')

    rerender(<Card variant="elevated" data-testid="card">Elevated</Card>)
    card = screen.getByTestId('card')
    expect(card).toHaveClass('shadow-lg')
  })

  it('다양한 padding이 올바르게 적용된다', () => {
    const { rerender } = render(<Card padding="none" data-testid="card">None</Card>)
    let card = screen.getByTestId('card')
    expect(card).not.toHaveClass('p-3', 'p-4', 'p-6')

    rerender(<Card padding="sm" data-testid="card">Small</Card>)
    card = screen.getByTestId('card')
    expect(card).toHaveClass('p-3')

    rerender(<Card padding="md" data-testid="card">Medium</Card>)
    card = screen.getByTestId('card')
    expect(card).toHaveClass('p-4')

    rerender(<Card padding="lg" data-testid="card">Large</Card>)
    card = screen.getByTestId('card')
    expect(card).toHaveClass('p-6')
  })

  it('hoverable 속성이 올바르게 작동한다', () => {
    render(<Card hoverable data-testid="card">Hoverable Card</Card>)
    
    const card = screen.getByTestId('card')
    expect(card).toHaveClass('hover:shadow-md', 'cursor-pointer')
  })

  it('클릭 이벤트가 올바르게 처리된다', () => {
    const handleClick = vi.fn()
    render(<Card onClick={handleClick} data-testid="card">Clickable Card</Card>)
    
    const card = screen.getByTestId('card')
    fireEvent.click(card)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('추가 className이 올바르게 적용된다', () => {
    render(<Card className="custom-class" data-testid="card">Custom Card</Card>)
    
    const card = screen.getByTestId('card')
    expect(card).toHaveClass('custom-class')
    expect(card).toHaveClass('bg-white') // 기본 클래스도 유지
  })

  describe('Card 서브 컴포넌트들', () => {
    it('Card.Header가 올바르게 렌더링된다', () => {
      render(
        <Card>
          <Card.Header>헤더 내용</Card.Header>
        </Card>
      )
      
      const header = screen.getByText('헤더 내용')
      expect(header).toBeInTheDocument()
      expect(header).toHaveClass('border-b', 'border-gray-200', 'pb-3', 'mb-4')
    })

    it('Card.Title이 올바르게 렌더링된다', () => {
      render(
        <Card>
          <Card.Title>카드 제목</Card.Title>
        </Card>
      )
      
      const title = screen.getByText('카드 제목')
      expect(title).toBeInTheDocument()
      expect(title.tagName).toBe('H3')
      expect(title).toHaveClass('text-lg', 'font-semibold', 'text-gray-900')
    })

    it('Card.Description이 올바르게 렌더링된다', () => {
      render(
        <Card>
          <Card.Description>카드 설명</Card.Description>
        </Card>
      )
      
      const description = screen.getByText('카드 설명')
      expect(description).toBeInTheDocument()
      expect(description.tagName).toBe('P')
      expect(description).toHaveClass('text-sm', 'text-gray-600')
    })

    it('Card.Content가 올바르게 렌더링된다', () => {
      render(
        <Card>
          <Card.Content>카드 내용</Card.Content>
        </Card>
      )
      
      const content = screen.getByText('카드 내용')
      expect(content).toBeInTheDocument()
    })

    it('Card.Footer가 올바르게 렌더링된다', () => {
      render(
        <Card>
          <Card.Footer>푸터 내용</Card.Footer>
        </Card>
      )
      
      const footer = screen.getByText('푸터 내용')
      expect(footer).toBeInTheDocument()
      expect(footer).toHaveClass('border-t', 'border-gray-200', 'pt-3', 'mt-4')
    })

    it('모든 서브 컴포넌트가 함께 올바르게 작동한다', () => {
      render(
        <Card>
          <Card.Header>
            <Card.Title>상품 카드</Card.Title>
            <Card.Description>맛있는 편의점 도시락</Card.Description>
          </Card.Header>
          <Card.Content>
            <p>상품 상세 정보</p>
          </Card.Content>
          <Card.Footer>
            <button>장바구니 담기</button>
          </Card.Footer>
        </Card>
      )
      
      expect(screen.getByText('상품 카드')).toBeInTheDocument()
      expect(screen.getByText('맛있는 편의점 도시락')).toBeInTheDocument()
      expect(screen.getByText('상품 상세 정보')).toBeInTheDocument()
      expect(screen.getByText('장바구니 담기')).toBeInTheDocument()
    })
  })

  it('forwardRef가 올바르게 작동한다', () => {
    const ref = { current: null }
    render(<Card ref={ref}>Ref Test</Card>)
    
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})