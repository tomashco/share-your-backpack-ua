import {
  Button,
  H1,
  H3,
  Paragraph,
  Separator,
  XStack,
  YStack,
  Image,
  useTheme,
  isWeb,
} from '@my/ui'
import { Header } from 'app/components/header'
import { onAppStateChange, trpc } from '../../utils/trpc'
import { useUser } from '../../utils/clerk'
import React from 'react'
import { useRouter } from 'solito/router'
import { getBaseUrl } from 'app/utils/trpc'
import { PackForm, PageLayout } from '@my/ui/src'
import { Platform } from 'react-native'

export function HomeScreen() {
  const { data: packsByUser, isLoading, error } = trpc.packs.getAll.useQuery()
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
      {isEditable && (
        <YStack
          $gtSm={{
            width: '25rem',
          }}
          w="100%"
        >
          <PackForm />
        </YStack>
      )}
      <Separator />
      <H3 ta="center">List of packs</H3>
      <YStack w="100%" $gtSm={{ width: '35rem' }}>
        {isLoading ? (
          <Paragraph>Loading...</Paragraph>
        ) : error ? (
          <Paragraph>{error.message}</Paragraph>
        ) : (
          <XStack flexWrap="wrap" jc="space-between">
            {packsByUser.map(({ author, authorInfo }) => (
              <XStack key={author.authorId}>
                {author.packs.map((pack) => (
                  <XStack p="$2" ai="center" key={pack.id}>
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
                        push(`/pack/${pack.id}`)
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
