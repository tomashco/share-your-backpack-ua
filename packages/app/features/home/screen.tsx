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
import React from 'react'
import { Platform } from 'react-native'
import { useLink } from 'solito/link'
import { SignedIn, SignedOut, useAuth } from '../../utils/clerk'

export function HomeScreen() {
  const { signOut, userId } = useAuth()
  const userLinkProps = useLink({
    href: '/user/nate',
  })
  const signInOAuthLinkProps = useLink({
    href: '/signin',
  })
  const signUpLinkProps = useLink({
    href: '/signup',
  })

  // const { data, isLoading, error } = trpc.entry.all.useQuery()

  // useEffect(() => {
  //   console.log(data)
  // }, [isLoading])
  /* 
  if (isLoading) {
    return <Paragraph>Loading...</Paragraph>
  } */

  // if (error) {
  //   return <Paragraph>{error.message}</Paragraph>
  // }

  return (
    <ScrollView>
      <YStack f={1} jc="center" ai="center" p="$4" space>
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
          {/* {data?.map((entry) => (
          <Paragraph opacity={0.5} key={entry.id}>
            {entry.id}
          </Paragraph>
        ))} */}
        </YStack>

        <XStack space>
          <Button {...userLinkProps} theme={'red'}>
            User Page (Routing)
          </Button>
        </XStack>

        <SignedOut>
          <XStack space ai="center">
            <Button {...signInOAuthLinkProps} theme={'red'}>
              Sign In
            </Button>
            {Platform.OS === 'web' && (
              <Button {...signUpLinkProps} theme={'red'}>
                Sign Up
              </Button>
            )}
          </XStack>
        </SignedOut>

        <SignedIn>
          <Paragraph mb="$4">{userId}</Paragraph>
          <Button
            onPress={() => {
              signOut()
            }}
            theme={'red'}
          >
            Sign Out
          </Button>
        </SignedIn>
      </YStack>
    </ScrollView>
  )
}
