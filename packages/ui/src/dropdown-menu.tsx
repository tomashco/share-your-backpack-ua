import { FC, ComponentProps } from 'react'

/**
 * Utilities to make Typescript happy wrapping Zeego components with Tamagui's
 * styled() components. These utils do nothing except assign Typescript types.
 *
 * Makes the following props optional and of `unknown` type:
 * - children
 * - key
 *
 * The fixText() version of the util includes tricks to make Tamagui give the
 * component Text style properties
 */

export type PropsToMakeOptional = 'children' | 'key'
export type TargetPropsType = {
  [key in PropsToMakeOptional]?: unknown
}

export const fixView = <T extends {}>(Component: FC<T>) => {
  return Component as T extends TargetPropsType
    ? FC<Omit<T, PropsToMakeOptional> & Partial<Pick<T, PropsToMakeOptional>>>
    : FC<T>
}

export const fixText = <T extends {}>(Component: FC<T>) => {
  return Component as unknown as T extends TargetPropsType
    ? FC<
        { textAlign?: 'left' | 'center' | 'right' } & Omit<T, PropsToMakeOptional> &
          Partial<Pick<T, PropsToMakeOptional>>
      >
    : FC<{ textAlign?: 'left' | 'center' | 'right' } & T>
}

/**
 * Usage example:
 */

import { styled } from 'tamagui'
import * as Dropdown from 'zeego/dropdown-menu'

const DropdownMenuRoot = Dropdown.Root
const DropdownMenuTrigger = Dropdown.Trigger
const DropdownMenuContent = Dropdown.Content

const StyledItem = styled(fixView(Dropdown.Item), {
  // ...styles...
})
const DropdownMenuItem = Dropdown.create((props: ComponentProps<typeof StyledItem>) => {
  return <StyledItem {...props} />
}, 'Item')

const StyledItemTitle = styled(
  fixText(Dropdown.ItemTitle),
  {
    // ...styles...
  },
  { isText: true }
)
const DropdownMenuItemTitle = Dropdown.create((props: ComponentProps<typeof StyledItemTitle>) => {
  return <StyledItemTitle {...props} />
}, 'ItemTitle')

export {
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemTitle,
}
