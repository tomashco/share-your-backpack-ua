import { Paragraph, ScrollView, YStack, Spinner, Button, useToastController, Sheet } from '@my/ui'
import { PageLayout, Table } from '@my/ui/src'
import { PackForm, PackItemForm } from '@my/ui/src'
import { Header } from 'app/components/header'
import { useUser } from '../../utils/clerk'
import { onAppStateChange, trpc } from 'app/utils/trpc'
import React, { useState } from 'react'
import { createParam } from 'solito'
import { useRouter } from 'solito/router'
import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons'

const { useParam } = createParam<{ id: string }>()

export function EditPackScreen() {
  const [id] = useParam('id')
  const { data, isLoading, error } = trpc.packs.getById.useQuery({ id: id || '' })
  const { isLoaded: userIsLoaded, user } = useUser()
  const { push } = useRouter()
  const isEditable = user?.id === data?.authorId

  if (isLoading || !userIsLoaded || error)
    return (
      <YStack padding="$3" space="$4" fullscreen alignItems="center" justifyContent="center">
        {isLoading || !userIsLoaded ? (
          <Spinner size="large" color="$gray10" />
        ) : (
          <Paragraph>{error?.message}</Paragraph>
        )}
      </YStack>
    )

  if (!isEditable) return push('/')

  return (
    <ScrollView
      onScrollBeginDrag={() => onAppStateChange('active')}
      onScrollEndDrag={() => onAppStateChange('inactive')}
    >
      <PageLayout>
        <Header />
        <YStack w="100%" $gtSm={{ width: '35rem' }}>
          <PackForm
            packId={data.id}
            packName={data.name ?? ''}
            packDescription={data.description ?? ''}
          />
        </YStack>
        <Table data={data} />
        <Modal packId={data.id} />
      </PageLayout>
    </ScrollView>
  )
}

function Modal({ packId }) {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState(0)
  const toast = useToastController()

  return (
    <>
      <Button
        direction="rtl"
        icon={open ? ChevronDown : ChevronUp}
        onPress={() => setOpen((x) => !x)}
      >
        Add a new item
      </Button>
      <Sheet
        modal
        animation="medium"
        open={open}
        onOpenChange={setOpen}
        snapPoints={[80]}
        position={position}
        onPositionChange={setPosition}
        dismissOnSnapToBottom
      >
        <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
        <Sheet.Frame alignSelf="center" ai="center" jc="flex-start" p="$4">
          <YStack
            $gtSm={{
              width: '25rem',
            }}
            w="100%"
            ai="center"
          >
            <Button
              size="$6"
              circular
              icon={ChevronDown}
              onPress={() => setOpen(false)}
              // toast.show('Sheet closed!', {
              //   message: 'Just showing how toast works...',
              // })
            />
            <PackItemForm packId={packId} action={() => setOpen(false)} />
          </YStack>
          <Sheet.Handle />
        </Sheet.Frame>
      </Sheet>
    </>
  )
}
