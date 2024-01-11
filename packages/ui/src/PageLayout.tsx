import { ScrollView, Theme, ThemeName, YStack } from 'tamagui'
import { useState, useContext } from 'react'
import { ThemeContext } from './ThemeProvider'

export const PageLayout = ({ children, scrollViewProps }) => {
  const { colorTheme } = useContext(ThemeContext)
  return (
    <ScrollView theme={colorTheme} backgroundColor={'$background'} {...scrollViewProps}>
      <YStack f={1} jc="center" w={'100%'} ai="center" p="$4" pb="$6" space>
        {children}
      </YStack>
    </ScrollView>
  )
}
