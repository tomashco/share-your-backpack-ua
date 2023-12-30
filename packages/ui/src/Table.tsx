import { H3, H4, Paragraph, ScrollView, XStack, YStack } from 'tamagui'
import react, { useState, useRef } from 'react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { PackItem } from '@my/db'
import { ArrowUpRight, X } from '@tamagui/lucide-icons'

const HEADER_SIZE = 200
const ROW_HEIGHT = 40
const ROW_HEIGHT_EXPANDED = 200

const Table = ({ data }) => {
  const [viewDetailsId, setViewDetailsId] = useState('')
  const tableContainerRef = useRef({ x: 0, y: 0, width: 0, height: 0 })
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
        <YStack id="table" borderColor="$black" borderWidth="$1">
          <XStack id="tableHeader" backgroundColor={'lightgray'}>
            {headers.map((header) => (
              <XStack
                key={'head' + header}
                h={ROW_HEIGHT}
                w={HEADER_SIZE}
                borderColor={'darkgray'}
                borderWidth={'$1'}
              >
                <Paragraph>{header}</Paragraph>
              </XStack>
            ))}
          </XStack>
          <YStack id="tableBody">
            {data.packItems.map((row) => (
              <XStack>
                {viewDetailsId === row.id ? (
                  <XStack
                    h={ROW_HEIGHT_EXPANDED}
                    w={'100%'}
                    key={viewDetailsId}
                    borderColor={'gray'}
                    flexDirection="column"
                    borderBottomWidth={'$1'}
                  >
                    {headers.map((key) => (
                      <XStack key={'body' + key} ai={'center'}>
                        <H4>{key}: </H4>
                        <Paragraph>{row[key]}</Paragraph>
                      </XStack>
                    ))}
                  </XStack>
                ) : (
                  <>
                    {headers.map((key) => (
                      <XStack
                        onPress={() => setViewDetailsId('')}
                        w={HEADER_SIZE}
                        h={ROW_HEIGHT}
                        key={key}
                        borderColor={'gray'}
                        borderWidth={'$1'}
                      >
                        <Paragraph>{row[key]}</Paragraph>
                      </XStack>
                    ))}
                  </>
                )}
              </XStack>
            ))}
          </YStack>
        </YStack>
      </ScrollView>
      <YStack id="stickyTable" borderColor="$black" borderWidth="$1">
        <XStack id="stickyTableHeader" h={ROW_HEIGHT} backgroundColor={'lightgray'} />
        <YStack
          id="stickyTableBody"
          shadowColor={'gray'}
          shadowRadius={10}
          shadowOffset={{ width: -5, height: 5 }}
          backgroundColor="white"
        >
          {data.packItems.map((row) => {
            const isSelected = viewDetailsId === row.id
            return (
              <XStack
                key={row.id}
                onPress={() => (isSelected ? setViewDetailsId('') : setViewDetailsId(row.id))}
                h={isSelected ? ROW_HEIGHT_EXPANDED : ROW_HEIGHT}
                w={ROW_HEIGHT}
                justifyContent="center"
                alignItems={isSelected ? 'flex-start' : 'center'}
                padding="$2"
                borderBottomWidth={'$1'}
                borderColor={'gray'}
              >
                {isSelected ? <X /> : <ArrowUpRight />}
              </XStack>
            )
          })}
        </YStack>
      </YStack>
    </XStack>
  )
}

export { Table }
