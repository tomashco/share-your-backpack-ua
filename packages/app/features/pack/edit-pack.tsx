import { Paragraph, ScrollView, YStack, Spinner } from '@my/ui'
import { PageLayout, Table } from '@my/ui/src'
import { CreatePackForm } from '@my/ui/src/packForm'
import { Header } from 'app/components/header'
import { useUser } from '../../utils/clerk'
import { onAppStateChange, trpc } from 'app/utils/trpc'
import React from 'react'
import { createParam } from 'solito'
import { useRouter } from 'solito/router'

const { useParam } = createParam<{ id: string }>()

export function EditPackScreen() {
  const [id] = useParam('id')
  const { data, isLoading, error } = trpc.packs.getById.useQuery({ id: id || '' })
  const { isLoaded: userIsLoaded, user } = useUser()
  const { push } = useRouter()
  const isEditable = user?.id === data?.authorId

  if (isLoading || !userIsLoaded || error)
    return (
      <YStack padding="$3" space="$4" fullscreen alignItems="center" justifyContent="center">
        {isLoading || !userIsLoaded ? (
          <Spinner size="large" color="$gray10" />
        ) : (
          <Paragraph>{error?.message}</Paragraph>
        )}
      </YStack>
    )

  if (!isEditable) return push('/')

  return (
    <ScrollView
      onScrollBeginDrag={() => onAppStateChange('active')}
      onScrollEndDrag={() => onAppStateChange('inactive')}
    >
      <PageLayout>
        <Header />
        <YStack w="100%" $gtSm={{ width: '35rem' }}>
          <YStack
            $gtSm={{
              width: '25rem',
            }}
            w="100%"
          >
            <CreatePackForm
              packId={data.id}
              packName={data.name ?? ''}
              packDescription={data.description ?? ''}
            />
          </YStack>
        </YStack>
        <Table data={data} />
      </PageLayout>
    </ScrollView>
  )
}
