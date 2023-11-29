import React from 'react'
import { YStack } from '@my/ui'
import { SignUp } from '@clerk/nextjs'

export function SignUpScreen() {
  return (
    <YStack f={1} jc="center" ai="center" p="$4" space>
      <SignUp />
    </YStack>
  )
}
