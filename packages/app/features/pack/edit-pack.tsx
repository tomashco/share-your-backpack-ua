import { Pack, PackItem } from '@my/db/index'
import { Button, H1, H3, Paragraph, ScrollView, ToggleGroup, YStack, XStack, View } from '@my/ui'
import { PageLayout, Table } from '@my/ui/src'
import { CreatePackForm } from '@my/ui/src/packForm'
import { ChevronLeft, View as ViewIcon } from '@tamagui/lucide-icons'
import { Header } from 'app/components/header'
import { onAppStateChange, trpc } from 'app/utils/trpc'
import React, { useEffect, useRef, useState } from 'react'
import { createParam } from 'solito'
import { useLink } from 'solito/link'

const { useParam } = createParam<{ id: string }>()

export function EditPackScreen() {
  const [id] = useParam('id')
  const { data, isLoading, error } = trpc.packs.getById.useQuery({ id: id || '' })

  if (isLoading || error)
    return (
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
        )}
      </YStack>
    )

  return (
    <ScrollView
      onScrollBeginDrag={() => onAppStateChange('active')}
      onScrollEndDrag={() => onAppStateChange('inactive')}
    >
      <PageLayout>
        <Header />
        <YStack w="100%" $gtSm={{ width: '35rem' }}>
          <YStack
            $gtSm={{
              width: '25rem',
            }}
            w="100%"
          >
            {/* <CreatePackForm /> */}
          </YStack>
        </YStack>
        <Table data={data} />
        {/* <Table /> */}
        {/* <TableNew /> */}
      </PageLayout>
    </ScrollView>
  )
}
