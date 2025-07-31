import { createContext, useContext, useState } from 'react'

/**
 * Tabs 컨텍스트
 */
const TabsContext = createContext()

/**
 * Tabs 컨테이너 컴포넌트
 */
export const Tabs = ({ 
  value, 
  onValueChange, 
  defaultValue, 
  children, 
  className = "" 
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue || '')
  
  const currentValue = value !== undefined ? value : internalValue
  const handleValueChange = value !== undefined ? onValueChange : setInternalValue

  return (
    <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
      <div className={className}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

/**
 * TabsList 컴포넌트
 */
export const TabsList = ({ children, className = "" }) => {
  return (
    <div className={`inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 ${className}`}>
      {children}
    </div>
  )
}

/**
 * TabsTrigger 컴포넌트
 */
export const TabsTrigger = ({ value, children, className = "" }) => {
  const context = useContext(TabsContext)
  
  if (!context) {
    throw new Error('TabsTrigger must be used within Tabs')
  }

  const { value: currentValue, onValueChange } = context
  const isActive = currentValue === value

  return (
    <button
      onClick={() => onValueChange?.(value)}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
        isActive 
          ? 'bg-white text-gray-950 shadow-sm' 
          : 'hover:bg-gray-200 hover:text-gray-900'
      } ${className}`}
    >
      {children}
    </button>
  )
}

/**
 * TabsContent 컴포넌트
 */
export const TabsContent = ({ value, children, className = "" }) => {
  const context = useContext(TabsContext)
  
  if (!context) {
    throw new Error('TabsContent must be used within Tabs')
  }

  const { value: currentValue } = context
  
  if (currentValue !== value) {
    return null
  }

  return (
    <div className={`mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 ${className}`}>
      {children}
    </div>
  )
}

export default Tabs