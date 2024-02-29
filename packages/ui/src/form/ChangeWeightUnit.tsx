import { Button, isWeb, Text } from 'tamagui'
import { Adapt, Select, Sheet, XStack } from 'tamagui'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemTitle,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from '../dropdown-menu'

export const ChangeWeightUnit = ({ onValueChange, localUnit }) => {
  const weightUnits = ['oz', 'lb', 'g', 'kg']

  return isWeb ? (
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
            {weightUnits.map((unit, index) => (
              <Select.Item value={unit} index={index}>
                <Select.ItemText>{unit}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Viewport>
        <Select.ScrollDownButton />
      </Select.Content>
    </Select>
  ) : (
    <DropdownMenuRoot>
      <DropdownMenuTrigger>
        <Button theme={'active'}>{localUnit}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {weightUnits.map((unit, index) => (
          <DropdownMenuItem key={unit} onSelect={() => onValueChange(unit)}>
            <DropdownMenuItemTitle>{unit}</DropdownMenuItemTitle>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenuRoot>
  )
}
