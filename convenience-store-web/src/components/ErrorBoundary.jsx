import { Component } from 'react'
import { Button } from '@/components/ui'

/**
 * 에러 경계 컴포넌트
 * React 애플리케이션에서 발생하는 JavaScript 에러를 포착하고 처리
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    // 다음 렌더링에서 폴백 UI가 보이도록 상태를 업데이트
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // 에러 로깅
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    })

    // 실제 프로덕션에서는 에러 리포팅 서비스로 전송
    // 예: Sentry, LogRocket 등
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            {/* 에러 아이콘 */}
            <div className="text-6xl mb-6">😵</div>
            
            {/* 에러 메시지 */}
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              앗! 문제가 발생했습니다
            </h1>
            <p className="text-gray-600 mb-8">
              예상치 못한 오류가 발생했습니다.<br />
              잠시 후 다시 시도해주세요.
            </p>

            {/* 액션 버튼들 */}
            <div className="space-y-3">
              <Button 
                onClick={this.handleReload}
                className="w-full"
              >
                페이지 새로고침
              </Button>
              <Button 
                variant="outline"
                onClick={this.handleGoHome}
                className="w-full"
              >
                홈으로 돌아가기
              </Button>
            </div>

            {/* 개발 환경에서만 에러 상세 정보 표시 */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-8 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  개발자 정보 (클릭하여 펼치기)
                </summary>
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-sm">
                  <h3 className="font-semibold text-red-800 mb-2">Error:</h3>
                  <pre className="text-red-700 whitespace-pre-wrap mb-4">
                    {this.state.error && this.state.error.toString()}
                  </pre>
                  
                  <h3 className="font-semibold text-red-800 mb-2">Stack Trace:</h3>
                  <pre className="text-red-700 whitespace-pre-wrap text-xs">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </div>
              </details>
            )}

            {/* 고객센터 정보 */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-2">
                문제가 계속 발생하면 고객센터로 문의해주세요
              </p>
              <p className="text-sm font-medium text-gray-700">
                📞 1588-1234 (24시간 운영)
              </p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary