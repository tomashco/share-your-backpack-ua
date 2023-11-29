import { YStack, Button, H1, Paragraph } from '@my/ui'
import React from 'react'
import { useRouter } from 'solito/router'

export function VerifyEmailCompletedScreen() {
  const { push } = useRouter()

  const onPress = async () => {
    push('/')
  }
  return (
    <YStack f={1} jc="center" ai="center" p="$4" space>
      <H1 ta="center" mt="$2">
        Email verified
      </H1>
      <Paragraph ta="center">
        Thank you for verifying your email address. You can return to home now.
      </Paragraph>
      <Button onPress={onPress} size="$3" theme={'active'}>
        Return to home
      </Button>
    </YStack>
  )
}
