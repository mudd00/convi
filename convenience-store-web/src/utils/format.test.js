import { describe, it, expect } from 'vitest'
import { formatPrice, formatDate, formatPhoneNumber, truncateText } from './format'

describe('format 유틸리티 함수들', () => {
  describe('formatPrice', () => {
    it('숫자를 한국 원화 형식으로 포맷팅한다', () => {
      expect(formatPrice(1000)).toBe('1,000')
      expect(formatPrice(1234567)).toBe('1,234,567')
      expect(formatPrice(0)).toBe('0')
    })

    it('잘못된 입력에 대해 0을 반환한다', () => {
      expect(formatPrice(null)).toBe('0')
      expect(formatPrice(undefined)).toBe('0')
      expect(formatPrice('abc')).toBe('0')
      expect(formatPrice(NaN)).toBe('0')
    })
  })

  describe('formatDate', () => {
    const testDate = new Date('2024-01-15T10:30:00Z')

    it('짧은 형식으로 날짜를 포맷팅한다', () => {
      const result = formatDate(testDate, 'short')
      expect(result).toContain('2024')
      expect(result).toContain('1')
      expect(result).toContain('15')
    })

    it('긴 형식으로 날짜를 포맷팅한다', () => {
      const result = formatDate(testDate, 'long')
      expect(result).toContain('2024')
      expect(result).toContain('1월')
    })

    it('시간 형식으로 포맷팅한다', () => {
      const result = formatDate(testDate, 'time')
      expect(result).toMatch(/\d{2}:\d{2}/)
    })

    it('잘못된 날짜에 대해 빈 문자열을 반환한다', () => {
      expect(formatDate('invalid-date')).toBe('')
      expect(formatDate(null)).toBe('')
    })
  })

  describe('formatPhoneNumber', () => {
    it('휴대폰 번호를 올바르게 포맷팅한다', () => {
      expect(formatPhoneNumber('01012345678')).toBe('010-1234-5678')
      expect(formatPhoneNumber('010-1234-5678')).toBe('010-1234-5678')
    })

    it('일반 전화번호를 올바르게 포맷팅한다', () => {
      expect(formatPhoneNumber('0212345678')).toBe('02-1234-5678')
    })

    it('빈 값에 대해 빈 문자열을 반환한다', () => {
      expect(formatPhoneNumber('')).toBe('')
      expect(formatPhoneNumber(null)).toBe('')
      expect(formatPhoneNumber(undefined)).toBe('')
    })

    it('형식에 맞지 않는 번호는 원본을 반환한다', () => {
      expect(formatPhoneNumber('123')).toBe('123')
      expect(formatPhoneNumber('010123')).toBe('010123')
    })
  })

  describe('truncateText', () => {
    it('긴 텍스트를 지정된 길이로 자른다', () => {
      const longText = '이것은 매우 긴 텍스트입니다. 이 텍스트는 잘려야 합니다.'
      const result = truncateText(longText, 10)
      expect(result).toBe('이것은 매우 긴 텍...')
      expect(result.length).toBe(13) // 10 + '...'
    })

    it('짧은 텍스트는 그대로 반환한다', () => {
      const shortText = '짧은 텍스트'
      expect(truncateText(shortText, 50)).toBe(shortText)
    })

    it('빈 값에 대해 빈 문자열을 반환한다', () => {
      expect(truncateText('')).toBe('')
      expect(truncateText(null)).toBe('')
      expect(truncateText(undefined)).toBe('')
    })

    it('기본 최대 길이는 50이다', () => {
      const longText = 'a'.repeat(60)
      const result = truncateText(longText)
      expect(result.length).toBe(53) // 50 + '...'
    })
  })
})