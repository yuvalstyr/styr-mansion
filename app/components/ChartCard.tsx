import {HStack, Box} from "@chakra-ui/react";
import {Card} from "~/components/Card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";

export interface ChartCardProps {
  title: string;
}

const data = [
  {name: "Page B", uv: 200, pv: 2400, amt: 2400},
  {name: "Page A", uv: 400, pv: 2400, amt: 2400},
];

export function ChartCard(props: ChartCardProps) {
  const {title} = props;
  return (
    <Card type={"Cost"}>
      <ResponsiveContainer
        width="100%"
        height="100%"
        minHeight="250px"
        aspect={4 / 3}
      >
        <LineChart
          data={data}
          margin={{top: 20, right: 50, left: 50, bottom: 0}}
        >
          <Line type="basis" dataKey="uv" stroke="#8884d8" />
          <XAxis dataKey="name" />
          <Legend />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
