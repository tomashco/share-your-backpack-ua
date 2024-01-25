import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { trpc } from 'app/utils/trpc'
import { z } from 'zod'
import { useRouter } from 'solito/router'
import { useEffect } from 'react'
import { Button, Form, H2, Text, useTheme, YStack } from 'tamagui'
import FormTextInput from './form/formTextInput'

const itemSchema = z.object({
  name: z.string().min(2, {
    message: 'pack item must be at least 2 characters.',
  }),
  category: z.string().optional(),
  location: z.string().optional(),
})

const packSchema = z.object({
  name: z.string().min(2, {
    message: 'pack name must be at least 2 characters.',
  }),
  description: z.string().optional(),
  packItems: z.array(itemSchema).optional(),
})

export function PackForm({ packId = '', packName = '', packDescription = '' }) {
  const ctx = trpc.useUtils()
  const { push } = useRouter()
  const router = useRouter()
  const theme = useTheme()

  const { data: packData, mutate: createPack } = trpc.packs.createPack.useMutation({
    onSuccess: () => {
      void ctx.packs.getAll.invalidate()
      form.reset()
    },
    onError: (e) => console.log('ERROR: ', e),
  })
  const { data: editData, mutate: editPack } = trpc.packs.editPack.useMutation({
    onSuccess: () => {
      void ctx.packs.getById.invalidate()
      // form.reset()
    },
    onError: (e) => console.log('ERROR: ', e),
  })

  useEffect(() => {
    if (packData?.packId) {
      push(`/pack/${packData.packId}`)
    } else if (editData === 'ok') {
      push(`/pack/${packId}`)
    }
  }, [packData, editData, router])

  const form = useForm<z.infer<typeof packSchema>>({
    resolver: zodResolver(packSchema),
    defaultValues: {
      name: packName,
      description: packDescription,
    },
    mode: 'onChange',
  })

  function onSubmit(values: z.infer<typeof packSchema>) {
    if (packId) {
      editPack({ id: packId, ...values })
    } else {
      createPack({ ...values })
    }
  }

  return (
    <YStack w="100%">
      <Form onSubmit={form.handleSubmit(onSubmit)} {...form}>
        <YStack marginBottom="$3" alignItems="center">
          <H2>{packId ? 'Edit pack information' : 'Add a new pack'}</H2>
        </YStack>
        <YStack space="$3">
          <FormTextInput
            bc={theme.color1}
            variant="input"
            placeholder="Pack Name"
            control={form.control}
            name="name"
            label="Name"
          />

          <FormTextInput
            variant="textarea"
            bc={theme.color1}
            placeholder="Pack Description"
            control={form.control}
            name="description"
            label="Description"
          />
          {form.formState.errors.name?.message != null && (
            <Text>{form.formState.errors.name?.message}</Text>
          )}
          <Form.Trigger asChild>
            <Button theme={'active'} accessibilityRole="link">
              {packId ? 'Edit pack' : 'Create pack'}
            </Button>
          </Form.Trigger>
        </YStack>
      </Form>
    </YStack>
  )
}
