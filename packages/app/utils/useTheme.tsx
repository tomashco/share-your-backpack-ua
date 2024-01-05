import { Appearance } from 'react-native'

export const useTheme = () => {
  const colorScheme = Appearance.getColorScheme()
  const toggleTheme = () => Appearance.setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')
  return { theme: colorScheme, toggleTheme }
}
