import { Button, Paragraph, YStack } from '@my/ui'
import { ChevronLeft } from '@tamagui/lucide-icons'
import { trpc } from 'app/utils/trpc'
import React from 'react'
import { createParam } from 'solito'
import { useLink } from 'solito/link'

const { useParam } = createParam<{ id: string }>()

export function UserDetailScreen() {
  const [id] = useParam('id')
  const { data, isLoading, error } = trpc.packs.getById.useQuery({ id: id || '' })
  const link = useLink({
    href: '/',
  })

  return (
    <YStack f={1} jc="center" ai="center" space>
      {isLoading ? (
        <Paragraph>Loading...</Paragraph>
      ) : error ? (
        <Paragraph>{error.message}</Paragraph>
      ) : (
        <Paragraph ta="center" fow="700">{`pack name: ${data.name}`}</Paragraph>
      )}
      <Button {...link} icon={ChevronLeft}>
        Go Home
      </Button>
    </YStack>
  )
}
