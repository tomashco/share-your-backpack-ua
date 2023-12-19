import { useController, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { trpc } from 'app/utils/trpc'
import { z } from 'zod'
import { useRouter } from 'solito/router'
import { useEffect, useState } from 'react'
import { Button, Form, H1, Input, Text } from 'tamagui'
import FormTextInput from './form/formTextInput'

const itemSchema = z.object({
  name: z.string().min(2, {
    message: 'pack name must be at least 2 characters.',
  }),
  category: z.string().optional(),
  location: z.string().optional(),
})

const packItemSchema = z.object({ packItems: z.array(itemSchema) })

const packSchema = z.object({
  name: z.string().min(2, {
    message: 'pack name must be at least 2 characters.',
  }),
  description: z.string().optional(),
  packItems: z.array(itemSchema).optional(),
})

export function CreatePackForm() {
  const ctx = trpc.useUtils()
  const { push } = useRouter()
  // const { toast } = useToast();
  const router = useRouter()

  const { data: packData, mutate: createPack } = trpc.packs.createPack.useMutation({
    onSuccess: () => {
      void ctx.packs.getAll.invalidate()
      form.reset()
    },
    onError: (e) => console.log('ERROR: ', e),
    // displayError(e, toast),
  })

  useEffect(() => {
    if (packData?.id) {
      push(`/pack/${packData.id}`)
    }
  }, [packData, router])

  const form = useForm<z.infer<typeof packSchema>>({
    resolver: zodResolver(packSchema),
    defaultValues: {
      name: '',
      description: '',
    },
    mode: 'onChange',
  })

  function onSubmit(values: z.infer<typeof packSchema>) {
    createPack({ ...values })
  }

  const [message, setMessage] = useState<string | null>(null)

  // const onSubmit = (formValues) => {
  //   setMessage(`packName: ${formValues.name} packDescription: ${formValues.description}`)
  // }

  return (
    <Form onSubmit={form.handleSubmit(onSubmit)} {...form}>
      <H1>Add a new pack</H1>
      <FormTextInput control={form.control} name="name" label="Name" />

      <FormTextInput control={form.control} name="description" label="Name" />
      {form.formState.errors.name?.message != null && (
        <Text>{form.formState.errors.name?.message}</Text>
      )}
      <Form.Trigger asChild>
        <Button
          theme={'blue'}
          accessibilityRole="link"
          // onPress={() => {
          // push(`/pack/${pack.id}`)
          // }}
        >
          create Pack
        </Button>
      </Form.Trigger>
      {message != null && <Text>{message}</Text>}

      {/* <form > */}
      {/* <div className="my-3">
          </div>
          <div className="space-y-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pack Name</FormLabel>
                  <FormControl>
                    <Input placeholder="New Pack 2043" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Just write something about your trail!"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div> */}
      {/* </form> */}
    </Form>
  )
}
