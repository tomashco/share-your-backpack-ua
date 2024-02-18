import {
  Button,
  Paragraph,
  Separator,
  XStack,
  YStack,
  Image,
  isWeb,
  Text,
  H2,
  H5,
  Anchor,
} from '@my/ui'
import { onAppStateChange, trpc } from '../../utils/trpc'
import { useUser, SignedOut } from '../../utils/clerk'
import React, { useRef, useState } from 'react'
import { useRouter } from 'solito/router'
import { ChevronLeft, ChevronRight } from '@tamagui/lucide-icons'
import { PackForm, PageLayout } from '@my/ui/src'
import { useLink } from 'solito/link'
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel'
import { Pack } from '@my/db/index'
import { AuthorWithClerkInfo } from '@my/api/src/router/packs'

export function HomeScreen() {
  const { data: latestPacks, isLoading, error } = trpc.packs.getLatestPacks.useQuery()
  const carouselRef = useRef<ICarouselInstance | null>(null)
  const layout = useRef({ x: 0, y: 0, height: 0, width: 0 })
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
  const signInOAuthLinkProps = useLink({
    href: '/signin',
  })

  const baseOptions = {
    vertical: false,
    width: layout.current.width / (isWeb && layout.current.width > 400 ? 3 : 1) || 400,
    height: layout.current.width / 1.5 || 300,
    style: {
      width: layout.current.width || 200,
    },
    loop: true,
    autoPlay: true,
    scrollAnimationDuration: 1000,
    autoPlayInterval: 5000,
  }
  const carouselItem = ({ item }: { item: { pack: Pack; author: AuthorWithClerkInfo[] } }) => {
    const { author, pack } = item
    return (
      <YStack
        flex={1}
        backgroundColor={'$background'}
        borderRadius={'$5'}
        margin={'$3'}
        py={'$3'}
        alignItems={'center'}
        justifyContent={'space-between'}
        gap={'$3'}
      >
        <YStack gap={'$2'} alignItems={'center'}>
          <Image
            source={{
              uri: author[0]?.profileImageUrl,
              width: 30,
              height: 30,
            }}
            style={{ borderRadius: 40 }}
          />
          <H5 fontWeight={'600'}>{pack.name}</H5>
          <Paragraph textAlign="center">{pack.description}</Paragraph>
        </YStack>
        {/* <XStack p="$2" ai="center" key={pack?.packId}> */}
        {/* </XStack> */}
        <Button
          w={'$10'}
          theme="active"
          accessibilityRole="link"
          onPress={() => {
            push(`/pack/${pack?.packId}`)
          }}
        >
          View
        </Button>
      </YStack>
    )
  }

  return (
    <PageLayout
      scrollViewProps={{
        onScrollBeginDrag: () => onAppStateChange('active'),
        onScrollEndDrag: () => onAppStateChange('inactive'),
      }}
      layout={layout}
    >
      {!isWeb && (
        <SignedOut>
          <XStack w="100%" justifyContent="flex-end" gap="$3">
            <Button {...signInOAuthLinkProps} theme={'active'}>
              Sign In
            </Button>
          </XStack>
        </SignedOut>
      )}
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
            My Gear
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
          <H2>My Gear</H2>
          {itemsIsLoading ? (
            <Text>Loading...</Text>
          ) : itemsError ? (
            <Text>{JSON.stringify({ error })}</Text>
          ) : (
            userItems?.map((item) => (
              <YStack py={'$3'} key={item.itemId}>
                <XStack ai={'center'} gap={'$3'} width={'100%'}>
                  {item.imageUrl && (
                    <Image
                      source={{
                        uri: item.imageUrl,
                        width: 50,
                        height: 50,
                      }}
                      style={{ borderRadius: 10 }}
                    />
                  )}
                  <Paragraph flexGrow={1}>
                    {item.itemUrl ? (
                      <Anchor href={item.itemUrl} target="_blank">
                        {item.name}
                      </Anchor>
                    ) : (
                      item.name
                    )}
                  </Paragraph>
                  {item.brand && <Paragraph>{item.brand}</Paragraph>}
                </XStack>
              </YStack>
            ))
          )}
        </YStack>
      )}
      <Separator />
      <H2>Latest packs</H2>
      <YStack>
        {isLoading ? (
          <Paragraph>Loading...</Paragraph>
        ) : error ? (
          <Paragraph>{error.message}</Paragraph>
        ) : latestPacks?.length > 0 ? (
          <XStack flexWrap="wrap" jc="center" gap={'$3'}>
            <Carousel
              ref={carouselRef}
              {...baseOptions}
              data={latestPacks}
              renderItem={carouselItem}
            />
            {isWeb && layout.current.width > 400 && (
              <>
                <Button
                  onPress={() => carouselRef.current?.prev()}
                  theme={'active'}
                  icon={ChevronLeft}
                  circular
                />
                <Button
                  onPress={() => carouselRef.current?.next()}
                  theme={'active'}
                  icon={ChevronRight}
                  circular
                />
              </>
            )}
          </XStack>
        ) : (
          <Paragraph>No packs yet</Paragraph>
        )}
      </YStack>
    </PageLayout>
  )
}
