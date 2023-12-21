import { useController } from 'react-hook-form'
import { Input, TextArea } from 'tamagui'

export default function FormTextInput({ name, control, variant, ...props }) {
  const {
    field,
    fieldState: { invalid, isTouched, isDirty },
    formState: { touchedFields, dirtyFields },
  } = useController({
    name: name,
    control: control,
    // rules: rules,
  })

  if (variant === 'textarea')
    return (
      <TextArea
        {...props}
        ref={field.ref}
        value={field.value}
        onChangeText={field.onChange}
        onBlur={field.onBlur}
      />
    )
  return (
    <Input
      {...props}
      ref={field.ref}
      value={field.value}
      onChangeText={field.onChange}
      onBlur={field.onBlur}
    />
  )
}
