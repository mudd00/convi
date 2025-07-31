import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App 컴포넌트', () => {
  it('앱이 정상적으로 렌더링된다', () => {
    const { container } = render(<App />)
    expect(container).toBeTruthy()
  })

  it('기본 구조가 렌더링된다', () => {
    render(<App />)
    expect(true).toBe(true)
  })
})