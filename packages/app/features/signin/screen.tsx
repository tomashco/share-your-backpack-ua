import { YStack, Input, XStack, Button } from '@my/ui'
import React from 'react'
import { useRouter } from 'solito/router'
import { useSignIn } from '../../utils/clerk'

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const { push } = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')

  const onSignInPress = async () => {
    if (!isLoaded) {
      return
    }
    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      })
      setActive({ session: completeSignIn.createdSessionId })
      push('/')
    } catch (err: any) {}
  }
  return (
    <YStack f={1} jc="center" ai="center" p="$4" space>
      <XStack alignItems="center" space="$2">
        <Input
          flex={1}
          size="$3"
          value={emailAddress}
          placeholder="Email..."
          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        />
      </XStack>
      <XStack alignItems="center" space="$2">
        <Input
          flex={1}
          size="$3"
          value={password}
          placeholder="Password..."
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
      </XStack>
      <Button onPress={onSignInPress} size="$3" theme={'active'}>
        Sign in
      </Button>
    </YStack>
  )
}
