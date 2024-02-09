import React from 'react'
import { Button, H1, Image, PageLayout, Paragraph, Spinner, XStack, YStack } from '@my/ui'
import { trpc } from '../../utils/trpc'
import { useUser } from '../../utils/clerk'
import { useRouter } from 'solito/router'
import { createParam } from 'solito'

const { useParam } = createParam<{ authorId: string }>()

export function MyPacksScreen() {
  const [authorId] = useParam('authorId')
  const {
    data: packsByUser,
    isLoading,
    error,
  } = trpc.packs.getPacksByUser.useQuery({ authorId: authorId || '' })
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
      <H1>My Packs</H1>
      <YStack>
        {isLoading ? (
          <Paragraph>Loading...</Paragraph>
        ) : error ? (
          <Paragraph>{error}</Paragraph>
        ) : (
          <XStack flexWrap="wrap" jc="space-between">
            {packsByUser.map(({ name, packId }) => (
              <XStack p="$2" ai="center" key={packId}>
                <Button
                  theme="active"
                  accessibilityRole="link"
                  onPress={() => {
                    push(`/pack/${packId}`)
                  }}
                >
                  {name}
                </Button>
              </XStack>
            ))}
          </XStack>
        )}
      </YStack>
    </PageLayout>
  )
}
