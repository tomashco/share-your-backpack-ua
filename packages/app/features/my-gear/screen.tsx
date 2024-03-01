import React, { useState } from 'react'
import { Button, PageLayout, Paragraph, Spinner, Text, XStack, YStack } from '@my/ui'
import { trpc } from '../../utils/trpc'
import { useUser } from '../../utils/clerk'
import { useRouter } from 'solito/router'
import { GenericTable, ItemForm } from '@my/ui/src'
import { convertWeight } from 'app/utils/utils'

export function MyGearScreen() {
  const { data: userItems, isLoading, error } = trpc.packs.getItems.useQuery()
  const { isLoaded: userIsLoaded, isSignedIn, user } = useUser()
  const [newItemForm, toggleNewItemForm] = useState(false)
  const { data: authorInfo } = trpc.packs.getUser.useQuery({ authorId: user?.id || '' })
  const [localUnit, setLocalUnit] = useState(authorInfo?.unit || 'g')

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

  const tableHeaders = [
    { key: 'name', label: 'Name' },
    { key: 'model', label: 'Model' },
    { key: 'brand', label: 'Brand' },
    { key: 'weight', label: `Weight (${authorInfo?.unit || ''})`, width: 100, textAlign: 'center' },
    // { key: 'isBag', label: 'Bag', width: 60, textAlign: 'center' },
  ]

  const data = userItems.map((item) => {
    return {
      id: item.itemId,
      ...item,
      detailedView: (props) => (
        <ItemForm
          authorInfo={authorInfo}
          itemId={item.itemId}
          itemName={item.name}
          itemModel={item.model}
          itemBrand={item.brand || ''}
          itemUrl={item.itemUrl || ''}
          imageUrl={item.imageUrl || ''}
          {...props}
        />
      ),
    }
  })

  return (
    <PageLayout>
      <XStack w="100%" jc={'flex-end'}>
        <Button onPress={() => toggleNewItemForm(!newItemForm)} theme={'active'}>
          {newItemForm ? 'Close Edit' : 'New Item'}
        </Button>
      </XStack>
      {newItemForm && <ItemForm authorInfo={authorInfo} />}

      {isLoading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text>{JSON.stringify(error)}</Text>
      ) : (
        <>
          <GenericTable headers={tableHeaders} data={data} />
        </>
      )}
      <YStack w="100%">
        <Paragraph textAlign="right" mr="$8">
          Total weight:{' '}
          {convertWeight(
            userItems?.reduce((acc, item) => acc + (item.weight || 0), 0) || 0,
            localUnit
          )}
        </Paragraph>
      </YStack>
    </PageLayout>
  )
}
