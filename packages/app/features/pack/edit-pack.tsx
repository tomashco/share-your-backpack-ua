import { Paragraph, YStack, Spinner, Button, XStack, useToastController } from '@my/ui'
import { CheckboxWithLabel, GenericTable, PageLayout } from '@my/ui/src'
import { PackItemForm } from '@my/ui/src'
import { useUser } from '../../utils/clerk'
import { onAppStateChange, trpc } from 'app/utils/trpc'
import React, { useState } from 'react'
import { createParam } from 'solito'
import { useRouter } from 'solito/router'
import { getSelectItems } from 'app/utils/utils'
import { useDebounce } from '@uidotdev/usehooks'

const { useParam } = createParam<{ id: string }>()
const MY_ITEMS = ' (My Gear)'

export function EditPackScreen() {
  const [id] = useParam('id')
  const { data, isLoading, error } = trpc.packs.getPackById.useQuery({ id: id || '' })
  const [newItemForm, toggleNewItemForm] = useState(false)
  const { data: userItems } = trpc.packs.getItems.useQuery()
  const { isLoaded: userIsLoaded, user } = useUser()
  const [searchValue, setSearchValue] = useState('')
  const [isPublic, setIsPublic] = useState(data?.isPublic)
  const { push } = useRouter()
  const search = useDebounce(searchValue, 500)
  const toast = useToastController()
  const isEditable = data?.author.find((el) => el.authorId === user?.id)
  const { data: allItems } = trpc.packs.searchAllItems.useQuery(
    { value: search, page: 1, limit: 30 },
    {
      enabled: search.length > 2,
      staleTime: 1000 * 60,
    }
  )
  const { mutate: updatePack } = trpc.packs.updatePack.useMutation({
    onSuccess: (e) => {
      toast.show('Pack status updated')
    },
    onError: (e) => (e.data?.code ? toast.show(e.data?.code) : console.log('ERROR: ', e)),
  })
  const allItemsMapped = allItems?.map((item) =>
    item.itemAuthorId === user?.id ? { ...item, name: `${item.name}${MY_ITEMS}` } : item
  )

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
          setSearchValue={setSearchValue}
          myItemsConst={MY_ITEMS}
          allItems={allItemsMapped}
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
      <XStack w="100%" jc={'space-between'}>
        <Button onPress={() => push(`/pack/${id}`)} theme={'active'}>
          {'Close Edit'}
        </Button>
        <Button onPress={() => toggleNewItemForm(!newItemForm)} theme={'active'}>
          {newItemForm ? 'Close Edit' : 'New Item'}
        </Button>
      </XStack>
      <CheckboxWithLabel
        checked={isPublic}
        onCheckedChange={(val) => {
          console.log('🚀 ~ EditPackScreen ~ val:', val)
          setIsPublic(!!val)
          updatePack({
            packId: data.packId,
            isPublic: !!val,
          })
        }}
        label="Make the Pack public"
        size="$4"
      />
      {newItemForm && (
        <PackItemForm
          // userItems={userItems}
          categoryItems={getSelectItems(data.packItems, 'category')}
          locationItems={getSelectItems(data.packItems, 'location')}
          setSearchValue={setSearchValue}
          myItemsConst={MY_ITEMS}
          allItems={allItemsMapped}
          packId={data.packId}
        />
      )}

      <GenericTable headers={tableHeaders} data={tableData} />
    </PageLayout>
  )
}
