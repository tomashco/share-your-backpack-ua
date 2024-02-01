import { Paragraph, YStack, Spinner, Button } from '@my/ui'
import { GenericTable, PageLayout } from '@my/ui/src'
import { PackForm, PackItemForm } from '@my/ui/src'
import { useUser } from '../../utils/clerk'
import { onAppStateChange, trpc } from 'app/utils/trpc'
import React from 'react'
import { createParam } from 'solito'
import { useRouter } from 'solito/router'
import { X } from '@tamagui/lucide-icons'
import { getSelectItems } from 'app/utils/utils'

const { useParam } = createParam<{ id: string }>()

export function EditPackScreen() {
  const [id] = useParam('id')
  const { data, isLoading, error } = trpc.packs.getById.useQuery({ id: id || '' })
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
    { key: 'isBag', label: 'Bag', width: 60, textAlign: 'center' },
    { key: 'isMeal', label: 'Meal', width: 60, textAlign: 'center' },
  ]

  const tableData = data.packItems.map((packItem) => {
    const { item } = packItem

    return {
      id: packItem.packItemId,
      ...packItem,
      ...item,
      isMeal: item.isMeal ? 'yes' : 'no',
      isBag: item.isBag ? 'yes' : 'no',
      detailedView: (props) => (
        <PackItemForm
          userItems={userItems}
          categoryItems={getSelectItems(data.packItems, 'category')}
          locationItems={getSelectItems(data.packItems, 'location')}
          packId={packItem.packItemPackId}
          packItemId={packItem.packItemId}
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
      <PackForm
        packId={data.packId}
        packName={data.name ?? ''}
        packDescription={data.description ?? ''}
      />
      <PackItemForm
        userItems={userItems}
        categoryItems={getSelectItems(data.packItems, 'category')}
        locationItems={getSelectItems(data.packItems, 'location')}
        packId={data.packId}
      />
      <GenericTable headers={tableHeaders} data={tableData} />
      <Button
        icon={X}
        direction="rtl"
        theme={'active'}
        onPress={() => DeletePack({ packId: data.packId })}
        accessibilityRole="link"
        w="100%"
        $gtSm={{
          width: '15rem',
        }}
      >
        Delete Pack
      </Button>
    </PageLayout>
  )
}
