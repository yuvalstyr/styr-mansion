import { Box, Input, List, ListItem } from "@chakra-ui/react"
import { useCombobox } from "downshift"
import * as React from "react"
import { getTimePeriodList, itemsYear } from "~/utils/form"

export type ItemsTypes = {
  month: string[]
  year: string[]
}

const itemsObj: ItemsTypes = {
  month: getTimePeriodList(),
  year: itemsYear,
}

type IPropsAutocomplete = {
  name: keyof ItemsTypes
  value?: string
}

export function Autocomplete({ name, value }: IPropsAutocomplete) {
  const items = itemsObj[name]
  const [inputItems, setInputItems] = React.useState(items)
  React.useEffect(() => {
    value ? setInputValue(value) : undefined
  }, [])
  const {
    getInputProps,
    isOpen,
    getComboboxProps,
    getMenuProps,
    getItemProps,
    highlightedIndex,
    setInputValue,
    openMenu,
    closeMenu,
    selectItem,
  } = useCombobox({
    id: "downshift-multiple",
    items: inputItems,
    onInputValueChange: ({ inputValue, selectedItem }) => {
      if (!inputValue) {
        return
      }
      const filteredItems = items.filter((item) =>
        item.toLowerCase().startsWith(inputValue.toLowerCase())
      )
      if (filteredItems.length === 1) {
        selectItem(filteredItems[0])
        closeMenu()
      }
      if (filteredItems.length === 0 && selectedItem) {
        setInputValue(selectedItem)
      }
      setInputItems(filteredItems)
    },
  })

  return (
    <Box position="relative">
      <Box {...getComboboxProps()}>
        <Input {...getInputProps({ onFocus: openMenu })} name={name} />
        <List {...getMenuProps()} position="absolute">
          {isOpen &&
            inputItems?.map((item, index: number) => {
              return (
                <ListItem
                  {...getItemProps({ item, index: index })}
                  border={highlightedIndex === index ? "2px solid" : "none"}
                  key={`${item}${index}`}
                >
                  {item}
                </ListItem>
              )
            })}
        </List>
      </Box>
    </Box>
  )
}
