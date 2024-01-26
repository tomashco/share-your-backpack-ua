import { Paragraph, ScrollView, XStack, YStack } from 'tamagui'
import { useState, useRef } from 'react'
import { ArrowUpRight, X } from '@tamagui/lucide-icons'
import { PackItemForm } from './PackItemForm'

const HEADER_SIZE = 200
const ROW_HEIGHT = 40
const INITIAL_EXPANDED_ROW_HEIGHT = 200

const Table = ({ data, categoryItems, locationItems, userItems }) => {
  const [viewDetailsId, setViewDetailsId] = useState('')
  const tableContainerRef = useRef({ x: 0, y: 0, width: 0, height: 0 })
  const [cellHeight, setCellHeight] = useState(INITIAL_EXPANDED_ROW_HEIGHT)
  const headers = ['name', 'category', 'location']
  return (
    <XStack
      id="tableContainer"
      w="100%"
      $gtSm={{ width: '35rem' }}
      onLayout={(event) => {
        tableContainerRef.current = event.nativeEvent.layout
      }}
    >
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <YStack id="table">
          <XStack borderTopLeftRadius={10} id="tableHeader" backgroundColor={'$background'}>
            {headers.map((header) => (
              <XStack
                key={'head' + header}
                h={ROW_HEIGHT}
                w={HEADER_SIZE}
                alignItems="center"
                paddingLeft="$2"
                paddingRight="$2"
              >
                <Paragraph>{header}</Paragraph>
              </XStack>
            ))}
          </XStack>
          <YStack id="tableBody">
            {data.packItems.map((row) => (
              <XStack key={row.packItemId}>
                {viewDetailsId === row.packItemId ? (
                  <XStack
                    h={cellHeight}
                    w={'100%'}
                    borderColor={'gray'}
                    flexDirection="column"
                    borderBottomWidth={'$1'}
                  >
                    <PackItemForm
                      userItems={userItems}
                      categoryItems={categoryItems}
                      locationItems={locationItems}
                      packId={data.packId}
                      packItemId={row.packItemId}
                      itemName={row.item.name}
                      itemId={row.item.itemId}
                      itemLocation={row.location}
                      itemCategory={row.category}
                      tableContainerWidth={tableContainerRef.current.width - 50}
                      onLayout={(event) => {
                        setCellHeight(event.nativeEvent.layout.height)
                      }}
                      action={() => setViewDetailsId('')}
                    />
                  </XStack>
                ) : (
                  <>
                    {headers.map((key) => (
                      <XStack
                        onPress={() => setViewDetailsId('')}
                        w={HEADER_SIZE}
                        h={ROW_HEIGHT}
                        alignItems="center"
                        paddingLeft="$2"
                        paddingRight="$2"
                        key={'body' + key}
                        borderColor={'gray'}
                        borderBottomWidth={'$1'}
                      >
                        <Paragraph>{key === 'name' ? row.item.name : row[key]}</Paragraph>
                      </XStack>
                    ))}
                  </>
                )}
              </XStack>
            ))}
          </YStack>
        </YStack>
      </ScrollView>
      <YStack id="stickyTable">
        <XStack
          id="stickyTableHeader"
          h={ROW_HEIGHT}
          borderTopRightRadius={10}
          backgroundColor={'$color12'}
        />
        <YStack
          id="stickyTableBody"
          shadowColor={'gray'}
          elevation={10}
          shadowRadius={10}
          shadowOffset={{ width: -5, height: 5 }}
          backgroundColor="$color1"
        >
          {data.packItems.map((row) => {
            const isSelected = viewDetailsId === row.packItemId
            return (
              <XStack
                key={row.packItemId}
                onPress={() =>
                  isSelected ? setViewDetailsId('') : setViewDetailsId(row.packItemId)
                }
                h={isSelected ? cellHeight : ROW_HEIGHT}
                w={ROW_HEIGHT}
                justifyContent="center"
                alignItems={isSelected ? 'flex-start' : 'center'}
                padding="$2"
                borderBottomWidth={'$1'}
                borderColor={'gray'}
              >
                {isSelected ? <X color={'$color10'} /> : <ArrowUpRight color={'$color10'} />}
              </XStack>
            )
          })}
        </YStack>
      </YStack>
    </XStack>
  )
}

export { Table }
