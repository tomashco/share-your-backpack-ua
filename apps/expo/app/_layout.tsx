import { Button, Image, Paragraph } from '@my/ui'
import { Provider } from 'app/provider'
import { useFonts } from 'expo-font'
import { Stack, Tabs } from 'expo-router'
import { useColorScheme } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

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
      <Tabs>
        {['signin', 'signup', 'pack/[id]/edit', 'pack/[id]/index'].map((routeToHide) => (
          <Tabs.Screen key={routeToHide} name={routeToHide} options={{ href: null }} />
        ))}
      </Tabs>
    </Provider>
  )
}
