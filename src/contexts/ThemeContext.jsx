import React, { createContext, useContext, useEffect, useState } from 'react'
import { generateFavicon } from '../utils/generateFavicon'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  // Read saved theme from localStorage or default to 'dark'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('portfolio_theme') || 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('portfolio_theme', theme)
    
    let favicon = document.querySelector('link[rel="icon"]')
    if (!favicon) {
      favicon = document.createElement('link')
      favicon.rel = 'icon'
      document.head.appendChild(favicon)
    }
    
    // Update dynamic favicon
    favicon.href = generateFavicon(theme === 'dark' ? '#ffffff' : '#000000')
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
