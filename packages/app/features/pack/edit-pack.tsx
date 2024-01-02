import { Paragraph, ScrollView, YStack, Spinner, Button } from '@my/ui'
import { PageLayout, Table } from '@my/ui/src'
import { PackForm, PackItemForm } from '@my/ui/src'
import { Header } from 'app/components/header'
import { useUser } from '../../utils/clerk'
import { onAppStateChange, trpc } from 'app/utils/trpc'
import React, { useState } from 'react'
import { createParam } from 'solito'
import { useRouter } from 'solito/router'

const { useParam } = createParam<{ id: string }>()

export function EditPackScreen() {
  const [id] = useParam('id')
  const { data, isLoading, error } = trpc.packs.getById.useQuery({ id: id || '' })
  const [showPackItemForm, setShowPackItemForm] = useState(false)
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
            <PackForm
              packId={data.id}
              packName={data.name ?? ''}
              packDescription={data.description ?? ''}
            />
          </YStack>
        </YStack>
        <Table data={data} />
        <Button onPress={() => setShowPackItemForm(true)}>Add new item</Button>
        {showPackItemForm && <PackItemForm packId={data.id} />}
      </PageLayout>
    </ScrollView>
  )
}
