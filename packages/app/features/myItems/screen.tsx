import React from 'react'
import { H1, PageLayout, Text } from '@my/ui'
import { trpc } from '../../utils/trpc'
import { PackItem } from '@my/db/index'

export function MyItemsScreen() {
  const { data: packItems, isLoading, error } = trpc.packs.getItems.useQuery()
  return (
    <PageLayout scrollViewProps={{}}>
      <H1>My Items</H1>
      {packItems?.map((item: PackItem) => (
        <Text key={item.id}>{item}</Text>
      ))}
    </PageLayout>
  )
}
