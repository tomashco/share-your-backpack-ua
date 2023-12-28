import { Pack, PackItem } from '@my/db/index'
import { Button, H1, H3, Paragraph, ScrollView, ToggleGroup, YStack, XStack } from '@my/ui'
import { PageLayout } from '@my/ui/src'
import { CreatePackForm } from '@my/ui/src/packForm'
import { ChevronLeft } from '@tamagui/lucide-icons'
import { Header } from 'app/components/header'
import { onAppStateChange, trpc } from 'app/utils/trpc'
import React, { useState } from 'react'
import { createParam } from 'solito'
import { useLink } from 'solito/link'

const { useParam } = createParam<{ id: string }>()

enum sortCriteria {
  category = 'category',
  location = 'location',
}

export function EditPackScreen() {
  const [id] = useParam('id')
  const { data, isLoading, error } = trpc.packs.getById.useQuery({ id: id || '' })

  // const ItemData = ({ item }: { item: PackItem }) => (
  //   <XStack>
  //     <Paragraph className="flex ">{item.name}</Paragraph>
  //   </XStack>
  // )

  // const itemsByView = (selSort: sortCriteria) => (
  //   <YStack space="$3">
  //     {allSorts[selSort]?.map((sortName) => (
  //       <YStack key={sortName}>
  //         <H3 className="drop-shadow-l text-xl font-extrabold text-primary">
  //           {sortName ? sortName : 'TBD'}
  //         </H3>
  //         {data?.packItems
  //           .filter((el) => el[selSort] === sortName)
  //           .map((item) => (
  //             <ItemData key={item.id} item={item} />
  //           ))}
  //       </YStack>
  //     ))}
  //   </YStack>
  // )

  // const link = useLink({
  //   href: '/',
  // })

  // const PackDetails = () => (
  //   <YStack>
  //     <H1 ta="center">{data?.name}</H1>
  //     <XStack paddingTop="$4">
  //       <Paragraph>{data?.description}</Paragraph>
  //     </XStack>
  //     <XStack justifyContent="flex-end" paddingVertical="$4">
  //       {data?.packItems && data.packItems.length > 0 && (
  //         <ToggleGroup
  //           type="single"
  //           size={'$0.5'}
  //           onValueChange={(value: sortCriteria) => setSelectedSort(value)}
  //           value={selectedSort}
  //         >
  //           <ToggleGroup.Item value={sortCriteria.category}>
  //             <Paragraph paddingHorizontal="$4">Category</Paragraph>
  //           </ToggleGroup.Item>
  //           <ToggleGroup.Item value={sortCriteria.location}>
  //             <Paragraph paddingHorizontal="$4">Position</Paragraph>
  //           </ToggleGroup.Item>
  //         </ToggleGroup>
  //       )}
  //     </XStack>
  //     {itemsByView(selectedSort)}
  //   </YStack>
  // )

  return (
    <ScrollView
      onScrollBeginDrag={() => onAppStateChange('active')}
      onScrollEndDrag={() => onAppStateChange('inactive')}
    >
      <PageLayout>
        <Header />
        <YStack w="100%" $gtSm={{ width: '35rem' }}>
          {isLoading ? (
            <Paragraph>Loading...</Paragraph>
          ) : error ? (
            <Paragraph>{error.message}</Paragraph>
          ) : (
            <YStack
              $gtSm={{
                width: '25rem',
              }}
              w="100%"
            >
              {/* <CreatePackForm /> */}
            </YStack>
            // <Paragraph ta="center" fow="700">{`pack name: ${data.name}`}</Paragraph>
          )}
        </YStack>
      </PageLayout>
    </ScrollView>
  )
}
