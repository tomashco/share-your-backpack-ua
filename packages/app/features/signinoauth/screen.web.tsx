import React from 'react'
import { YStack } from '@my/ui'
import { SignIn } from '@clerk/nextjs'

const SignInWithOAuth = () => {
  return (
    <YStack f={1} jc="center" ai="center" p="$4" space>
      <SignIn />
    </YStack>
  )
}
export default SignInWithOAuth
