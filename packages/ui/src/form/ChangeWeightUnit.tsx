import { Select, XStack } from 'tamagui'

export const ChangeWeightUnit = ({ onValueChange, localUnit }) => {
  console.log('🚀 ~ localUnit:', localUnit)
  return (
    <Select onValueChange={onValueChange}>
      <XStack w={'$6'}>
        <Select.Trigger>
          <Select.Value placeholder={`${localUnit}`} />
        </Select.Trigger>
      </XStack>

      <Select.Content>
        <Select.ScrollUpButton />

        <Select.Viewport>
          <Select.Group>
            <Select.Item value="oz" title="oz" index={1}>
              <Select.ItemText />
            </Select.Item>

            <Select.Item value="lb" title="lb" index={2}>
              <Select.ItemText />
            </Select.Item>

            <Select.Item value="g" title="g" index={3}>
              <Select.ItemText />
            </Select.Item>

            <Select.Item value="kg" title="kg" index={4}>
              <Select.ItemText />
            </Select.Item>
          </Select.Group>
        </Select.Viewport>
        <Select.ScrollDownButton />
      </Select.Content>
    </Select>
  )
}
