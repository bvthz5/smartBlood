// src/components/ScrollToTop.jsx
import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname } = useLocation()
  const previousPathname = useRef(pathname)

  useEffect(() => {
    // Only scroll to top on actual route change, not on initial load
    if (previousPathname.current !== pathname) {
      // Only log in development mode
      if (import.meta.env.DEV) {
        console.log('ScrollToTop: Route changed from', previousPathname.current, 'to', pathname)
      }
      
      // Use requestAnimationFrame for better performance
      requestAnimationFrame(() => {
        window.scrollTo(0, 0)
      })
      
      // Update the previous pathname
      previousPathname.current = pathname
    }
  }, [pathname])

  return null
}
