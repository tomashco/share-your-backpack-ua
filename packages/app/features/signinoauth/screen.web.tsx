import React from 'react'
import { YStack } from '@my/ui'
import { SignIn } from '@clerk/nextjs'

export function SignInWithOAuthScreen() {
  return (
    <YStack f={1} jc="center" ai="center" p="$4" space>
      <div
        style={{
          fontFamily:
            'Inter, -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        }}
      >
        <SignIn />
      </div>
    </YStack>
  )
}
