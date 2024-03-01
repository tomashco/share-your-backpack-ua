import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { trpc } from 'app/utils/trpc'
import { z } from 'zod'
import { useState } from 'react'
import { Button, Form, H2, Label, Text, YStack } from 'tamagui'
import FormTextInput from './form/formTextInput'
import { Author } from '@my/db'
import { useToastController } from '@tamagui/toast'

const itemSchema = z.object({
  name: z.string().min(2, {
    message: 'Item name must be at least 2 characters.',
  }),
  model: z.string().optional(),
  brand: z.string().optional(),
  itemUrl: z.string().optional(),
  imageUrl: z.string().optional(),
  weight: z.coerce
    .number({
      invalid_type_error: 'Weight must be a number',
    })
    .optional(),
})

type PackItemFormProps = {
  itemId?: string
  itemName?: string
  itemModel?: string
  itemBrand?: string
  itemUrl?: string
  imageUrl?: string
  itemWeight?: number
  authorInfo?: Author
  // userItems?: Item[]
  tableContainerWidth?: number
  onLayout?: (event: any) => void
  action?: () => void
}

const ItemForm = ({
  itemId = '',
  itemName = '',
  itemModel = '',
  itemBrand = '',
  itemUrl = '',
  imageUrl = '',
  itemWeight = 0,
  authorInfo,
  // userItems,
  tableContainerWidth,
  onLayout = () => {},
  action,
}: PackItemFormProps) => {
  const ctx = trpc.useUtils()
  const [accordionOpen, setAccordionOpen] = useState<string[]>([])
  const toast = useToastController()
  const { mutate: addItem } = trpc.packs.addItem.useMutation({
    onSuccess: () => {
      void ctx.packs.getItems.invalidate()
      if (action) action()
      form.reset()
    },
    onError: (e) => console.log('ERROR: ', e),
  })

  const { mutate: editItem } = trpc.packs.editItem.useMutation({
    // onMutate: async (editedPackItem) => {
    //   // optimistic update
    //   await ctx.packs.getById.cancel()
    //   const previousPack = ctx.packs.getById.getData({ id: packId })
    //   if (!previousPack) return
    //   ctx.packs.getById.setData({ id: packId }, (oldPack) => {
    //     if (oldPack) {
    //       const newPackItems = oldPack.packItems.map((packItem) =>
    //         packItem.id === itemId
    //           ? {
    //               id: editedPackItem.id,
    //               name: editedPackItem.name,
    //               category: editedPackItem.category || '',
    //               location: editedPackItem.location || '',
    //             }
    //           : packItem
    //       )
    //       const newPack = { ...oldPack, packItems: newPackItems }
    //       return newPack
    //     }
    //   })
    // },
    onSuccess: () => {
      void ctx.packs.getItems.invalidate()
      if (action) action()
    },
    onError: (e) => toast.show(`❌ Error: ${e.message}`),
  })

  const { mutate: DeleteItem } = trpc.packs.deleteItem.useMutation({
    onSuccess: () => {
      void ctx.packs.getItems.invalidate()
    },
    onError: (e) => {
      console.log('error delete: ', e)

      toast.show('❌ Gear cannot be deleted because is in use in a pack')
    },
  })

  const form = useForm<z.infer<typeof itemSchema>>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: itemName,
      model: itemModel,
      brand: itemBrand,
      weight: itemWeight,
      itemUrl: itemUrl,
      imageUrl: imageUrl,
    },
    mode: 'onChange',
  })

  function onSubmit(values: z.infer<typeof itemSchema>) {
    console.log('🚀 ~ onSubmit ~ values:', values)
    // const findItemId = itemId || userItems.find((el) => el.name === values.name)?.itemId || ''
    if (itemId) {
      editItem({ itemId, ...values }) //itemId
    } else {
      addItem({ ...values })
    }
    setAccordionOpen([])
    form.reset()
  }

  return (
    <YStack w={tableContainerWidth ? tableContainerWidth : '100%'} onLayout={onLayout}>
      <Form onSubmit={form.handleSubmit(onSubmit)} {...form}>
        {!itemId && (
          <YStack marginBottom="$3" alignItems="center">
            <H2>{'Add a new item'}</H2>
          </YStack>
        )}
        <YStack space="$3" marginBottom="$3">
          <FormTextInput
            name={'name'}
            control={form.control}
            label="Name"
            placeholder="Item name"
          />
          {form.formState.errors.name?.message != null && (
            <Text fontSize={'$2'}>{form.formState.errors.name?.message}</Text>
          )}
          <FormTextInput
            name={'model'}
            control={form.control}
            label="Model"
            placeholder="Item model"
          />
          {form.formState.errors.model?.message != null && (
            <Text fontSize={'$2'}>{form.formState.errors.model?.message}</Text>
          )}
          <FormTextInput
            name={'brand'}
            control={form.control}
            label="Brand"
            placeholder="Item brand"
          />
          {form.formState.errors.brand?.message != null && (
            <Text fontSize={'$2'}>{form.formState.errors.brand?.message}</Text>
          )}
          <FormTextInput
            name={'itemUrl'}
            control={form.control}
            label="Item URL"
            placeholder="Item url"
          />
          {form.formState.errors.itemUrl?.message != null && (
            <Text fontSize={'$2'}>{form.formState.errors.itemUrl?.message}</Text>
          )}
          <FormTextInput
            name={'imageUrl'}
            control={form.control}
            label="Image URL"
            placeholder="Image url"
          />
          {form.formState.errors.imageUrl?.message != null && (
            <Text fontSize={'$2'}>{form.formState.errors.imageUrl?.message}</Text>
          )}
          <FormTextInput
            name={'weight'}
            control={form.control}
            label={`Weight (${authorInfo?.unit || ''})`}
            placeholder="Item weight"
            keyboardType="numeric"
            type="number"
          />
          {form.formState.errors.weight?.message != null && (
            <Text fontSize={'$2'}>{form.formState.errors.weight?.message}</Text>
          )}
          {/* <Accordion
            overflow="hidden"
            width="100%"
            type="multiple"
            value={accordionOpen}
            onValueChange={setAccordionOpen}
          >
            <FilterInputAccordionItem
              label={'Name'}
              accordionId={'nameAccordion'}
              headerPlaceholder="Select Item"
              inputPlaceholder="search or add new"
              items={userItems}
              setAccordionOpen={setAccordionOpen}
              name="name"
              control={form.control}
            />
          </Accordion> */}
          <Form.Trigger asChild>
            <Button theme={'active'} accessibilityRole="link">
              {itemId ? 'Edit' : 'Add'}
            </Button>
          </Form.Trigger>
          {itemId && (
            <Button onPress={() => DeleteItem({ itemId })} accessibilityRole="link">
              Delete Item
            </Button>
          )}
        </YStack>
      </Form>
    </YStack>
  )
}

export { ItemForm }
