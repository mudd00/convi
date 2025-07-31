import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Loading, { 
  Spinner, 
  FullScreenLoading, 
  InlineLoading, 
  SkeletonText, 
  SkeletonCard,
  SkeletonList,
  ProductCardSkeleton,
  StoreCardSkeleton
} from './Loading'

describe('Loading 컴포넌트들', () => {
  describe('Spinner', () => {
    it('기본 스피너가 올바르게 렌더링된다', () => {
      render(<Spinner />)
      
      const spinner = screen.getByRole('status')
      expect(spinner).toBeInTheDocument()
      expect(spinner).toHaveClass('animate-spin')
      expect(spinner).toHaveAttribute('aria-label', '로딩 중')
    })

    it('다양한 size가 올바르게 적용된다', () => {
      const { rerender } = render(<Spinner size="sm" />)
      expect(screen.getByRole('status')).toHaveClass('w-4', 'h-4')

      rerender(<Spinner size="lg" />)
      expect(screen.getByRole('status')).toHaveClass('w-8', 'h-8')

      rerender(<Spinner size="xl" />)
      expect(screen.getByRole('status')).toHaveClass('w-12', 'h-12')
    })

    it('다양한 color가 올바르게 적용된다', () => {
      const { rerender } = render(<Spinner color="primary" />)
      expect(screen.getByRole('status')).toHaveClass('text-primary')

      rerender(<Spinner color="white" />)
      expect(screen.getByRole('status')).toHaveClass('text-white')

      rerender(<Spinner color="gray" />)
      expect(screen.getByRole('status')).toHaveClass('text-gray-500')
    })
  })

  describe('FullScreenLoading', () => {
    it('전체 화면 로딩이 올바르게 렌더링된다', () => {
      render(<FullScreenLoading />)
      
      expect(screen.getByText('로딩 중...')).toBeInTheDocument()
      expect(screen.getByRole('status')).toBeInTheDocument()
      
      const container = screen.getByText('로딩 중...').parentElement.parentElement
      expect(container).toHaveClass('fixed', 'inset-0', 'z-50')
    })

    it('커스텀 메시지가 올바르게 표시된다', () => {
      render(<FullScreenLoading message="데이터를 불러오는 중..." />)
      
      expect(screen.getByText('데이터를 불러오는 중...')).toBeInTheDocument()
    })
  })

  describe('InlineLoading', () => {
    it('인라인 로딩이 올바르게 렌더링된다', () => {
      render(<InlineLoading />)
      
      expect(screen.getByText('로딩 중...')).toBeInTheDocument()
      expect(screen.getByRole('status')).toBeInTheDocument()
    })

    it('커스텀 메시지와 크기가 올바르게 적용된다', () => {
      render(<InlineLoading message="처리 중..." size="lg" />)
      
      expect(screen.getByText('처리 중...')).toBeInTheDocument()
      expect(screen.getByRole('status')).toHaveClass('w-8', 'h-8')
    })
  })

  describe('SkeletonText', () => {
    it('기본 스켈레톤 텍스트가 렌더링된다', () => {
      const { container } = render(<SkeletonText />)
      
      const skeletonLines = container.querySelectorAll('.animate-pulse')
      expect(skeletonLines).toHaveLength(1)
    })

    it('여러 줄 스켈레톤 텍스트가 렌더링된다', () => {
      const { container } = render(<SkeletonText lines={3} />)
      
      const skeletonLines = container.querySelectorAll('.h-4.bg-gray-200.rounded.animate-pulse')
      expect(skeletonLines).toHaveLength(3)
    })
  })

  describe('SkeletonCard', () => {
    it('스켈레톤 카드가 올바르게 렌더링된다', () => {
      const { container } = render(<SkeletonCard />)
      
      expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
      expect(container.querySelector('.bg-white.rounded-lg')).toBeInTheDocument()
    })
  })

  describe('SkeletonList', () => {
    it('기본 스켈레톤 리스트가 렌더링된다', () => {
      const { container } = render(<SkeletonList />)
      
      const listItems = container.querySelectorAll('.animate-pulse')
      expect(listItems).toHaveLength(3) // 기본 count는 3
    })

    it('커스텀 개수의 스켈레톤 리스트가 렌더링된다', () => {
      const { container } = render(<SkeletonList count={5} />)
      
      const listItems = container.querySelectorAll('.flex.items-center.space-x-4')
      expect(listItems).toHaveLength(5)
    })
  })

  describe('ProductCardSkeleton', () => {
    it('상품 카드 스켈레톤이 올바르게 렌더링된다', () => {
      const { container } = render(<ProductCardSkeleton />)
      
      expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
      expect(container.querySelector('.bg-white.rounded-lg')).toBeInTheDocument()
      // 상품 이미지 영역
      expect(container.querySelector('.h-40.bg-gray-200')).toBeInTheDocument()
    })
  })

  describe('StoreCardSkeleton', () => {
    it('매장 카드 스켈레톤이 올바르게 렌더링된다', () => {
      const { container } = render(<StoreCardSkeleton />)
      
      expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
      expect(container.querySelector('.bg-white.rounded-lg')).toBeInTheDocument()
      // 매장 아이콘 영역
      expect(container.querySelector('.w-12.h-12.bg-gray-200')).toBeInTheDocument()
    })
  })

  describe('기본 Loading 컴포넌트', () => {
    it('기본 타입(spinner)이 올바르게 렌더링된다', () => {
      render(<Loading />)
      
      expect(screen.getByRole('status')).toBeInTheDocument()
    })

    it('다양한 타입이 올바르게 렌더링된다', () => {
      const { rerender } = render(<Loading type="fullscreen" />)
      expect(screen.getByText('로딩 중...')).toBeInTheDocument()

      rerender(<Loading type="inline" />)
      expect(screen.getByText('로딩 중...')).toBeInTheDocument()

      rerender(<Loading type="skeleton-text" />)
      const { container } = render(<Loading type="skeleton-text" />)
      expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
    })

    it('커스텀 메시지가 올바르게 전달된다', () => {
      render(<Loading type="inline" message="데이터 로딩 중..." />)
      
      expect(screen.getByText('데이터 로딩 중...')).toBeInTheDocument()
    })
  })
})