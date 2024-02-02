import { Label, RadioGroup, XStack } from 'tamagui'
import { Shirt } from '@tamagui/lucide-icons'

export function RadioGroupItemWithLabel({ size, value, label }) {
  const id = `radiogroup-${value}`
  return (
    <XStack width={300} alignItems="center" space="$4">
      <RadioGroup.Item value={value} id={id} size={size}>
        <Shirt />
        <RadioGroup.Indicator />
      </RadioGroup.Item>

      <Label size={size} htmlFor={id}>
        {label}
      </Label>
    </XStack>
  )
}
