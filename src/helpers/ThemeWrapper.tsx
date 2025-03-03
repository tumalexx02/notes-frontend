import { createTheme, ThemeProvider } from '@mui/material'
import { ReactNode, useEffect } from 'react'
import { useThemeStore } from '../store/ThemeStore'

interface ThemeWrapperProps {
  children: ReactNode
}

export const ThemeWrapper = ({ children }: ThemeWrapperProps) => {
  const { mode, toggleMode } = useThemeStore()

  useEffect(() => {
    const savedMode = localStorage.getItem('theme') || 'light'
    if (savedMode !== mode) {
      toggleMode()
    }
  }, [mode, toggleMode])

  const theme = createTheme({
    palette: {
      mode: mode,
      primary: {
        main: "#2A2A72",
      },
      secondary: {
        main: "#388659",
      },
      background: {
        default: mode === 'light' ? "#f0f4f7" : "#121212",
        paper: mode === 'light' ? "#FBFFFE" : "#333333"
      },
    },
  })

  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  )
}

