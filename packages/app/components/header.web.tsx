import { Button, Image, Popover, Text, XStack, YStack } from '@my/ui'
import { Link, useLink } from 'solito/link'
import { useRouter } from 'solito/router'
import { SignedIn, SignedOut, useAuth, useUser } from '../utils/clerk'

export function Header() {
  const { signOut, isSignedIn } = useAuth()
  const { user } = useUser()
  const { push } = useRouter()

  const signUpOAuthLinkProps = useLink({
    href: '/signup',
  })
  const signInOAuthLinkProps = useLink({
    href: '/signin',
  })
  const profileLinkProps = useLink({
    href: '/profile',
  })
  const myItemsLinkProps = useLink({
    href: '/my-gear',
  })
  const homeLinkProps = useLink({
    href: '/',
  })

  return (
    <YStack f={1} jc="center" w={'100%'} ai="center" space>
      <XStack space width={'100%'} ai="center" jc="space-between">
        <Link {...homeLinkProps}>
          <XStack ai="center" space="$3">
            <Image
              source={{
                uri: '/backpack.png',
                width: 40,
                height: 40,
              }}
              accessibilityLabel="sharepack logo"
            />
            <Text>SharePack</Text>
          </XStack>
        </Link>
        {isSignedIn ? (
          <Popover size="$5" allowFlip placement="bottom">
            <Popover.Trigger asChild>
              <Image
                source={{
                  uri: user?.imageUrl,
                  width: 40,
                  height: 40,
                }}
                accessibilityLabel="user profile image"
                style={{ borderRadius: 40 }}
              />
            </Popover.Trigger>

            <Popover.Content
              borderWidth={1}
              borderColor="$borderColor"
              enterStyle={{ y: -10, opacity: 0 }}
              exitStyle={{ y: -10, opacity: 0 }}
              elevate
              animation={[
                'quick',
                {
                  opacity: {
                    overshootClamping: true,
                  },
                },
              ]}
            >
              <Popover.Arrow borderWidth={1} borderColor="$borderColor" />
              <SignedIn>
                <YStack space="$3">
                  <Button {...profileLinkProps} theme={'active'}>
                    Profile
                  </Button>
                  <Button {...myItemsLinkProps} theme={'active'}>
                    My Gear
                  </Button>
                  <Button
                    onPress={() => {
                      push(`/my-packs/${user?.id}`)
                    }}
                    theme={'active'}
                  >
                    My Packs
                  </Button>
                  <Button
                    onPress={() => {
                      signOut()
                    }}
                    theme={'active'}
                  >
                    Log Out
                  </Button>
                </YStack>
              </SignedIn>
            </Popover.Content>
          </Popover>
        ) : (
          <SignedOut>
            <XStack gap={'$3'}>
              <Button {...signUpOAuthLinkProps} theme={'active'}>
                Sign Up
              </Button>
              <Button {...signInOAuthLinkProps} theme={'active'}>
                Sign In
              </Button>
            </XStack>
          </SignedOut>
        )}
      </XStack>
    </YStack>
  )
}
