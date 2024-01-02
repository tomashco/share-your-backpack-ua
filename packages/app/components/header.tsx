import { Button, Image, XStack, YStack } from '@my/ui'
import { useLink } from 'solito/link'
import { SignedIn, SignedOut, useAuth, useUser } from '../utils/clerk'

export function Header() {
  const { signOut } = useAuth()
  const { user } = useUser()

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
          <Image
            source={{
              uri: user?.imageUrl,
              width: 40,
              height: 40,
            }}
            accessibilityLabel="create-universal-app logo"
            style={{ borderRadius: 40 }}
          />
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
