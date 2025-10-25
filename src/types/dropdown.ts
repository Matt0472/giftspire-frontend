export interface DropdownItem {
  label: string
  value?: string | number
  icon?: string
  disabled?: boolean
  divider?: boolean
  children?: DropdownItem[]
  onClick?: () => void
}

export interface DropdownPosition {
  top?: string
  bottom?: string
  left?: string
  right?: string
}
