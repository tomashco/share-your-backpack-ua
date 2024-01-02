import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { trpc } from 'app/utils/trpc'
import { z } from 'zod'
import { useRouter } from 'solito/router'
import { useEffect } from 'react'
import { Button, Form, H2, Text, YStack } from 'tamagui'
import FormTextInput from './form/formTextInput'

const itemSchema = z.object({
  name: z.string().min(2, {
    message: 'pack item must be at least 2 characters.',
  }),
  category: z.string().optional(),
  location: z.string().optional(),
})

type PackItemFormProps = {
  packId: string
  itemId?: string
  itemName?: string
  itemCategory?: string
  itemLocation?: string
  onLayout?: (event: any) => void
  action?: () => void
}

const PackItemForm = ({
  packId = '',
  itemId = '',
  itemName = '',
  itemCategory = '',
  itemLocation = '',
  onLayout = () => {},
  action,
}: PackItemFormProps) => {
  const ctx = trpc.useUtils()
  const { push } = useRouter()
  const router = useRouter()

  const { data: packData, mutate: addPackItem } = trpc.packs.addPackItems.useMutation({
    onSuccess: () => {
      void ctx.packs.getById.invalidate()
      if (action) action()
      form.reset()
    },
    onError: (e) => console.log('ERROR: ', e),
  })

  const { data: editResponse, mutate: editPackItem } = trpc.packs.editPackItem.useMutation({
    onSuccess: () => {
      void ctx.packs.getById.invalidate()
      if (action) action()
      // form.reset()
    },
    onError: (e) => console.log('ERROR: ', e),
  })

  const { data: deleteResponse, mutate: DeletePackItem } = trpc.packs.deletePackItem.useMutation({
    onSuccess: () => {
      void ctx.packs.getById.invalidate()
      // form.reset()
    },
    onError: (e) => console.log('ERROR: ', e),
  })

  // useEffect(() => {
  //   if (packData?.id) {
  //     push(`/pack/${packData.id}`)
  //   } else if (editData === 'ok') {
  //     push(`/pack/${packId}`)
  //   }
  // }, [packData, editData, router])

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
    if (itemId) {
      editPackItem({ packId, id: itemId, ...values })
    } else {
      addPackItem({ id: packId, packItems: [{ ...values }] })
    }
  }

  return (
    <YStack w={itemId ? '$20' : '100%'} onLayout={onLayout}>
      <Form onSubmit={form.handleSubmit(onSubmit)} {...form}>
        {!itemId && (
          <YStack marginBottom="$3" alignItems="center">
            <H2>{'Add a new pack item'}</H2>
          </YStack>
        )}
        <YStack space="$3" marginBottom="$3">
          <FormTextInput
            variant="input"
            placeholder="Name"
            control={form.control}
            name="name"
            label="Name"
          />

          <FormTextInput
            variant="input"
            placeholder="Category"
            control={form.control}
            name="category"
            label="Category"
          />
          <FormTextInput
            variant="input"
            placeholder="Location"
            control={form.control}
            name="location"
            label="Location"
          />
          {form.formState.errors.name?.message != null && (
            <Text>{form.formState.errors.name?.message}</Text>
          )}
          <Form.Trigger asChild>
            <Button theme={'blue'} accessibilityRole="link">
              {itemId ? 'Edit pack item' : 'Add pack item'}
            </Button>
          </Form.Trigger>
          {itemId && (
            <Button
              theme={'red'}
              onPress={() => DeletePackItem({ id: itemId, packId })}
              accessibilityRole="link"
            >
              Delete Item
            </Button>
          )}
        </YStack>
      </Form>
    </YStack>
  )
}

export { PackItemForm }
