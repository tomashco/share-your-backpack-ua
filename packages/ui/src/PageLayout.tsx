import { YStack } from 'tamagui'

export const PageLayout = ({ children }) => {
  return (
    <YStack f={1} jc="center" w={'100%'} ai="center" p="$4" space>
      {children}
    </YStack>
  )
}
