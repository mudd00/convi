import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Modal from './Modal'

describe('Modal 컴포넌트', () => {
  it('isOpen이 false일 때 렌더링되지 않는다', () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()}>
        <p>모달 내용</p>
      </Modal>
    )
    
    expect(screen.queryByText('모달 내용')).not.toBeInTheDocument()
  })

  it('isOpen이 true일 때 올바르게 렌더링된다', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        <p>모달 내용</p>
      </Modal>
    )
    
    expect(screen.getByText('모달 내용')).toBeInTheDocument()
  })

  describe('Modal 서브 컴포넌트들', () => {
    it('Modal.Header가 올바르게 렌더링된다', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()}>
          <Modal.Header>
            <Modal.Title>모달 제목</Modal.Title>
          </Modal.Header>
        </Modal>
      )
      
      expect(screen.getByText('모달 제목')).toBeInTheDocument()
      expect(screen.getByText('모달 제목').tagName).toBe('H2')
    })

    it('Modal.Content가 올바르게 렌더링된다', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()}>
          <Modal.Content>
            <p>모달 내용</p>
          </Modal.Content>
        </Modal>
      )
      
      expect(screen.getByText('모달 내용')).toBeInTheDocument()
    })

    it('Modal.Footer가 올바르게 렌더링된다', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()}>
          <Modal.Footer>
            <button>확인</button>
            <button>취소</button>
          </Modal.Footer>
        </Modal>
      )
      
      expect(screen.getByText('확인')).toBeInTheDocument()
      expect(screen.getByText('취소')).toBeInTheDocument()
    })
  })
})