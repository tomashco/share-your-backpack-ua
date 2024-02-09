import { Button, Paragraph, Separator, XStack, YStack, Image, isWeb, Text, H2 } from '@my/ui'
import { onAppStateChange, trpc } from '../../utils/trpc'
import { useUser } from '../../utils/clerk'
import React, { useState } from 'react'
import { useRouter } from 'solito/router'
import { PackForm, PageLayout } from '@my/ui/src'
import { useLink } from 'solito/link'

export function HomeScreen() {
  const { data: latestPacks, isLoading, error } = trpc.packs.getLatestPacks.useQuery()
  const {
    data: userItems,
    isLoading: itemsIsLoading,
    error: itemsError,
  } = trpc.packs.getItems.useQuery()
  const { push } = useRouter()
  const { user } = useUser()
  const [newPackForm, toggleNewPack] = useState(false)
  const isEditable = !!user?.id
  const myItemsLinkProps = useLink({
    href: '/my-items',
  })

  return (
    <PageLayout
      scrollViewProps={{
        onScrollBeginDrag: () => onAppStateChange('active'),
        onScrollEndDrag: () => onAppStateChange('inactive'),
      }}
    >
      <XStack w="100%" justifyContent="flex-end">
        {isEditable && !isWeb && (
          <Image
            onPress={() => push('/profile')}
            source={{
              uri: user?.imageUrl,
              width: 40,
              height: 40,
            }}
            accessibilityLabel="create-universal-app logo"
            style={{ borderRadius: 40 }}
          />
        )}
      </XStack>
      {isEditable && (
        <XStack w="100%" jc={'space-between'}>
          <Button {...myItemsLinkProps} theme={'active'}>
            My Items
          </Button>
          <Button
            onPress={() => {
              push(`/my-packs/${user?.id}`)
            }}
            theme={'active'}
          >
            My Packs
          </Button>
          <Button onPress={() => toggleNewPack(!newPackForm)} theme={'active'}>
            {newPackForm ? 'Close Edit' : 'New Pack'}
          </Button>
        </XStack>
      )}
      {isEditable && newPackForm && <PackForm />}

      <Separator />
      {isEditable && (
        <YStack w="100%">
          <H2>My Items</H2>
          {itemsIsLoading ? (
            <Text>Loading...</Text>
          ) : itemsError ? (
            <Text>{JSON.stringify(error)}</Text>
          ) : (
            userItems?.map((item) => <Text key={item.itemId}>{item.name}</Text>)
          )}
        </YStack>
      )}
      <Separator />
      <H2>List of packs</H2>
      <YStack>
        {isLoading ? (
          <Paragraph>Loading...</Paragraph>
        ) : error ? (
          <Paragraph>{error.message}</Paragraph>
        ) : (
          <XStack flexWrap="wrap" jc="space-between">
            {latestPacks.map(({ author, ...pack }) => (
              <XStack key={author[0]?.authorId}>
                <XStack p="$2" ai="center" key={pack.packId}>
                  <Image
                    source={{
                      uri: author[0].profileImageUrl,
                      width: 30,
                      height: 30,
                    }}
                    style={{ borderRadius: 40 }}
                  />
                  <Button
                    theme="active"
                    accessibilityRole="link"
                    onPress={() => {
                      push(`/pack/${pack.packId}`)
                    }}
                  >
                    {pack.name}
                  </Button>
                </XStack>
              </XStack>
            ))}
          </XStack>
        )}
      </YStack>
    </PageLayout>
  )
}
