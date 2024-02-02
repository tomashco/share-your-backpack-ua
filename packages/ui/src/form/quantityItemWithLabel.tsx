import { useController } from 'react-hook-form'
import { Button, Label, XStack } from 'tamagui'

export function QuantityItemWithLabel({ containerStyle = {}, size, label, name, control }) {
  const { field } = useController({
    name: name,
    control: control,
  })
  return (
    <XStack {...containerStyle} width={300} alignItems="center" space="$4">
      <Label size={size}>{label}</Label>
      <Button
        size={size}
        onPress={() => field.onChange(Math.max(1, field.value - 1))}
        circular
        theme={'active'}
      >
        -
      </Button>
      <Label>{field.value}</Label>
      <Button size={size} onPress={() => field.onChange(field.value + 1)} circular theme={'active'}>
        +
      </Button>
    </XStack>
  )
}
