import { Button, H3, Image, Paragraph, Switch, ToggleGroup, View, XStack, YStack } from '@my/ui'
import { ThemeContext } from '@my/ui/src/ThemeProvider'
import { SunMedium, Moon, LogOut } from '@tamagui/lucide-icons'
import { useTheme } from 'app/utils/useTheme'
import { useContext } from 'react'
import { useLink } from 'solito/link'
import { SignedIn, SignedOut, useAuth, useUser } from '../utils/clerk'

export function Header() {
  const { signOut } = useAuth()
  const { user } = useUser()

  const { toggleTheme } = useTheme()
  const { setColorTheme, mainTheme, setMainTheme } = useContext(ThemeContext)
  const themeColors = ['orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'red']
  const lightDark = {
    white: 'light',
    black: 'dark',
  }

  const signInOAuthLinkProps = useLink({
    href: '/signin',
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
            Log Out
          </Button>
        </XStack>
      </SignedIn>
      <XStack flexDirection="row" alignItems="center" justifyContent="center" space="$4">
        <ToggleGroup
          orientation="horizontal"
          type="single"
          size="$3"
          onValueChange={(val) => {
            toggleTheme(val)
            setMainTheme(val)
          }}
          defaultValue={mainTheme as string}
          disableDeactivation
        >
          <ToggleGroup.Item value="light" aria-label="Left aligned">
            <SunMedium />
          </ToggleGroup.Item>
          <ToggleGroup.Item value="dark" aria-label="Right aligned">
            <Moon />
          </ToggleGroup.Item>
        </ToggleGroup>
      </XStack>
      <XStack flexDirection="row" alignItems="center" justifyContent="center" space="$4">
        <ToggleGroup
          orientation="horizontal"
          type="single"
          size="$2"
          onValueChange={(val) => {
            setColorTheme(val)
          }}
          defaultValue={mainTheme as string}
          disableDeactivation
        >
          {themeColors.map((color, index) => (
            <ToggleGroup.Item
              key={color}
              value={color}
              aria-label={
                index === 0
                  ? 'left aligned'
                  : index === themeColors.length - 1
                  ? 'right aligned'
                  : 'center aligned'
              }
            >
              <View w={'$1'} h={'$1'} br="$5" backgroundColor={color} />
            </ToggleGroup.Item>
          ))}
        </ToggleGroup>
      </XStack>
    </YStack>
  )
}
