import { useThemeSetting } from '@tamagui/next-theme'

export const useTheme = () => {
  const { current: theme, toggle: toggleTheme } = useThemeSetting()

  return { theme, toggleTheme }
}
