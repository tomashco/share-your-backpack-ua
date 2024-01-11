import { Appearance } from 'react-native'

export const useTheme = () => {
  const colorScheme = Appearance.getColorScheme()
  const toggleTheme = (value) => Appearance.setColorScheme(value)
  return { theme: colorScheme, toggleTheme }
}
