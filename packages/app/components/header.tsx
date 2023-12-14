import { Button, Paragraph, XStack, YStack } from '@my/ui'
import { useQueryClient } from '@tanstack/react-query'
import { useLink } from 'solito/link'
import { SignedIn, SignedOut, useAuth } from '../utils/clerk'

export function Header() {
  const { signOut, userId } = useAuth()
  const queryClient = useQueryClient()

  const signInOAuthLinkProps = useLink({
    href: '/signin',
  })
  const signUpLinkProps = useLink({
    href: '/signup',
  })

  return (
    <YStack f={1} jc="center" w={'100%'} ai="center" space>
      <SignedOut>
        <XStack space width={'100%'} ai="center" jc="flex-end">
          <Button {...signInOAuthLinkProps} theme={'active'}>
            Sign In
          </Button>
        </XStack>
      </SignedOut>

      <SignedIn>
        <XStack space width={'100%'} ai="center" jc="flex-end">
          <Paragraph>{userId}</Paragraph>
          <Button
            onPress={() => {
              signOut()

              queryClient.invalidateQueries(['posts'])
              console.log('🚀 ~ file: header.tsx:35 ~ Header ~ queryClient')
            }}
            theme={'active'}
          >
            Sign Out
          </Button>
        </XStack>
      </SignedIn>
    </YStack>
  )
}
