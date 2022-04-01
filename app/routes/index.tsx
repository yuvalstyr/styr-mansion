import {LoaderFunction, redirect} from "remix";

export const loader: LoaderFunction = async () => {
  return redirect("/transactions");
};

export default function StatisticRoute() {
  return <></>;
}
