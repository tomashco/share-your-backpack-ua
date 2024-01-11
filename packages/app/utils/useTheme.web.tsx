import { useThemeSetting } from '@tamagui/next-theme'

export const useTheme = () => {
  const { current: theme, set: toggleTheme } = useThemeSetting()

  return { theme, toggleTheme }
}
