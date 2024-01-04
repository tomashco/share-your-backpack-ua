import { useState } from 'react'
import {
  ScrollView,
  Input,
  Text,
  XStack,
  YStack,
  Button,
  Accordion,
  Paragraph,
  Square,
  Label,
} from 'tamagui'
import { ChevronDown } from '@tamagui/lucide-icons'

export const FilterInputAccordionItem = ({
  accordionId,
  items,
  setAccordionOpen,
  headerPlaceholder,
  inputPlaceholder,
  label,
}) => {
  const [filterList, setFilterList] = useState<{ name: string }[]>(items)
  const [selectedItem, setSelectedItem] = useState('')
  const [inputValue, setInputValue] = useState('')

  const filterItems = (value) => {
    setInputValue(value)
    let filterData =
      items && items?.length > 0
        ? items?.filter((data) => data?.name?.toLowerCase()?.includes(value?.toLowerCase()))
        : []
    setFilterList([...filterData])
  }

  const onSelected = (value) => {
    setInputValue(value)
    setSelectedItem(value)
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
              <Paragraph color={selectedItem ? 'black' : 'gray'}>
                {selectedItem || headerPlaceholder}
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
              value={inputValue}
              onChangeText={filterItems}
            />
            <Button size="$4" onPress={() => onSelected(inputValue)}>
              Add
            </Button>
          </XStack>
          <YStack h={filterList.length > 0 ? '$15' : '$0'}>
            <ScrollView>
              {filterList.map((item, index) => (
                <XStack key={item.name + index} borderBottomWidth={1} borderColor="lightgray">
                  <Paragraph p="$2" w="100%" onPress={() => onSelected(item?.name)}>
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
