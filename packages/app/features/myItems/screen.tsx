import React from 'react'
import { H1, PageLayout, Text } from '@my/ui'
import { trpc } from '../../utils/trpc'
import { PackItem } from '@my/db/index'

export function MyItemsScreen() {
  const { data: userItems, isLoading, error } = trpc.packs.getItems.useQuery()
  return (
    <PageLayout scrollViewProps={{}}>
      <H1>My Items</H1>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text>{JSON.stringify(error)}</Text>
      ) : (
        userItems?.map((item) => <Text key={item.id}>{item.name}</Text>)
      )}
    </PageLayout>
  )
}
