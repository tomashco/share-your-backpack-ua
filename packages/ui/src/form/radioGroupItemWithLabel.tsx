import { Label, RadioGroup, XStack } from 'tamagui'

export function RadioGroupItemWithLabel({ size, value, label }) {
  const id = `radiogroup-${value}`
  return (
    <XStack width={300} alignItems="center" space="$4">
      <RadioGroup.Item value={value} id={id} size={size}>
        <RadioGroup.Indicator />
      </RadioGroup.Item>

      <Label size={size} htmlFor={id}>
        {label}
      </Label>
    </XStack>
  )
}
