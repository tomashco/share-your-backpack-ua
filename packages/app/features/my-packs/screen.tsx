import React from 'react'
import { H1, PageLayout, Paragraph, Spinner, YStack } from '@my/ui'
import { trpc } from '../../utils/trpc'
import { useUser } from '../../utils/clerk'
import { useRouter } from 'solito/router'

export function MyPacksScreen() {
  const { data, isLoading, error } = trpc.packs.getItems.useQuery()
  const { isLoaded: userIsLoaded, isSignedIn, user } = useUser()

  const { push } = useRouter()

  if (isSignedIn === false) {
    push('/')
    return <></>
  }

  if (isLoading || error)
    return (
      <YStack padding="$3" space="$4" fullscreen alignItems="center" justifyContent="center">
        {isLoading || !userIsLoaded ? (
          <Spinner size="large" color="$gray10" />
        ) : (
          <Paragraph>{error?.message}</Paragraph>
        )}
      </YStack>
    )

  return (
    <PageLayout scrollViewProps={{}}>
      <H1>My Packs! - to be implemented</H1>
    </PageLayout>
  )
}
