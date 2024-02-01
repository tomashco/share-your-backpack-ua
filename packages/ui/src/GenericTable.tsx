import { Paragraph, ScrollView, XStack, YStack } from 'tamagui'
import { useState, useRef } from 'react'
import { Edit3, X } from '@tamagui/lucide-icons'
import { PackItemForm } from './PackItemForm'

const HEADER_SIZE = 200
const ROW_HEIGHT = 40
const INITIAL_EXPANDED_ROW_HEIGHT = 200

const GenericTable = ({ headers, data }) => {
  const [viewDetailsId, setViewDetailsId] = useState('')
  const tableContainerRef = useRef({ x: 0, y: 0, width: 0, height: 0 })
  const [cellHeight, setCellHeight] = useState(INITIAL_EXPANDED_ROW_HEIGHT)
  return (
    <XStack
      id="tableContainer"
      w="100%"
      onLayout={(event) => {
        tableContainerRef.current = event.nativeEvent.layout
      }}
    >
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <YStack id="table">
          <XStack borderTopLeftRadius={10} id="tableHeader" backgroundColor={'$background'}>
            {headers.map((header) => (
              <XStack
                key={'head' + header.key}
                h={ROW_HEIGHT}
                w={header.width || HEADER_SIZE}
                alignItems="center"
                paddingLeft="$2"
                paddingRight="$2"
              >
                <Paragraph w={'100%'} textAlign={header.textAlign}>
                  {header.label}
                </Paragraph>
              </XStack>
            ))}
          </XStack>
          <YStack id="tableBody">
            {data.map((row) => (
              <XStack key={row.id}>
                {viewDetailsId === row.id ? (
                  <XStack
                    h={cellHeight}
                    w={'100%'}
                    borderColor={'gray'}
                    flexDirection="column"
                    borderBottomWidth={'$1'}
                  >
                    {row.detailedView({
                      tableContainerWidth: tableContainerRef.current.width - 50,
                      onLayout: (event) => {
                        setCellHeight(event.nativeEvent.layout.height)
                      },
                      action: () => setViewDetailsId(''),
                    })}
                  </XStack>
                ) : (
                  <>
                    {headers.map((header) => (
                      <XStack
                        onPress={() => setViewDetailsId('')}
                        h={ROW_HEIGHT}
                        w={header.width || HEADER_SIZE}
                        alignItems="center"
                        paddingLeft="$2"
                        paddingRight="$2"
                        key={'body' + header.key}
                        borderColor={'gray'}
                        borderBottomWidth={'$1'}
                      >
                        <Paragraph w={'100%'} textAlign={header.textAlign}>
                          {row[header.key]}
                        </Paragraph>
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
          backgroundColor={'$background'}
        />
        <YStack
          id="stickyTableBody"
          shadowColor={'gray'}
          elevation={10}
          shadowRadius={10}
          shadowOffset={{ width: -5, height: 5 }}
          backgroundColor="$color1"
        >
          {data.map((row) => {
            const isSelected = viewDetailsId === row.id
            return (
              <XStack
                key={row.id}
                onPress={() => (isSelected ? setViewDetailsId('') : setViewDetailsId(row.id))}
                h={isSelected ? cellHeight : ROW_HEIGHT}
                w={ROW_HEIGHT}
                justifyContent="center"
                alignItems={isSelected ? 'flex-start' : 'center'}
                padding="$2"
                borderBottomWidth={'$1'}
                borderColor={'gray'}
              >
                {isSelected ? <X color={'$color10'} /> : <Edit3 color={'$color10'} />}
              </XStack>
            )
          })}
        </YStack>
      </YStack>
    </XStack>
  )
}

export { GenericTable }
