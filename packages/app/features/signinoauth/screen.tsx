import React from 'react'
import * as WebBrowser from 'expo-web-browser'
import { Button, XStack, YStack } from '@my/ui'
import { useOAuth } from '../../utils/clerk'
import { useRouter } from 'solito/router'

WebBrowser.maybeCompleteAuthSession()

export function SignInWithOAuthScreen() {
  const { startOAuthFlow: googleOAuthFlow } = useOAuth({ strategy: 'oauth_google' })
  const { startOAuthFlow: githubOAuthFlow } = useOAuth({ strategy: 'oauth_github' })
  const { startOAuthFlow: facebookOAuthFlow } = useOAuth({ strategy: 'oauth_facebook' })
  const providerList = {
    google: { key: 'google', oauthFlow: googleOAuthFlow },
    github: { key: 'github', oauthFlow: githubOAuthFlow },
    facebook: { key: 'facebook', oauthFlow: facebookOAuthFlow },
  }
  const { push } = useRouter()

  const onPress = React.useCallback(async (provider: string) => {
    try {
      const { createdSessionId, signIn, signUp, setActive } = await providerList[
        provider
      ].oauthFlow()

      if (createdSessionId && setActive) {
        setActive({ session: createdSessionId })
        push('/')
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error('OAuth error', err)
    }
  }, [])

  return (
    <YStack f={1} jc="center" ai="center" p="$4" space>
      <XStack alignItems="center" p="$2">
        <Button onPress={() => onPress(providerList.google.key)} theme="active">
          Google Sign In
        </Button>
      </XStack>
      <XStack alignItems="center" p="$2">
        <Button onPress={() => onPress(providerList.github.key)} theme="active">
          Github Sign In
        </Button>
      </XStack>
      <XStack alignItems="center" p="$2">
        <Button onPress={() => onPress(providerList.facebook.key)} theme="active">
          Facebook Sign In
        </Button>
      </XStack>
    </YStack>
  )
}
