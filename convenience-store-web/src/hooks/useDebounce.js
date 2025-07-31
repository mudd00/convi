import { useState, useEffect } from 'react'

/**
 * 디바운스 훅
 * 입력값의 변경을 지연시켜 불필요한 API 호출을 방지
 * @param {any} value - 디바운스할 값
 * @param {number} delay - 지연 시간 (밀리초)
 * @returns {any} 디바운스된 값
 */
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    // 지연 시간 후에 값을 업데이트하는 타이머 설정
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // 값이 변경되면 이전 타이머를 정리
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export default useDebounce