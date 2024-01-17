import {
  CustomToast,
  TamaguiProvider,
  TamaguiProviderProps,
  Theme,
  ThemeName,
  ToastProvider,
} from '@my/ui'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useColorScheme } from 'react-native'
import { AuthProvider } from './auth'
import { ToastViewport } from './ToastViewport'
import { TRPCProvider } from './trpc' //mobile only

import config from '../tamagui.config'
import { ThemeContext } from '@my/ui/src/ThemeProvider'
import { useState } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

export function Provider({ children, ...rest }: Omit<TamaguiProviderProps, 'config'>) {
  const scheme = useColorScheme()
  const [colorTheme, setColorTheme] = useState('green')
  const [mainTheme, setMainTheme] = useState('light')

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <TamaguiProvider config={config} disableInjectCSS defaultTheme={mainTheme} {...rest}>
          <ToastProvider
            swipeDirection="horizontal"
            duration={6000}
            native={
              [
                /* uncomment the next line to do native toasts on mobile. NOTE: it'll require you making a dev build and won't work with Expo Go */
                // 'mobile'
              ]
            }
          >
            <ThemeContext.Provider value={{ colorTheme, setColorTheme, mainTheme, setMainTheme }}>
              <ThemeProvider value={mainTheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Theme name={colorTheme as ThemeName}>
                  <TRPCProvider>{children}</TRPCProvider>
                </Theme>
              </ThemeProvider>
            </ThemeContext.Provider>
            <CustomToast />
            <ToastViewport />
          </ToastProvider>
        </TamaguiProvider>
      </AuthProvider>
    </SafeAreaProvider>
  )
}
