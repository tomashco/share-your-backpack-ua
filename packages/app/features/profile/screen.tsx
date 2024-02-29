import React from 'react'
import {
  Anchor,
  Button,
  H3,
  isWeb,
  PageLayout,
  Paragraph,
  ToggleGroup,
  View,
  XStack,
  YStack,
} from '@my/ui'
import { isIos } from '@tamagui/constants'
import { useLink } from 'solito/link'
import { SignedIn, SignedOut, useAuth, useUser } from 'app/utils/clerk'
import { ThemeContext } from '@my/ui/src/ThemeProvider'
import { SunMedium, Moon } from '@tamagui/lucide-icons'
import { useTheme } from 'app/utils/useTheme'
import { useContext } from 'react'
import { ChangeWeightUnit } from '@my/ui/src'
import { trpc } from 'app/utils/trpc'
import { Image } from 'react-native'

export function ProfileScreen() {
  const { user } = useUser()

  const { toggleTheme } = useTheme()
  const { setColorTheme, mainTheme, setMainTheme } = useContext(ThemeContext)
  const { signOut, isSignedIn } = useAuth()
  const {
    data: authorData,
    isLoading,
    error,
  } = trpc.packs.getUser.useQuery({ authorId: user?.id || '' })
  const themeColors = ['orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'red']
  // const [localUnit, setLocalUnit] = useState(authorData?.unit || 'g')

  const signInOAuthLinkProps = useLink({
    href: '/signin',
  })

  return (
    <>
      <PageLayout>
        {!isWeb && isSignedIn ? (
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
            <XStack w="100%" justifyContent="flex-end" gap="$3">
              <Button {...signInOAuthLinkProps} theme={'active'}>
                Sign In
              </Button>
            </XStack>
          </SignedOut>
        )}
        <YStack ai={'center'}>
          {user?.imageUrl && (
            <Image
              source={{
                uri: user?.imageUrl,
                width: 120,
                height: 120,
              }}
              accessibilityLabel="create-universal-app logo"
              style={{
                borderRadius: 60,
              }}
            />
          )}
          <H3>{user?.fullName}</H3>
        </YStack>
        <YStack alignItems="center" justifyContent="center" space="$4">
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
          {/* {isSignedIn && <ChangeWeightUnit onValueChange={setLocalUnit} localUnit={localUnit} />} */}
        </YStack>
        <YStack alignSelf={'stretch'} />
      </PageLayout>
      {!isWeb && (
        <Paragraph position="absolute" bottom={0} right="$4" fontSize={'$4'}>
          Built with ❤️ by <Anchor href="https://tomashco.github.io">Tom</Anchor>
        </Paragraph>
      )}
    </>
  )
}
