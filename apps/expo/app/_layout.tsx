import { Provider } from 'app/provider'
import { Home, User } from '@tamagui/lucide-icons'
import { useFonts } from 'expo-font'
import { Tabs } from 'expo-router'
import { useColorScheme } from 'react-native'
import { useContext } from 'react'
import { ThemeContext } from '@my/ui/src/ThemeProvider'

export default function HomeLayout() {
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  })
  const scheme = useColorScheme()

  if (!loaded) {
    return null
  }

  return (
    <Provider>
      <Tabs
        screenOptions={({ route }) => ({
          headerStyle: {
            height: 80, // Specify the height of your custom header
          },
          tabBarIcon: ({ focused, color, size }) => {
            if (route.name === 'index') {
              return <Home color={focused ? '$color10' : color} />
            } else if (route.name === 'profile') {
              return <User color={focused ? '$color10' : color} />
            }
          },
          // tabBarLabel
          tabBarActiveTintColor: 'gray',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        {['signin', 'signup', 'pack/[id]/edit', 'pack/[id]/index'].map((routeToHide) => (
          <Tabs.Screen key={routeToHide} name={routeToHide} options={{ href: null }} />
        ))}
      </Tabs>
    </Provider>
  )
}
