import {
  CustomToast,
  TamaguiProvider,
  TamaguiProviderProps,
  Theme,
  ThemeName,
  ToastProvider,
} from '@my/ui'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Platform, useColorScheme } from 'react-native'
import { AuthProvider } from './auth'
import { ToastViewport } from './ToastViewport'
import { TRPCProvider } from './trpc' //mobile only

import config from '../tamagui.config'
import { ThemeContext } from '@my/ui/src/ThemeProvider'
import { useState } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { enableLegacyWebImplementation } from 'react-native-gesture-handler'

export function Provider({ children, ...rest }: Omit<TamaguiProviderProps, 'config'>) {
  const scheme = useColorScheme()
  const [colorTheme, setColorTheme] = useState('green')
  const [mainTheme, setMainTheme] = useState('light')

  enableLegacyWebImplementation(Platform.OS === 'web' ? true : false)

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <TamaguiProvider config={config} disableInjectCSS defaultTheme={mainTheme} {...rest}>
            <ThemeContext.Provider value={{ colorTheme, setColorTheme, mainTheme, setMainTheme }}>
              <ThemeProvider value={mainTheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Theme name={colorTheme as ThemeName}>
                  <ToastProvider
                    swipeDirection="horizontal"
                    duration={4000}
                    native={[
                      /* uncomment the next line to do native toasts on mobile. NOTE: it'll require you making a dev build and won't work with Expo Go */
                      'mobile',
                    ]}
                  >
                    <TRPCProvider>{children}</TRPCProvider>
                    <CustomToast />
                    <ToastViewport />
                  </ToastProvider>
                </Theme>
              </ThemeProvider>
            </ThemeContext.Provider>
          </TamaguiProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
