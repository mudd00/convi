import { describe, it, expect } from 'vitest'
import { 
  CONVENIENCE_STORE_BRANDS, 
  PRODUCT_CATEGORIES, 
  ORDER_STATUS,
  REGEX_PATTERNS,
  ERROR_MESSAGES 
} from './constants'

describe('constants 상수들', () => {
  describe('CONVENIENCE_STORE_BRANDS', () => {
    it('모든 브랜드가 필수 속성을 가지고 있다', () => {
      Object.values(CONVENIENCE_STORE_BRANDS).forEach(brand => {
        expect(brand).toHaveProperty('name')
        expect(brand).toHaveProperty('color')
        expect(brand).toHaveProperty('slogan')
        expect(typeof brand.name).toBe('string')
        expect(typeof brand.color).toBe('string')
        expect(typeof brand.slogan).toBe('string')
      })
    })

    it('GS25 브랜드 정보가 올바르다', () => {
      expect(CONVENIENCE_STORE_BRANDS.GS25.name).toBe('GS25')
      expect(CONVENIENCE_STORE_BRANDS.GS25.color).toBe('#00A651')
      expect(CONVENIENCE_STORE_BRANDS.GS25.slogan).toBe('당신의 편리한 세상')
    })
  })

  describe('PRODUCT_CATEGORIES', () => {
    it('모든 카테고리가 필수 속성을 가지고 있다', () => {
      Object.values(PRODUCT_CATEGORIES).forEach(category => {
        expect(category).toHaveProperty('code')
        expect(category).toHaveProperty('name')
        expect(category).toHaveProperty('icon')
        expect(typeof category.code).toBe('string')
        expect(typeof category.name).toBe('string')
        expect(typeof category.icon).toBe('string')
      })
    })

    it('즉석식품 카테고리 정보가 올바르다', () => {
      expect(PRODUCT_CATEGORIES.INSTANT_FOOD.code).toBe('instant-food')
      expect(PRODUCT_CATEGORIES.INSTANT_FOOD.name).toBe('즉석식품')
      expect(PRODUCT_CATEGORIES.INSTANT_FOOD.icon).toBe('🍱')
    })
  })

  describe('ORDER_STATUS', () => {
    it('모든 주문 상태가 필수 속성을 가지고 있다', () => {
      Object.values(ORDER_STATUS).forEach(status => {
        expect(status).toHaveProperty('code')
        expect(status).toHaveProperty('name')
        expect(status).toHaveProperty('color')
        expect(typeof status.code).toBe('string')
        expect(typeof status.name).toBe('string')
        expect(typeof status.color).toBe('string')
      })
    })

    it('주문 대기 상태 정보가 올바르다', () => {
      expect(ORDER_STATUS.PENDING.code).toBe('pending')
      expect(ORDER_STATUS.PENDING.name).toBe('주문 대기')
      expect(ORDER_STATUS.PENDING.color).toBe('warning')
    })
  })

  describe('REGEX_PATTERNS', () => {
    it('이메일 정규식이 올바르게 작동한다', () => {
      expect(REGEX_PATTERNS.EMAIL.test('test@example.com')).toBe(true)
      expect(REGEX_PATTERNS.EMAIL.test('invalid-email')).toBe(false)
    })

    it('전화번호 정규식이 올바르게 작동한다', () => {
      expect(REGEX_PATTERNS.PHONE.test('010-1234-5678')).toBe(true)
      expect(REGEX_PATTERNS.PHONE.test('010-123-4567')).toBe(false)
      expect(REGEX_PATTERNS.PHONE.test('01012345678')).toBe(false)
    })

    it('비밀번호 정규식이 올바르게 작동한다', () => {
      expect(REGEX_PATTERNS.PASSWORD.test('Password123!')).toBe(true)
      expect(REGEX_PATTERNS.PASSWORD.test('password')).toBe(false)
      expect(REGEX_PATTERNS.PASSWORD.test('12345678')).toBe(false)
      expect(REGEX_PATTERNS.PASSWORD.test('Password')).toBe(false)
    })
  })

  describe('ERROR_MESSAGES', () => {
    it('모든 에러 메시지가 문자열이다', () => {
      Object.values(ERROR_MESSAGES).forEach(message => {
        expect(typeof message).toBe('string')
        expect(message.length).toBeGreaterThan(0)
      })
    })

    it('한글 에러 메시지가 포함되어 있다', () => {
      expect(ERROR_MESSAGES.NETWORK_ERROR).toContain('네트워크')
      expect(ERROR_MESSAGES.INVALID_EMAIL).toContain('이메일')
      expect(ERROR_MESSAGES.REQUIRED_FIELD).toContain('필수')
    })
  })
})