import { ScrollView, YStack } from 'tamagui'
import { Header } from 'app/components/header'
import { Platform } from 'react-native'

export const PageLayout = ({ children, scrollViewProps }) => {
  return (
    <ScrollView backgroundColor={'$color4'} {...scrollViewProps}>
      {Platform.OS === 'web' && (
        <YStack
          p={'$4'}
          pb={0}
          f={1}
          jc="center"
          w={'100%'}
          ai="center"
          alignSelf="center"
          $gtMd={{ width: '45rem' }}
          space
        >
          <Header />
        </YStack>
      )}
      <YStack
        mb={'$13'}
        p={'$4'}
        f={1}
        jc="center"
        w={'100%'}
        alignSelf="center"
        ai="center"
        $gtSm={{ width: '35rem' }}
        space
      >
        {children}
      </YStack>
    </ScrollView>
  )
}
