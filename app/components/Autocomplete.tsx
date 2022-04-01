import {Box} from "@chakra-ui/layout";
import {Input, List, ListItem} from "@chakra-ui/react";
import {format} from "date-fns";
import {useCombobox} from "downshift";
import * as React from "react";

const months = Array.from(new Array(12), (_, i) =>
  format(new Date(2022, i, 1), "LLLL")
);

const itemsYear = ["2020", "2021", "2022", "2023", "2024", "2025"];

type ItemsTypes = {
  MONTH: string[];
  YEAR: string[];
};

const itemsObj: ItemsTypes = {
  MONTH: months,
  YEAR: itemsYear,
};

export function Autocomplete({name}: {name: keyof ItemsTypes}) {
  const items = itemsObj[name];
  const [inputItems, setInputItems] = React.useState(items);
  const {
    getInputProps,
    isOpen,
    getComboboxProps,
    getMenuProps,
    getItemProps,
    highlightedIndex,
  } = useCombobox({
    items,
    onInputValueChange: ({inputValue}) => {
      if (!inputValue) {
        setInputItems(items);
        return;
      }
      setInputItems(
        items.filter((item) => item.toLowerCase().includes(inputValue))
      );
    },
  });

  return (
    <Box position="relative">
      <Box {...getComboboxProps()}>
        <Input {...getInputProps()} name={name} />
        <List {...getMenuProps()}>
          {isOpen &&
            inputItems?.map((item, index: number) => {
              return (
                <ListItem
                  {...getItemProps({item, index: index})}
                  border={highlightedIndex === index ? "2px solid" : "none"}
                  key={item}
                >
                  {item}
                </ListItem>
              );
            })}
        </List>
      </Box>
    </Box>
  );
}
