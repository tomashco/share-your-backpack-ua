import { Button, Paragraph, XStack, YStack } from '@my/ui'
import { Platform } from 'react-native'
import { useLink } from 'solito/link'
import { SignedIn, SignedOut, useAuth } from '../utils/clerk'

export function Header() {
  const { signOut, userId } = useAuth()

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
          {Platform.OS === 'web' && (
            <Button {...signUpLinkProps} themeInverse>
              Sign Up
            </Button>
          )}
        </XStack>
      </SignedOut>

      <SignedIn>
        <XStack space width={'100%'} ai="center" jc="flex-end">
          <Paragraph>{userId}</Paragraph>
          <Button
            onPress={() => {
              signOut()
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
