import React from 'react'
import { Button, H3, Image, PageLayout, ToggleGroup, View, XStack, YStack } from '@my/ui'
import { useLink } from 'solito/link'
import { SignedIn, SignedOut, useAuth, useUser } from 'app/utils/clerk'
import { ThemeContext } from '@my/ui/src/ThemeProvider'
import { SunMedium, Moon } from '@tamagui/lucide-icons'
import { useTheme } from 'app/utils/useTheme'
import { useContext } from 'react'
import { Platform } from 'react-native'

export function ProfileScreen() {
  const { user } = useUser()
  const myItemsLinkProps = useLink({
    href: '/my-items',
  })

  const { toggleTheme } = useTheme()
  const { setColorTheme, mainTheme, setMainTheme } = useContext(ThemeContext)
  const { signOut, isSignedIn } = useAuth()
  const themeColors = ['orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'red']

  const signInOAuthLinkProps = useLink({
    href: '/signin',
  })

  return (
    <PageLayout scrollViewProps={{}}>
      {Platform.OS !== 'web' && isSignedIn ? (
        <SignedIn>
          <XStack w="100%" justifyContent="flex-end">
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
          <XStack w="100%" justifyContent="flex-end">
            <Button {...signInOAuthLinkProps} theme={'active'}>
              Sign In
            </Button>
          </XStack>
        </SignedOut>
      )}
      <YStack ai={'center'}>
        <Image
          source={{
            uri: user?.imageUrl,
            width: 120,
            height: 120,
          }}
          accessibilityLabel="create-universal-app logo"
          style={{ borderRadius: 120 }}
        />
        <H3>{user?.fullName}</H3>
      </YStack>
      <XStack flexDirection="row" alignItems="center" justifyContent="center" space="$4">
        <ToggleGroup
          orientation="horizontal"
          type="single"
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
        <ToggleGroup
          orientation="horizontal"
          type="single"
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
      <Button {...myItemsLinkProps} theme={'active'} w={'100%'}>
        My Items
      </Button>
    </PageLayout>
  )
}
