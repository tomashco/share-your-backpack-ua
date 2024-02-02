import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { trpc } from 'app/utils/trpc'
import { z } from 'zod'
import { useState } from 'react'
import { Button, Form, H2, Label, Text, YStack } from 'tamagui'
import FormTextInput from './form/formTextInput'
import { Author } from '@my/db'

const itemSchema = z.object({
  name: z.string().min(2, {
    message: 'Item name must be at least 2 characters.',
  }),
  brand: z.string().optional(),
  weight: z.coerce
    .number({
      invalid_type_error: 'Weight must be a number',
    })
    .optional(),
})

type PackItemFormProps = {
  itemId?: string
  itemName?: string
  itemBrand?: string
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
  itemBrand = '',
  itemWeight = 0,
  authorInfo,
  // userItems,
  tableContainerWidth,
  onLayout = () => {},
  action,
}: PackItemFormProps) => {
  const ctx = trpc.useUtils()
  const [accordionOpen, setAccordionOpen] = useState<string[]>([])
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
    onError: (e) => console.log('ERROR: ', e),
  })

  const { mutate: DeleteItem } = trpc.packs.deleteItem.useMutation({
    onSuccess: () => {
      void ctx.packs.getItems.invalidate()
    },
    onError: (e) => console.log('ERROR: ', e),
  })

  const form = useForm<z.infer<typeof itemSchema>>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: itemName,
      brand: itemBrand,
      weight: itemWeight,
    },
    mode: 'onChange',
  })

  function onSubmit(values: z.infer<typeof itemSchema>) {
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
          <FormTextInput
            name={'brand'}
            control={form.control}
            label="Brand"
            placeholder="Item  brand"
          />
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
