import { Box } from "@chakra-ui/layout"
import { Input, List, ListItem } from "@chakra-ui/react"
import { format } from "date-fns"
import { useCombobox } from "downshift"
import * as React from "react"
import { itemsYear, months } from "~/utils/form"

export type ItemsTypes = {
  MONTH: string[]
  YEAR: string[]
}

const itemsObj: ItemsTypes = {
  MONTH: months,
  YEAR: itemsYear,
}

export function Autocomplete({ name }: { name: keyof ItemsTypes }) {
  const items = itemsObj[name]
  const [inputItems, setInputItems] = React.useState(items)
  const {
    getInputProps,
    isOpen,
    getComboboxProps,
    getMenuProps,
    getItemProps,
    highlightedIndex,
    setInputValue,
    selectedItem,
  } = useCombobox({
    id: "downshift-multiple",
    items: inputItems,
    onInputValueChange: ({ inputValue }) => {
      if (!inputValue) {
        console.log({ inputValue })
        return
      }
      const filteredItems = items.filter((item) =>
        item.toLowerCase().includes(inputValue.toLowerCase())
      )
      if (filteredItems.length == 1) {
        setInputValue(filteredItems[0])
      }
      setInputItems(filteredItems)
    },
  })

  return (
    <Box position="relative">
      <Box {...getComboboxProps()}>
        <Input {...getInputProps()} name={name} />
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
