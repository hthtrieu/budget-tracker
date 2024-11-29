import { ColumnDef } from "@tanstack/react-table";

// import { format } from "date-fns";
// import { TransactionDocument } from "@/models/Transaction";
import { CategoryDocument } from "@/models/Category";

export const columns: ColumnDef<CategoryDocument>[] = [
  {
    accessorKey: "category",
    header: "Tên danh mục",
    cell: ({ row }) => {
      const category = row.original;
      return <div className="w-fit">{category?.name}</div>;
    },
  },
];
