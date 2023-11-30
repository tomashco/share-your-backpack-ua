import React from 'react'
import { YStack } from '@my/ui'
import { SignUp } from '@clerk/nextjs'

export function SignUpScreen() {
  return (
    <YStack f={1} jc="center" ai="center" p="$4" space>
      <div
        style={{
          fontFamily:
            'Inter, -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        }}
      >
        <SignUp />
      </div>
    </YStack>
  )
}
