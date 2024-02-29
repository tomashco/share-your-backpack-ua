import React from 'react'
import * as WebBrowser from 'expo-web-browser'
import { Button, PageLayout, Stack, XStack, YStack } from '@my/ui'
import { useOAuth } from '../../utils/clerk'
import { useRouter } from 'solito/router'
import { Image } from 'react-native'

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
      const { createdSessionId, setActive } = await providerList[provider].oauthFlow()

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
    <PageLayout>
      <XStack alignItems="center" p="$2">
        <Button w={'$13'} onPress={() => onPress(providerList.google.key)} theme="active">
          <Image source={require('./google.png')} style={{ width: 20, height: 20 }} />
          Google
        </Button>
      </XStack>
      <XStack alignItems="center" p="$2">
        <Button w={'$13'} onPress={() => onPress(providerList.github.key)} theme="active">
          <Image source={require('./github.png')} style={{ width: 20, height: 20 }} />
          Github
        </Button>
      </XStack>
      <XStack alignItems="center" p="$2">
        <Button w={'$13'} onPress={() => onPress(providerList.facebook.key)} theme="active">
          <Image source={require('./facebook.png')} style={{ width: 20, height: 20 }} />
          Facebook
        </Button>
      </XStack>
    </PageLayout>
  )
}
