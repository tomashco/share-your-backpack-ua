import { Button, H1, H3, Paragraph, Separator, XStack, YStack, Image, ScrollView } from '@my/ui'
import { Header } from 'app/components/header'
import { onAppStateChange, trpc } from '../../utils/trpc'
import { useUser } from '../../utils/clerk'
import React, { useState } from 'react'
import { useRouter } from 'solito/router'
import { getBaseUrl } from 'app/utils/trpc'
import { FilterInputAccordionItem, PackForm, PageLayout } from '@my/ui/src'

export function HomeScreen() {
  const { data: packs, isLoading, error } = trpc.packs.getAll.useQuery()

  const { push } = useRouter()
  const user = useUser()
  const isEditable = !!user?.user?.id
  return (
    <ScrollView
      onScrollBeginDrag={() => onAppStateChange('active')}
      onScrollEndDrag={() => onAppStateChange('inactive')}
    >
      <PageLayout>
        <Header />
        <YStack px="$3">
          <XStack jc="center" ai="flex-end" fw="wrap" space="$2" mt="$-2">
            <Image
              source={{
                uri: `${getBaseUrl()}/backpack.png`,
                width: 50,
                height: 50,
              }}
              accessibilityLabel="create-universal-app logo"
              mt="$2"
            />
            <H1 ta="center" mt="$2">
              SharePack
            </H1>
          </XStack>
          <Separator />
        </YStack>
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
              {packs?.map(({ pack, author }) => (
                <XStack p="$2" ai="center" key={pack.id}>
                  <Image
                    source={{
                      uri: author?.profileImageUrl,
                      width: 30,
                      height: 30,
                    }}
                    style={{ borderRadius: 40 }}
                  />
                  <Button
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
          )}
        </YStack>
      </PageLayout>
    </ScrollView>
  )
}
