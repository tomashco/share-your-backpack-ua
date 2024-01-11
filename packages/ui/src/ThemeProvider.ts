//Context.js

import { createContext } from 'react'
export const ThemeContext = createContext({
  colorTheme: 'yellow',
  setColorTheme: (value: string) => {},
  mainTheme: 'light',
  setMainTheme: (value: string) => {},
})
