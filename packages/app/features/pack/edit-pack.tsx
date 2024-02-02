import { Paragraph, YStack, Spinner, Button, XStack } from '@my/ui'
import { GenericTable, PageLayout } from '@my/ui/src'
import { PackForm, PackItemForm } from '@my/ui/src'
import { useUser } from '../../utils/clerk'
import { onAppStateChange, trpc } from 'app/utils/trpc'
import React, { useState } from 'react'
import { createParam } from 'solito'
import { useRouter } from 'solito/router'
import { X } from '@tamagui/lucide-icons'
import { getSelectItems } from 'app/utils/utils'

const { useParam } = createParam<{ id: string }>()

export function EditPackScreen() {
  const [id] = useParam('id')
  const { data, isLoading, error } = trpc.packs.getById.useQuery({ id: id || '' })
  const [newItemForm, toggleNewItemForm] = useState(false)
  const { data: userItems } = trpc.packs.getItems.useQuery()
  const { isLoaded: userIsLoaded, user } = useUser()
  const { push } = useRouter()
  const ctx = trpc.useUtils()
  const isEditable = data?.author.find((el) => el.authorId === user?.id)

  const { data: _deletePackResponse, mutate: DeletePack } = trpc.packs.deletePack.useMutation({
    onSuccess: () => {
      void ctx.packs.getAll.invalidate()
      push('/')
    },
    onError: (e) => console.log('ERROR: ', e),
  })

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

  if (!isEditable) {
    push('/')
    return <></>
  }

  const tableHeaders = [
    { key: 'name', label: 'Name' },
    { key: 'category', label: 'Category' },
    { key: 'location', label: 'Location' },
    { key: 'quantity', label: 'Quantity', width: 80, textAlign: 'center' },
  ]

  const tableData = data.packItems.map((packItem) => {
    const { item } = packItem

    return {
      id: packItem.packItemId,
      ...packItem,
      ...item,
      detailedView: (props) => (
        <PackItemForm
          userItems={userItems}
          categoryItems={getSelectItems(data.packItems, 'category')}
          locationItems={getSelectItems(data.packItems, 'location')}
          packId={packItem.packItemPackId}
          packItemId={packItem.packItemId}
          quantity={packItem.quantity}
          itemName={item.name}
          itemId={item.itemId}
          itemLocation={packItem.location || undefined}
          itemCategory={packItem.category || undefined}
          {...props}
        />
      ),
    }
  })

  return (
    <PageLayout
      scrollViewProps={{
        onScrollBeginDrag: () => onAppStateChange('active'),
        onScrollEndDrag: () => onAppStateChange('inactive'),
      }}
    >
      <XStack w="100%" jc={'flex-end'}>
        <Button onPress={() => toggleNewItemForm(!newItemForm)} theme={'active'}>
          {newItemForm ? 'Close Edit' : 'New Item'}
        </Button>
      </XStack>
      {newItemForm && (
        <PackItemForm
          userItems={userItems}
          categoryItems={getSelectItems(data.packItems, 'category')}
          locationItems={getSelectItems(data.packItems, 'location')}
          packId={data.packId}
        />
      )}

      <GenericTable headers={tableHeaders} data={tableData} />
    </PageLayout>
  )
}
