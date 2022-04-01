import {Box, Text, VStack} from "@chakra-ui/layout";

type CardProps = {
  children: React.ReactNode;
  type: "Cost" | "Income";
};

export function Card({children, type}: CardProps) {
  return (
    <VStack boxShadow={"2xl"} rounded={"md"} w="90%">
      <Box bgColor="GrayText" w="full">
        <Text>{type}</Text>
      </Box>
      {children}
    </VStack>
  );
}
