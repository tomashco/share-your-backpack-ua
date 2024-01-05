import { Button, Image, Paragraph, Switch, XStack, YStack } from '@my/ui'
import { useTheme } from 'app/utils/useTheme'
import { useLink } from 'solito/link'
import { SignedIn, SignedOut, useAuth, useUser } from '../utils/clerk'

export function Header() {
  const { signOut } = useAuth()
  const { user } = useUser()

  const { theme, toggleTheme } = useTheme()

  const signInOAuthLinkProps = useLink({
    href: '/signin',
  })

  return (
    <YStack f={1} jc="center" w={'100%'} ai="center" space>
      <XStack width={200} alignItems="center" space="$4">
        <Paragraph>Change Color Scheme</Paragraph>
        <Switch
          id={'switchId'}
          checked={theme === 'dark'}
          onPress={() => {
            toggleTheme()
          }}
          size={'$2'}
          defaultChecked
        >
          <Switch.Thumb animation="bouncy" />
        </Switch>
      </XStack>
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
