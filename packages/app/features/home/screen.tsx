import { Button, Paragraph, Separator, XStack, YStack, Image, isWeb, Text, H2 } from '@my/ui'
import { onAppStateChange, trpc } from '../../utils/trpc'
import { useUser } from '../../utils/clerk'
import React from 'react'
import { useRouter } from 'solito/router'
import { PackForm, PageLayout } from '@my/ui/src'

export function HomeScreen() {
  const { data: packsByUser, isLoading, error } = trpc.packs.getAll.useQuery()
  const {
    data: userItems,
    isLoading: itemsIsLoading,
    error: itemsError,
  } = trpc.packs.getItems.useQuery()
  const { push } = useRouter()
  const { user } = useUser()
  const isEditable = !!user?.id

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
      {isEditable && <PackForm />}

      <Separator />
      {isEditable && (
        <YStack>
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
            {packsByUser.map(({ author, authorInfo }) => (
              <XStack key={author.authorId}>
                {author.packs.map((pack) => (
                  <XStack p="$2" ai="center" key={pack.packId}>
                    <Image
                      source={{
                        uri: authorInfo?.profileImageUrl,
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
                ))}
              </XStack>
            ))}
          </XStack>
        )}
      </YStack>
    </PageLayout>
  )
}
