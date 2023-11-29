import { Button, Input, XStack, YStack } from '@my/ui'
import * as React from 'react'
import { useSignUp } from '../../utils/clerk'

export function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()

  const [firstName, setFirstName] = React.useState('')
  const [lastName, setLastName] = React.useState('')
  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')

  // start the sign up process.
  const onSignUpPress = async () => {
    if (!isLoaded) {
      return
    }

    try {
      const res = await signUp.create({
        firstName,
        lastName,
        emailAddress,
        password,
      })
      console.log('signUp', res)

      // send the email.
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // change the UI to our pending section.
      setPendingVerification(true)
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2))
    }
  }

  // This verifies the user using email code that is delivered.
  const onPressVerify = async () => {
    if (!isLoaded) {
      return
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      })

      await setActive({ session: completeSignUp.createdSessionId })
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2))
    }
  }

  return (
    <YStack f={1} jc="center" ai="center">
      {!pendingVerification && (
        <>
          <XStack alignItems="center" p="$2">
            <Input
              flex={1}
              size="$3"
              value={firstName}
              placeholder="First Name..."
              onChangeText={(firstName) => setFirstName(firstName)}
            />
          </XStack>
          <XStack alignItems="center" p="$2">
            <Input
              flex={1}
              size="$3"
              value={lastName}
              placeholder="Last Name..."
              onChangeText={(lastName) => setLastName(lastName)}
            />
          </XStack>
          <XStack alignItems="center" p="$2">
            <Input
              flex={1}
              size="$3"
              value={emailAddress}
              placeholder="Email..."
              onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
            />
          </XStack>
          <XStack alignItems="center" p="$2">
            <Input
              flex={1}
              size="$3"
              value={password}
              placeholder="Password..."
              secureTextEntry={true}
              onChangeText={(password) => setPassword(password)}
            />
          </XStack>
          <Button onPress={onSignUpPress} size="$3" theme={'active'}>
            Sign in
          </Button>
        </>
      )}
      {pendingVerification && (
        <>
          <XStack alignItems="center" p="$2">
            <Input
              flex={1}
              size="$3"
              value={code}
              placeholder="Code..."
              onChangeText={(code) => setCode(code)}
            />
          </XStack>
          <Button onPress={onPressVerify} size="$3" theme={'active'}>
            Verify Email
          </Button>
        </>
      )}
    </YStack>
  )
}
