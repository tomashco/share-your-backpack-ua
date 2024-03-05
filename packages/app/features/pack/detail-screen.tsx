import {
  Button,
  H1,
  H3,
  Paragraph,
  YStack,
  XStack,
  Popover,
  Anchor,
  Image,
  GenericTable,
  isWeb,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemTitle,
} from '@my/ui'
import { ChangeWeightUnit, PageLayout, RadioGroupItemWithLabel } from '@my/ui/src'
import { useUser } from '../../utils/clerk'
import { onAppStateChange, trpc } from 'app/utils/trpc'
import React, { useRef, useState } from 'react'
import { createParam } from 'solito'
import { useRouter } from 'solito/router'
import { Plus } from '@tamagui/lucide-icons'
import { convertWeight } from 'app/utils/utils'

const { useParam } = createParam<{ id: string }>()

enum sortCriteria {
  category = 'category',
  location = 'location',
}

export function UserDetailScreen() {
  const [id] = useParam('id')
  const { push } = useRouter()
  const [selectedSort, setSelectedSort] = useState(sortCriteria.category)
  const { data, isLoading, error } = trpc.packs.getPackById.useQuery({ id: id || '' })
  const categories = Array.from(new Set(data?.packItems.map((item) => item.category)))
  // const locations = Array.from(new Set(data?.packItems.map((item) => item.location)))
  const allSorts = {
    category: categories,
    // location: locations,
  }
  const user = useUser()
  const isEditable = data?.author.find((author) => author.authorId === user?.user?.id)
  const authorData = data?.author[0]
  const [localUnit, setLocalUnit] = useState(authorData?.unit || 'g')
  const { mutate: DeletePack } = trpc.packs.deletePack.useMutation({
    onSuccess: () => {
      push('/')
    },
    onError: (e) => console.log('ERROR: ', e),
  })

  const tableHeaders = [
    { key: 'name', label: 'Name' },
    { key: 'model', label: 'Model' },
    { key: 'brand', label: 'Brand' },
    { key: 'weight', label: `Weight (${localUnit})`, width: 100, textAlign: 'center' },
    { key: 'quantity', label: 'Quantity' },
  ]

  const ExpandedItemView = ({ item, quantity, onLayout }) => {
    return (
      <YStack
        // onLayout={onLayout}
        py={'$3'}
        key={item.itemId}
        ai={'flex-start'}
        gap={'$3'}
        width={'100%'}
      >
        <XStack>
          {item.imageUrl && (
            <Image
              source={{
                uri: item.imageUrl,
                width: 100,
                height: 100,
              }}
              style={{ borderRadius: 10, margin: 10 }}
            />
          )}
          <YStack>
            <Paragraph flexGrow={1}>
              {item.itemUrl ? (
                <Anchor href={item.itemUrl} target="_blank">
                  {item.name}
                </Anchor>
              ) : (
                item.name
              )}
            </Paragraph>
            {item.model && <Paragraph>{item.model}</Paragraph>}
            {item.brand && <Paragraph>{item.brand}</Paragraph>}
            {item.weight > 0 && (
              <Paragraph>
                {convertWeight(item.weight, localUnit)} {localUnit}
              </Paragraph>
            )}
            {quantity && <Paragraph>Quantity: {quantity}</Paragraph>}
          </YStack>
        </XStack>
      </YStack>
    )
  }

  const DetailScreenMenu = () =>
    isWeb ? (
      <Popover size="$5" allowFlip placement="bottom-end">
        <Popover.Trigger asChild>
          <Button accessibilityRole="link" theme={'active'}>
            ...
          </Button>
        </Popover.Trigger>

        <Popover.Content
          borderWidth={1}
          borderColor="$borderColor"
          enterStyle={{ y: -10, opacity: 0 }}
          exitStyle={{ y: -10, opacity: 0 }}
          elevate
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
        >
          <Popover.Arrow borderWidth={1} borderColor="$borderColor" />
          <YStack space="$3">
            <Button
              accessibilityRole="link"
              theme={'active'}
              onPress={() => {
                push(`/pack/${id}/edit-pack-info`)
              }}
            >
              Edit Title and Description
            </Button>
            <Button
              accessibilityRole="link"
              theme={'active'}
              onPress={() => {
                push(`/pack/${id}/edit`)
              }}
            >
              Edit Pack Items
            </Button>
            <Button
              direction="rtl"
              theme={'active'}
              onPress={() => DeletePack({ packId: id || '' })}
              accessibilityRole="link"
              w="100%"
              $gtSm={{
                width: '15rem',
              }}
            >
              Delete Pack
            </Button>
          </YStack>
        </Popover.Content>
      </Popover>
    ) : (
      <DropdownMenuRoot>
        <DropdownMenuTrigger>
          <Button theme={'active'}>...</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            key="edit-pack-info"
            onSelect={() => {
              push(`/pack/${id}/edit-pack-info`)
            }}
          >
            <DropdownMenuItemTitle>Edit Title and Description</DropdownMenuItemTitle>
          </DropdownMenuItem>
          <DropdownMenuItem
            key="edit"
            onSelect={() => {
              push(`/pack/${id}/edit`)
            }}
          >
            <DropdownMenuItemTitle>Edit Pack Items</DropdownMenuItemTitle>
          </DropdownMenuItem>
          <DropdownMenuItem key="delete" onSelect={() => DeletePack({ packId: id || '' })}>
            <DropdownMenuItemTitle>Delete pack</DropdownMenuItemTitle>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuRoot>
    )

  const itemsByView = (selSort: sortCriteria) => {
    return (
      <YStack space="$3">
        {allSorts[selSort]?.map((sortName) => {
          const categoryItems = data?.packItems.filter((el) => el[selSort] === sortName)
          return (
            <YStack key={sortName}>
              <H3>{sortName ? sortName : 'Unsorted'}</H3>
              <GenericTable
                headers={tableHeaders}
                ExpandIcon={Plus}
                data={categoryItems?.map((packItem) => {
                  return {
                    ...packItem.item,
                    id: packItem.packItemId,
                    weight: convertWeight(packItem.item.weight, localUnit),
                    quantity: packItem.quantity,
                    detailedView: (props) => (
                      <ExpandedItemView
                        onLayout={props.onLayout}
                        key={packItem.packItemId}
                        item={packItem.item}
                        quantity={packItem.quantity}
                      />
                    ),
                  }
                })}
              />
              <Paragraph ta={'right'} mr={'$8'} my="$3">
                {sortName} weight:{' '}
                {convertWeight(
                  categoryItems?.reduce(
                    (acc, item) => acc + (item.item.weight || 0) * item.quantity,
                    0
                  ),
                  localUnit
                )}{' '}
                {localUnit}
              </Paragraph>
            </YStack>
          )
        })}
      </YStack>
    )
  }

  const PackDetails = () => (
    <YStack>
      <XStack paddingTop="$4">
        <Paragraph>{data?.description}</Paragraph>
      </XStack>
      <XStack flexGrow={1} justifyContent="flex-end" paddingVertical="$4">
        <ChangeWeightUnit onValueChange={setLocalUnit} localUnit={localUnit} />
      </XStack>
      {itemsByView(selectedSort)}
      <Paragraph textAlign="right" mr={'$8'}>
        Total Weight:{' '}
        {convertWeight(
          data?.packItems.reduce((acc, item) => acc + (item.item.weight || 0), 0) || 0,
          localUnit
        )}{' '}
        {localUnit}
      </Paragraph>
    </YStack>
  )

  return (
    <PageLayout
      scrollViewProps={{
        onScrollBeginDrag: () => onAppStateChange('active'),
        onScrollEndDrag: () => onAppStateChange('inactive'),
      }}
    >
      <XStack w="100%" ai={'center'}>
        <H1 flexGrow={1} ta="center">
          {data?.name}
        </H1>
        {isEditable && (
          <XStack>
            <DetailScreenMenu />
          </XStack>
        )}
      </XStack>
      <YStack
        w="100%"
        // $gtSm={{ width: '35rem' }}
      >
        {isLoading ? (
          <Paragraph>Loading...</Paragraph>
        ) : error ? (
          <Paragraph>{error.message}</Paragraph>
        ) : data.packItems.length > 0 ? (
          <PackDetails />
        ) : (
          <YStack>
            <Paragraph>{data?.description}</Paragraph>
            <Paragraph py={'$4'}>No items in this pack</Paragraph>
          </YStack>
        )}
      </YStack>
    </PageLayout>
  )
}
