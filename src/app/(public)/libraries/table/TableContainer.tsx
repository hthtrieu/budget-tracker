import { Payment, columns } from "./columns";
import { DataTable } from "./data-table";

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "am@example.com",
    },
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "bm@example.com",
    },
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "cm@example.com",
    },
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "dm@example.com",
    },
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "em@example.com",
    },
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "rm@example.com",
    },

    // ...
  ];
}

export default async function Container() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
