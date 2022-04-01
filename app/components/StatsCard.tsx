import {
  Box,
  Stat,
  StatLabel,
  StatNumber,
  HStack,
  StatHelpText,
} from "@chakra-ui/react";
import {Card} from "~/components/Card";

export interface StatsCardProps {
  title: string;
  stat: string;
  type: "Cost" | "Income";
  icon: React.ReactNode;
}

export function StatsCard(props: StatsCardProps) {
  const {title, stat, icon, type} = props;
  return (
    <Card type={type}>
      <HStack>
        <Stat>
          <StatLabel>{title}</StatLabel>
          <StatNumber>{stat}</StatNumber>
          <StatHelpText>Feb 12 - Feb 28</StatHelpText>
        </Stat>
        <Box my={"auto"} color={"gray.800"} alignContent={"center"}>
          {icon}
        </Box>
      </HStack>
    </Card>
  );
}
