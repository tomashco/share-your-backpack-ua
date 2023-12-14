import {
  Anchor,
  Button,
  H1,
  H3,
  Paragraph,
  Separator,
  XStack,
  YStack,
  Image,
  ScrollView,
} from '@my/ui'
import { Header } from 'app/components/header'
import { trpc } from '../../utils/trpc'
import { useUser } from '../../utils/clerk'
import React, { useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useLink } from 'solito/link'

export function HomeScreen() {
  const userLinkProps = useLink({
    href: '/user/nate',
  })
  // const { data: posts, isLoading, error } = trpc.posts.getAll.useQuery()
  const { data: packs, isLoading, error } = trpc.packs.getAll.useQuery()
  const user = useUser()
  const isEditable = !!user?.user?.id

  return (
    <ScrollView>
      <YStack f={1} jc="center" w={'100%'} ai="center" p="$4" space>
        <Header />
        <YStack space="$4" maw={600} px="$3">
          <XStack jc="center" ai="flex-end" fw="wrap" space="$2" mt="$-2">
            <Image
              source={{
                width: 50,
                height: 50,
                uri: 'https://raw.githubusercontent.com/chen-rn/CUA/main/apps/nextjs/public/favicon.ico',
              }}
              accessibilityLabel="create-universal-app logo"
              mt="$2"
            />
            <H1 ta="center" mt="$2">
              create-universal-app
            </H1>
          </XStack>
          <Paragraph ta="center">
            This is a demo for create-universal-app. To read more about the philosophy behind it,
            visit{' '}
            <Anchor color="$color12" href="#" target="_blank">
              Link-not-working
            </Anchor>{' '}
            (give it a ⭐️ if you like it!)
          </Paragraph>
          <Paragraph ta="center">
            This template uses Expo, Next, Solito, tRPC, Tamagui, Clerk, and Prisma. If you&aposre a
            beginner and is a little overwhelmed, I&aposve also made a{' '}
            <Anchor color="$color12" href="https://youtu.be/aTEv0-ZBbWk" target="_blank">
              video
            </Anchor>{' '}
            explanation on how this template works and how to get started!
          </Paragraph>
          <Separator />
        </YStack>

        <H3 ta="center">Some Demos</H3>
        <YStack p="$2">
          <Paragraph>tRPC Query Demo</Paragraph>
          {isLoading ? (
            <Paragraph>Loading...</Paragraph>
          ) : error ? (
            <Paragraph>{error.message}</Paragraph>
          ) : (
            packs?.map(({ pack, author }) => (
              <Paragraph opacity={0.5} key={pack.id}>
                {pack.name}
              </Paragraph>
            ))
          )}
        </YStack>

        <XStack space>
          <Button {...userLinkProps} theme={'red'}>
            User Page (Routing)
          </Button>
        </XStack>
      </YStack>
    </ScrollView>
  )
}
