import React, { useState } from 'react'
import { PageLayout, Paragraph, Spinner, Stack, Text, XStack, YStack } from '@my/ui'
import { trpc } from '../../utils/trpc'
import { useUser } from '../../utils/clerk'
import { Edit3, X } from '@tamagui/lucide-icons'
import { useRouter } from 'solito/router'
import { ItemForm } from '@my/ui/src'

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

  return (
    <PageLayout scrollViewProps={{}}>
      <ItemForm action={() => setSelectedItem('')} />

      {isLoading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text>{JSON.stringify(error)}</Text>
      ) : (
        userItems?.map((item) => {
          return selectedItem === item.itemId ? (
            <XStack key={item.itemId} w="100%">
              <Stack
                onPress={() => setSelectedItem('')}
                position="absolute"
                right={0}
                zi={1}
                cursor="pointer"
              >
                <X color={'$color10'} />
              </Stack>
              <ItemForm
                itemId={item.itemId}
                itemName={item.name}
                action={() => setSelectedItem('')}
              />
            </XStack>
          ) : (
            <XStack key={item.itemId} w="100%" jc={'space-between'}>
              <Text>{item.name}</Text>
              <Stack
                onPress={() => {
                  setSelectedItem(item.itemId)
                }}
                cursor="pointer"
              >
                <Edit3 color={'$color10'} />
              </Stack>
            </XStack>
          )
        })
      )}
    </PageLayout>
  )
}
