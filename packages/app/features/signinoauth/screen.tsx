import React from 'react'
import * as WebBrowser from 'expo-web-browser'
import { Button, XStack, YStack } from '@my/ui'
import { useOAuth } from '../../utils/clerk'
import { useRouter } from 'solito/router'

WebBrowser.maybeCompleteAuthSession()

const SignInWithOAuth = () => {
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' })
  const { push } = useRouter()

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow()

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
        <Button onPress={onPress} theme="active">
          Google Sign In
        </Button>
      </XStack>
    </YStack>
  )
}
export default SignInWithOAuth
