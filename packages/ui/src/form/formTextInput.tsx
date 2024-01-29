import { useController } from 'react-hook-form'
import { Input, Label, TextArea } from 'tamagui'

export default function FormTextInput({
  name,
  control,
  label,
  variant = '',
  placeholder = '',
  ...props
}) {
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
      <>
        {label && <Label>{label}</Label>}
        <TextArea
          {...props}
          placeholder={placeholder}
          ref={field.ref}
          value={field.value}
          onChangeText={field.onChange}
          onBlur={field.onBlur}
        />
      </>
    )
  return (
    <>
      {label && <Label>{label}</Label>}
      <Input
        {...props}
        placeholder={placeholder}
        ref={field.ref}
        value={field.value}
        onChangeText={field.onChange}
        onBlur={field.onBlur}
      />
    </>
  )
}
