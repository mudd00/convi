import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

/**
 * UI 상태 관리 스토어
 * 로딩, 알림, 모달, 테마, 언어 등의 UI 관련 상태를 관리
 */
const useUIStore = create(
  persist(
    (set, get) => ({
      // 상태 (State)
      
      // 로딩 상태
      isLoading: false,
      loadingMessage: '',
      
      // 알림 (Notifications)
      notifications: [], // 알림 목록
      
      // 모달 상태
      modals: {}, // 열린 모달들의 상태
      
      // 테마 설정
      theme: 'light', // 'light' | 'dark'
      
      // 언어 설정
      language: 'ko', // 'ko' | 'en' | 'zh' | 'ja'
      
      // 사이드바/메뉴 상태
      isSidebarOpen: false,
      isMobileMenuOpen: false,
      
      // 검색 상태
      searchHistory: [], // 최근 검색어
      
      // 기타 UI 상태
      isOnline: navigator.onLine, // 온라인 상태
      
      // 액션 (Actions)
      
      /**
       * 로딩 상태 설정
       * @param {boolean} isLoading - 로딩 여부
       * @param {string} message - 로딩 메시지
       */
      setLoading: (isLoading, message = '') => {
        set({ isLoading, loadingMessage: message })
      },
      
      /**
       * 알림 추가
       * @param {Object} notification - 알림 정보
       */
      addNotification: (notification) => {
        const { notifications } = get()
        const newNotification = {
          id: Date.now().toString(),
          type: 'info', // 'success' | 'error' | 'warning' | 'info'
          title: '',
          message: '',
          duration: 5000, // 5초 후 자동 제거
          ...notification,
          createdAt: new Date().toISOString()
        }
        
        set({ notifications: [...notifications, newNotification] })
        
        // 자동 제거 타이머 설정
        if (newNotification.duration > 0) {
          setTimeout(() => {
            get().removeNotification(newNotification.id)
          }, newNotification.duration)
        }
        
        return newNotification.id
      },
      
      /**
       * 알림 제거
       * @param {string} id - 알림 ID
       */
      removeNotification: (id) => {
        const { notifications } = get()
        set({ notifications: notifications.filter(n => n.id !== id) })
      },
      
      /**
       * 모든 알림 제거
       */
      clearNotifications: () => {
        set({ notifications: [] })
      },
      
      /**
       * 성공 알림 표시
       * @param {string} message - 메시지
       * @param {string} title - 제목
       */
      showSuccess: (message, title = '성공') => {
        return get().addNotification({
          type: 'success',
          title,
          message,
          duration: 3000
        })
      },
      
      /**
       * 에러 알림 표시
       * @param {string} message - 메시지
       * @param {string} title - 제목
       */
      showError: (message, title = '오류') => {
        return get().addNotification({
          type: 'error',
          title,
          message,
          duration: 5000
        })
      },
      
      /**
       * 경고 알림 표시
       * @param {string} message - 메시지
       * @param {string} title - 제목
       */
      showWarning: (message, title = '경고') => {
        return get().addNotification({
          type: 'warning',
          title,
          message,
          duration: 4000
        })
      },
      
      /**
       * 정보 알림 표시
       * @param {string} message - 메시지
       * @param {string} title - 제목
       */
      showInfo: (message, title = '알림') => {
        return get().addNotification({
          type: 'info',
          title,
          message,
          duration: 4000
        })
      },
      
      /**
       * 모달 열기
       * @param {string} modalId - 모달 ID
       * @param {Object} props - 모달 props
       */
      openModal: (modalId, props = {}) => {
        const { modals } = get()
        set({
          modals: {
            ...modals,
            [modalId]: {
              isOpen: true,
              props,
              openedAt: new Date().toISOString()
            }
          }
        })
      },
      
      /**
       * 모달 닫기
       * @param {string} modalId - 모달 ID
       */
      closeModal: (modalId) => {
        const { modals } = get()
        const newModals = { ...modals }
        delete newModals[modalId]
        set({ modals: newModals })
      },
      
      /**
       * 모든 모달 닫기
       */
      closeAllModals: () => {
        set({ modals: {} })
      },
      
      /**
       * 모달 상태 확인
       * @param {string} modalId - 모달 ID
       */
      isModalOpen: (modalId) => {
        const { modals } = get()
        return modals[modalId]?.isOpen || false
      },
      
      /**
       * 테마 변경
       * @param {string} theme - 테마 ('light' | 'dark')
       */
      setTheme: (theme) => {
        set({ theme })
        
        // HTML 클래스 업데이트
        if (theme === 'dark') {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      },
      
      /**
       * 테마 토글
       */
      toggleTheme: () => {
        const { theme } = get()
        get().setTheme(theme === 'light' ? 'dark' : 'light')
      },
      
      /**
       * 언어 변경
       * @param {string} language - 언어 코드
       */
      setLanguage: (language) => {
        set({ language })
        
        // HTML lang 속성 업데이트
        document.documentElement.lang = language
      },
      
      /**
       * 사이드바 토글
       */
      toggleSidebar: () => {
        const { isSidebarOpen } = get()
        set({ isSidebarOpen: !isSidebarOpen })
      },
      
      /**
       * 모바일 메뉴 토글
       */
      toggleMobileMenu: () => {
        const { isMobileMenuOpen } = get()
        set({ isMobileMenuOpen: !isMobileMenuOpen })
      },
      
      /**
       * 검색어 히스토리에 추가
       * @param {string} searchTerm - 검색어
       */
      addSearchHistory: (searchTerm) => {
        if (!searchTerm.trim()) return
        
        const { searchHistory } = get()
        const newHistory = [
          searchTerm,
          ...searchHistory.filter(term => term !== searchTerm)
        ].slice(0, 10) // 최대 10개까지 저장
        
        set({ searchHistory: newHistory })
      },
      
      /**
       * 검색 히스토리 제거
       * @param {string} searchTerm - 제거할 검색어
       */
      removeSearchHistory: (searchTerm) => {
        const { searchHistory } = get()
        set({ searchHistory: searchHistory.filter(term => term !== searchTerm) })
      },
      
      /**
       * 검색 히스토리 전체 삭제
       */
      clearSearchHistory: () => {
        set({ searchHistory: [] })
      },
      
      /**
       * 온라인 상태 업데이트
       * @param {boolean} isOnline - 온라인 여부
       */
      setOnlineStatus: (isOnline) => {
        set({ isOnline })
        
        // 오프라인 상태일 때 알림 표시
        if (!isOnline) {
          get().showWarning('인터넷 연결이 끊어졌습니다.', '연결 오류')
        } else {
          get().showSuccess('인터넷 연결이 복구되었습니다.', '연결 복구')
        }
      },
      
      /**
       * UI 상태 초기화
       */
      reset: () => {
        set({
          isLoading: false,
          loadingMessage: '',
          notifications: [],
          modals: {},
          isSidebarOpen: false,
          isMobileMenuOpen: false
        })
      }
    }),
    {
      name: 'ui-storage', // localStorage 키 이름
      storage: createJSONStorage(() => localStorage),
      // 저장할 상태 선택
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        searchHistory: state.searchHistory
      })
    }
  )
)

// 온라인/오프라인 이벤트 리스너 설정
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    useUIStore.getState().setOnlineStatus(true)
  })
  
  window.addEventListener('offline', () => {
    useUIStore.getState().setOnlineStatus(false)
  })
}

export default useUIStore