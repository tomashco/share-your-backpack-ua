import { useState } from 'react'
import { Keyboard, TouchableWithoutFeedback } from 'react-native'
import {
  ScrollView,
  Input,
  XStack,
  YStack,
  Button,
  Accordion,
  Paragraph,
  Square,
  Label,
} from 'tamagui'
import { ChevronDown } from '@tamagui/lucide-icons'
import { useController } from 'react-hook-form'

export const FilterInputAccordionItem = ({
  accordionId,
  items,
  setAccordionOpen,
  headerPlaceholder,
  inputPlaceholder,
  label,
  name,
  control,
}) => {
  const { field } = useController({
    name: name,
    control: control,
  })
  const [filterList, setFilterList] = useState<{ name: string }[]>(items)
  // const [selectedItem, setSelectedItem] = useState(field.value)

  const filterItems = (value) => {
    field.onChange(value)
    let filterData =
      items && items?.length > 0
        ? items?.filter((data) => data?.name?.toLowerCase()?.includes(value?.toLowerCase()))
        : []
    setFilterList([...filterData])
  }

  const onSelected = (value) => {
    field.onChange(value)
    field.value = value
    // setSelectedItem(value)
    setFilterList([])
    setAccordionOpen([])
  }
  return (
    <>
      {label && <Label>{label}</Label>}
      <Accordion.Item value={accordionId}>
        <Accordion.Trigger
          h={'$4'}
          p="$2"
          borderRadius={'$4'}
          flexDirection="row"
          justifyContent="space-between"
        >
          {({ open }) => (
            <>
              <Paragraph color={field.value ? 'black' : 'gray'}>
                {field.value || headerPlaceholder}
              </Paragraph>
              <Square animation="quick" rotate={open ? '180deg' : '0deg'}>
                <ChevronDown color={'gray'} size="$1" />
              </Square>
            </>
          )}
        </Accordion.Trigger>
        <Accordion.Content>
          <XStack alignItems="center" justifyContent="space-between" space>
            <Input
              placeholder={inputPlaceholder}
              flexGrow={1}
              size="$4"
              value={field.value}
              onChangeText={filterItems}
              ref={field.ref}
              onBlur={field.onBlur}
            />
            <Button
              onPress={() => {
                // Keyboard.dismiss()
                console.log('🚀 ~ Keyboard.dismiss:')
                onSelected(field.value)
              }}
              size="$4"
            >
              asdfasdf
            </Button>
          </XStack>
          <YStack h={filterList.length > 0 ? '$15' : '$0'}>
            <ScrollView>
              {filterList.map((item, index) => (
                <XStack key={item.name + index} borderBottomWidth={1} borderColor="lightgray">
                  <Paragraph p="$2" w="100%" onPressIn={() => onSelected(item?.name)}>
                    {item?.name || ''}
                  </Paragraph>
                </XStack>
              ))}
            </ScrollView>
          </YStack>
        </Accordion.Content>
      </Accordion.Item>
    </>
  )
}
