import { Button, Image, Paragraph, Switch, ToggleGroup, XStack, YStack } from '@my/ui'
import { ThemeContext } from '@my/ui/src/ThemeProvider'
import { SunMedium, Moon } from '@tamagui/lucide-icons'
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
      <XStack width={200} alignItems="center" space="$4">
        <Paragraph>Change Color Scheme</Paragraph>
        {Object.keys(lightDark).map((el) => (
          <Button
            circular
            variant="outlined"
            size={'$1'}
            key={lightDark[el]}
            // backgroundColor={el}
            onPress={() => setColorTheme(lightDark[el])}
          />
        ))}
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
      </XStack>
      <XStack>
        {themeColors.map((col) => (
          <Button
            circular
            size={'$1'}
            key={col}
            backgroundColor={col}
            onPress={() => setColorTheme(col)}
          />
        ))}
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
