import { Button, Image, XStack, YStack } from '@my/ui'
import { useLink } from 'solito/link'
import { SignedIn, SignedOut, useAuth, useUser } from '../utils/clerk'

export function Header() {
  const { signOut, isSignedIn } = useAuth()
  const { user } = useUser()

  const signInOAuthLinkProps = useLink({
    href: '/signin',
  })
  const profileLinkProps = useLink({
    href: '/profile',
  })
  const homeLinkProps = useLink({
    href: '/',
  })

  return (
    <YStack f={1} jc="center" w={'100%'} ai="center" space>
      <XStack space width={'100%'} ai="center" jc="space-between">
        <Button {...homeLinkProps} theme={'active'}>
          Home
        </Button>
        {isSignedIn ? (
          <SignedIn>
            <XStack space="$3">
              {window?.location?.pathname !== '/profile' && (
                <XStack space="$3">
                  <Image
                    source={{
                      uri: user?.imageUrl,
                      width: 40,
                      height: 40,
                    }}
                    accessibilityLabel="create-universal-app logo"
                    style={{ borderRadius: 40 }}
                  />

                  <Button {...profileLinkProps} theme={'active'}>
                    Profile
                  </Button>
                </XStack>
              )}
              <Button
                onPress={() => {
                  signOut()
                }}
                theme={'active'}
              >
                Log Out
              </Button>
            </XStack>
          </SignedIn>
        ) : (
          <SignedOut>
            <Button {...signInOAuthLinkProps} theme={'active'}>
              Sign In
            </Button>
          </SignedOut>
        )}
      </XStack>
    </YStack>
  )
}
