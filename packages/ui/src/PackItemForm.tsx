import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { trpc } from 'app/utils/trpc'
import { z } from 'zod'
import { useState } from 'react'
import { Button, Form, H2, YStack, Accordion } from 'tamagui'
import { FilterInputAccordionItem } from './FilterInputAccordionItem'
import { Item } from '@my/db'

const itemSchema = z.object({
  name: z.string().min(2, {
    message: 'pack item must be at least 2 characters.',
  }),
  category: z.string().optional(),
  location: z.string().optional(),
})

type PackItemFormProps = {
  packId: string
  packItemId?: string
  itemId?: string
  userItems?: Item[]
  itemName?: string
  itemCategory?: string
  itemLocation?: string
  categoryItems?: { name: string }[]
  locationItems?: { name: string }[]
  tableContainerWidth?: number
  onLayout?: (event: any) => void
  action?: () => void
}

const PackItemForm = ({
  packId = '',
  packItemId = '',
  itemId = '',
  itemName = '',
  itemCategory = '',
  itemLocation = '',
  userItems = [],
  categoryItems = [],
  locationItems = [],
  tableContainerWidth,
  onLayout = () => {},
  action,
}: PackItemFormProps) => {
  const ctx = trpc.useUtils()
  const [accordionOpen, setAccordionOpen] = useState<string[]>([])
  const { mutate: addPackItem } = trpc.packs.addPackItem.useMutation({
    onSuccess: () => {
      void ctx.packs.getById.invalidate()
      if (action) action()
      form.reset()
    },
    onError: (e) => console.log('ERROR: ', e),
  })

  const { mutate: editPackItem } = trpc.packs.editPackItem.useMutation({
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
      void ctx.packs.getById.invalidate()
      if (action) action()
    },
    onError: (e) => console.log('ERROR: ', e),
  })

  const { mutate: DeletePackItem } = trpc.packs.deletePackItem.useMutation({
    onSuccess: () => {
      void ctx.packs.getById.invalidate()
    },
    onError: (e) => console.log('ERROR: ', e),
  })

  const form = useForm<z.infer<typeof itemSchema>>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: itemName,
      category: itemCategory,
      location: itemLocation,
    },
    mode: 'onChange',
  })

  function onSubmit(values: z.infer<typeof itemSchema>) {
    const findItemId = itemId || userItems.find((el) => el.name === values.name)?.itemId || ''
    if (packItemId) {
      editPackItem({ packId, packItemId, ...values, itemId: findItemId }) //itemId
    } else {
      addPackItem({ packId, packItem: { ...values, itemId: findItemId } })
    }
    setAccordionOpen([])
    form.reset()
  }

  return (
    <YStack w={tableContainerWidth ? tableContainerWidth : '100%'} onLayout={onLayout}>
      <Form onSubmit={form.handleSubmit(onSubmit)} {...form}>
        {!packItemId && (
          <YStack marginBottom="$3" alignItems="center">
            <H2>{'Add a new item'}</H2>
          </YStack>
        )}
        <YStack space="$3" marginBottom="$3">
          <Accordion
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
            <FilterInputAccordionItem
              label={'Category'}
              accordionId={'categoryAccordion'}
              headerPlaceholder="Select category"
              inputPlaceholder="search or add new"
              items={categoryItems}
              setAccordionOpen={setAccordionOpen}
              name="category"
              control={form.control}
            />
            <FilterInputAccordionItem
              label={'Location'}
              accordionId={'locationAccordion'}
              headerPlaceholder="Select location"
              inputPlaceholder="search or add new"
              items={locationItems}
              setAccordionOpen={setAccordionOpen}
              name="location"
              control={form.control}
            />
          </Accordion>
          <Form.Trigger asChild>
            <Button theme={'active'} accessibilityRole="link">
              {packItemId ? 'Edit' : 'Add'}
            </Button>
          </Form.Trigger>
          {packItemId && (
            <Button onPress={() => DeletePackItem({ packItemId, packId })} accessibilityRole="link">
              Delete Item
            </Button>
          )}
        </YStack>
      </Form>
    </YStack>
  )
}

export { PackItemForm }
