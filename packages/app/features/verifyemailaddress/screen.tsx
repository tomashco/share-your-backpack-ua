import { YStack, Button, H1, Paragraph } from '@my/ui'
import React from 'react'
import { useRouter } from 'solito/router'

export function VerifyEmailAddressScreen() {
  const { push } = useRouter()

  const onPress = async () => {
    push('/')
  }
  return (
    <YStack f={1} jc="center" ai="center" p="$4" space>
      <H1 ta="center" mt="$2">
        Verify your email address
      </H1>
      <Paragraph ta="center">
        An email has been sent to your email address. Please click the link in the email to verify
        your email address.
      </Paragraph>
      <Button onPress={onPress} size="$3" theme={'active'}>
        Return to home
      </Button>
    </YStack>
  )
}
