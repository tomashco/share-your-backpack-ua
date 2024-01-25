import { Paragraph, YStack, Spinner, Button, useToastController, Sheet } from '@my/ui'
import { PageLayout, Table } from '@my/ui/src'
import { PackForm, PackItemForm } from '@my/ui/src'
import { useUser } from '../../utils/clerk'
import { onAppStateChange, trpc } from 'app/utils/trpc'
import React, { useState } from 'react'
import { createParam } from 'solito'
import { useRouter } from 'solito/router'
import { ChevronDown, ChevronUp, X } from '@tamagui/lucide-icons'
import { TRPCProvider } from 'app/provider/trpc'
import { getSelectItems } from 'app/utils/utils'

const { useParam } = createParam<{ id: string }>()

export function EditPackScreen() {
  const [id] = useParam('id')
  const { data, isLoading, error } = trpc.packs.getById.useQuery({ id: id || '' })
  const { isLoaded: userIsLoaded, user } = useUser()
  const { push } = useRouter()
  const ctx = trpc.useUtils()
  const isEditable = data?.author.find((el) => el.authorId === user?.id)

  const { data: _deletePackResponse, mutate: DeletePack } = trpc.packs.deletePack.useMutation({
    onSuccess: () => {
      void ctx.packs.getAll.invalidate()
      push('/')
    },
    onError: (e) => console.log('ERROR: ', e),
  })

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

  if (!isEditable) {
    push('/')
    return <></>
  }

  return (
    <PageLayout
      scrollViewProps={{
        onScrollBeginDrag: () => onAppStateChange('active'),
        onScrollEndDrag: () => onAppStateChange('inactive'),
      }}
    >
      <YStack w="100%" $gtSm={{ width: '35rem' }}>
        <PackForm
          packId={data.id}
          packName={data.name ?? ''}
          packDescription={data.description ?? ''}
        />
      </YStack>
      <PackItemForm
        categoryItems={getSelectItems(data.packItems, 'category')}
        locationItems={getSelectItems(data.packItems, 'location')}
        packId={data.id}
        // action={() => setOpen(false)}
      />
      {/* <Modal data={data} /> */}
      <Table
        data={data}
        categoryItems={getSelectItems(data.packItems, 'category')}
        locationItems={getSelectItems(data.packItems, 'location')}
      />
      <Button
        icon={X}
        direction="rtl"
        theme={'active'}
        onPress={() => DeletePack({ id: data.id })}
        accessibilityRole="link"
        w="100%"
        $gtSm={{
          width: '15rem',
        }}
      >
        Delete Pack
      </Button>
    </PageLayout>
  )
}

function Modal({ data }) {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState(0)
  const toast = useToastController()
  const categoryItems = getSelectItems(data.packItems, 'category')
  const locationItems = getSelectItems(data.packItems, 'location')

  return (
    <>
      <Button
        direction="rtl"
        icon={open ? ChevronDown : ChevronUp}
        onPress={() => setOpen((x) => !x)}
        w="100%"
        $gtSm={{
          width: '15rem',
        }}
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
        <Sheet.Frame alignSelf="center" ai="center" jc="flex-start" w={'100%'} p="$4">
          <Sheet.Handle />
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
            <TRPCProvider>
              {/* if modal is defined, set TRPCProvider, otherwise will crash on Android */}
              <PackItemForm
                categoryItems={categoryItems}
                locationItems={locationItems}
                packId={data.id}
                action={() => setOpen(false)}
              />
            </TRPCProvider>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </>
  )
}
