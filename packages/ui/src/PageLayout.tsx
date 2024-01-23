import { ScrollView, YStack } from 'tamagui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Header } from 'app/components/header'
import { Platform } from 'react-native'

export const PageLayout = ({ children, scrollViewProps }) => {
  const { top, bottom } = useSafeAreaInsets()
  return (
    <ScrollView backgroundColor={'$color4'} {...scrollViewProps}>
      <YStack mb={'$13'} p={'$4'} f={1} jc="center" w={'100%'} ai="center" space>
        {Platform.OS === 'web' && <Header />}
        {children}
      </YStack>
    </ScrollView>
  )
}
