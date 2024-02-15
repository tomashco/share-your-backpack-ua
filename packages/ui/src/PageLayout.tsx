import { Anchor, Paragraph, ScrollView, Separator, YStack } from 'tamagui'
import { Header } from 'app/components/header'
import { LayoutChangeEvent, Platform } from 'react-native'

export const PageLayout = ({
  children,
  scrollViewProps,
  layout,
}: {
  children: React.ReactNode
  scrollViewProps?: object
  layout?: React.RefObject<LayoutChangeEvent['nativeEvent']['layout'] | null>
}) => {
  const Footer = () => (
    <Paragraph textAlign="right" px={'$4'} fontSize={'$4'}>
      Built with ❤️ by <Anchor href="https://tomashco.github.io">Tom</Anchor>
    </Paragraph>
  )
  return (
    <YStack f={1} backgroundColor={'$color4'}>
      <ScrollView mb={Platform.OS !== 'web' ? '$13' : 0} {...scrollViewProps}>
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
            // space
          >
            <Header />
          </YStack>
        )}
        <YStack
          p={'$4'}
          f={1}
          jc="center"
          w={'100%'}
          alignSelf="center"
          ai="center"
          $gtSm={{ width: '35rem' }}
          space
          onLayout={(event) => {
            const { x, y, height, width } = event.nativeEvent.layout
            if (layout?.current) Object.assign(layout.current, { x, y, height, width })
          }}
        >
          {children}
        </YStack>
        {Platform.OS !== 'web' && <Footer />}
      </ScrollView>
      {Platform.OS === 'web' && (
        <YStack position="absolute" bottom={0} right={0}>
          <Footer />
        </YStack>
      )}
    </YStack>
  )
}
