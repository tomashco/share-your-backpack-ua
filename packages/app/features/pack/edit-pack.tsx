import { Pack, PackItem } from '@my/db/index'
import { Button, H1, H3, Paragraph, ScrollView, ToggleGroup, YStack, XStack, View } from '@my/ui'
import { PageLayout } from '@my/ui/src'
import { CreatePackForm } from '@my/ui/src/packForm'
import { ChevronLeft, View as ViewIcon } from '@tamagui/lucide-icons'
import { Header } from 'app/components/header'
import { onAppStateChange, trpc } from 'app/utils/trpc'
import React, { useEffect, useRef, useState } from 'react'
import { createParam } from 'solito'
import { useLink } from 'solito/link'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

const { useParam } = createParam<{ id: string }>()

const newColumnHelper = createColumnHelper<PackItem>()
const stickyNewColumnHelper = createColumnHelper<{ id: string; edit: string }>()

const newColumns = [
  newColumnHelper.accessor('name', {
    header: () => 'Name',
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  newColumnHelper.accessor('category', {
    cell: (info) => <Paragraph>{info.getValue()}</Paragraph>,
    header: () => 'Category',
    footer: (info) => info.column.id,
  }),
  newColumnHelper.accessor('location', {
    header: () => 'Location',
    footer: (info) => info.column.id,
  }),
]

const stickyNewColumns = [
  stickyNewColumnHelper.accessor('edit', {
    cell: (info) => info.getValue(),
    header: () => 'edit',
    footer: () => 'edit',
  }),
]

export function EditPackScreen() {
  const [id] = useParam('id')
  const { data, isLoading, error } = trpc.packs.getById.useQuery({ id: id || '' })
  const [viewDetailsId, setViewDetailsId] = useState('')
  const tableContainerRef = useRef({ x: 0, y: 0, width: 0, height: 0 })

  if (isLoading || error)
    return (
      <YStack w="100%" $gtSm={{ width: '35rem' }}>
        {isLoading ? (
          <Paragraph>Loading...</Paragraph>
        ) : error ? (
          <Paragraph>{error.message}</Paragraph>
        ) : (
          <YStack
            $gtSm={{
              width: '25rem',
            }}
            w="100%"
          >
            {/* <CreatePackForm /> */}
          </YStack>
        )}
      </YStack>
    )
  const stickyNewTableData = data.packItems.map((val) => {
    return { id: val.id, edit: 'edit' }
  })

  const tableRef = useRef(
    data.packItems.map(() => {
      return { x: 0, y: 0, width: 0, height: 0 }
    })
  )
  const newTable = useReactTable({
    data: data.packItems,
    columns: newColumns,
    defaultColumn: {
      size: 200,
    },
    getCoreRowModel: getCoreRowModel(),
  })
  const stickyNewTable = useReactTable({
    data: stickyNewTableData,
    columns: stickyNewColumns,
    defaultColumn: {
      size: 50,
    },
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <ScrollView
      onScrollBeginDrag={() => onAppStateChange('active')}
      onScrollEndDrag={() => onAppStateChange('inactive')}
    >
      <PageLayout>
        <Header />
        <YStack w="100%" $gtSm={{ width: '35rem' }}>
          <YStack
            $gtSm={{
              width: '25rem',
            }}
            w="100%"
          >
            {/* <CreatePackForm /> */}
          </YStack>
        </YStack>
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
                <>
                  {newTable.getHeaderGroups().map((headerGroup) => (
                    <XStack key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <XStack
                          key={header.id}
                          // flex={1}
                          w={header.getSize()}
                          borderColor={'darkgray'}
                          borderWidth={'$1'}
                        >
                          <Paragraph>
                            {header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.header, header.getContext())}
                          </Paragraph>
                        </XStack>
                      ))}
                    </XStack>
                  ))}
                </>
              </XStack>
              <YStack>
                {newTable.getRowModel().rows.map((row, index) => (
                  <XStack
                    key={row.id}
                    onLayout={(event) => {
                      tableRef.current[index] = event.nativeEvent.layout
                    }}
                  >
                    {/* {viewDetailsId === row.original.id ? (
                      <XStack
                        w={table.getHeaderGroups()[0]?.headers[index]?.getSize()}
                        key={row.id}
                        borderColor={'gray'}
                        borderWidth={'$1'}
                      >
                        {row.getVisibleCells().map((cellValue) => (
                          <Paragraph>{cellValue.column.columnDef.cell}</Paragraph>
                        ))}
                      </XStack>
                    ) : (
                      <> */}
                    {row.getVisibleCells().map((cell, index) => (
                      <XStack
                        w={newTable.getHeaderGroups()[0]?.headers[index]?.getSize()}
                        key={cell.id}
                        borderColor={'gray'}
                        borderWidth={'$1'}
                      >
                        <Paragraph>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </Paragraph>
                      </XStack>
                    ))}
                    {/* </>
                    )} */}
                  </XStack>
                ))}
              </YStack>
              <YStack>
                {newTable.getFooterGroups().map((footerGroup) => (
                  <XStack key={footerGroup.id} backgroundColor={'lightgray'}>
                    {footerGroup.headers.map((header, index) => (
                      <XStack key={header.id} w={header.getSize()}>
                        <Paragraph>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.footer, header.getContext())}
                        </Paragraph>
                      </XStack>
                    ))}
                  </XStack>
                ))}
              </YStack>
            </YStack>
          </ScrollView>
          <YStack id="stickyTable" borderColor="$black" borderWidth="$1">
            <XStack id="tableHeader" backgroundColor={'lightgray'}>
              {stickyNewTable.getHeaderGroups().map((headerGroup) => (
                <XStack key={headerGroup.id}>
                  {headerGroup.headers.map((header, index) => (
                    <XStack
                      key={header.id}
                      // flex={1}
                      w={header.getSize()}
                      borderColor={'darkgray'}
                      borderWidth={'$1'}
                    >
                      <Paragraph>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </Paragraph>
                    </XStack>
                  ))}
                </XStack>
              ))}
            </XStack>
            <YStack>
              {stickyNewTable.getRowModel().rows.map((row, index) => (
                <XStack key={row.id} h={tableRef.current[index]?.height}>
                  {row.getVisibleCells().map((cell, index) => (
                    <XStack
                      w={stickyNewTable.getHeaderGroups()[0]?.headers[index]?.getSize()}
                      key={cell.id}
                      borderColor={'gray'}
                      borderWidth={'$1'}
                    >
                      <Paragraph onPress={() => setViewDetailsId(row.original.id)}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </Paragraph>
                    </XStack>
                  ))}
                </XStack>
              ))}
            </YStack>
            <YStack>
              {stickyNewTable.getFooterGroups().map((footerGroup) => (
                <XStack key={footerGroup.id} backgroundColor={'lightgray'}>
                  {footerGroup.headers.map((header, index) => (
                    <XStack key={header.id} w={header.getSize()}>
                      <Paragraph>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.footer, header.getContext())}
                      </Paragraph>
                    </XStack>
                  ))}
                </XStack>
              ))}
            </YStack>
          </YStack>
        </XStack>
      </PageLayout>
    </ScrollView>
  )
}
