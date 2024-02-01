import React, { useState } from 'react'
import { PageLayout, Paragraph, Spinner, Stack, Table, Text, XStack, YStack } from '@my/ui'
import { trpc } from '../../utils/trpc'
import { useUser } from '../../utils/clerk'
import { Edit3, X } from '@tamagui/lucide-icons'
import { useRouter } from 'solito/router'
import { GenericTable, ItemForm } from '@my/ui/src'

export function MyItemsScreen() {
  const { data: userItems, isLoading, error } = trpc.packs.getItems.useQuery()
  const { isLoaded: userIsLoaded, isSignedIn } = useUser()
  const { push } = useRouter()
  const [selectedItem, setSelectedItem] = useState('')

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
    { key: 'brand', label: 'Brand' },
    { key: 'weight', label: 'Weight' },
    { key: 'isBag', label: 'Bag', width: 60, textAlign: 'center' },
    { key: 'isMeal', label: 'Meal', width: 60, textAlign: 'center' },
  ]

  const data = userItems.map((item) => {
    return {
      id: item.itemId,
      ...item,
      isMeal: item.isMeal ? 'yes' : 'no',
      isBag: item.isBag ? 'yes' : 'no',
      detailedView: (props) => <ItemForm itemId={item.itemId} itemName={item.name} {...props} />,
    }
  })

  return (
    <PageLayout scrollViewProps={{}}>
      <ItemForm action={() => setSelectedItem('')} />

      {isLoading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text>{JSON.stringify(error)}</Text>
      ) : (
        <>
          <GenericTable headers={tableHeaders} data={data} />
        </>
      )}
    </PageLayout>
  )
}
