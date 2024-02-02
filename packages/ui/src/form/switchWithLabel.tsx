import { useController } from 'react-hook-form'
import { Label, Separator, Switch, XStack } from 'tamagui'

export function SwitchWithLabel({ defaultChecked, name, control }) {
  const { field } = useController({
    name: name,
    control: control,
  })
  return (
    <XStack width={200} alignItems="center" space="$4">
      <Label paddingRight="$0" minWidth={90} justifyContent="flex-start" size={'$4'}>
        Is worn:
      </Label>
      <Separator minHeight={20} vertical />
      <Switch
        onPress={() => field.onChange(!field.value)}
        checked={field.value}
        theme={'active'}
        size={'$3'}
        defaultChecked={defaultChecked}
      >
        <Switch.Thumb animation="quick" />
      </Switch>
    </XStack>
  )
}
