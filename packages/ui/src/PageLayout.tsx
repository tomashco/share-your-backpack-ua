import { ScrollView, YStack } from 'tamagui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export const PageLayout = ({ children, scrollViewProps }) => {
  const { top, bottom } = useSafeAreaInsets()
  return (
    <ScrollView backgroundColor={'$color4'} {...scrollViewProps}>
      <YStack
        marginBottom={bottom * 3}
        f={1}
        jc="center"
        w={'100%'}
        ai="center"
        p="$4"
        pb="$6"
        space
      >
        {children}
      </YStack>
    </ScrollView>
  )
}
