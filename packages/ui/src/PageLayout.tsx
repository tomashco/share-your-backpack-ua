import { ScrollView, Theme, ThemeName, YStack } from 'tamagui'
import { useState } from 'react'
import { ThemeContext } from './ThemeProvider'

export const PageLayout = ({ children, scrollViewProps }) => {
  const [colorTheme, setColorTheme] = useState('green')
  const [mainTheme, setMainTheme] = useState('light')
  return (
    <ThemeContext.Provider value={{ colorTheme, setColorTheme, mainTheme, setMainTheme }}>
      <Theme name={mainTheme as ThemeName}>
        <ScrollView theme={colorTheme} backgroundColor={'$background'} {...scrollViewProps}>
          <YStack f={1} jc="center" w={'100%'} ai="center" p="$4" pb="$6" space>
            {children}
          </YStack>
        </ScrollView>
      </Theme>
    </ThemeContext.Provider>
  )
}
