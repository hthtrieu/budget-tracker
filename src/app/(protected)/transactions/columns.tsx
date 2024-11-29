import { ColumnDef } from "@tanstack/react-table";
// import { MoreHorizontal, PenIcon, Trash2Icon } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/common/table/data-table-column-header";
import { cn, formatNumberToVND } from "@/lib/utils";
import { format } from "date-fns";
import { TransactionDocument } from "@/models/Transaction";

export const columns: ColumnDef<TransactionDocument>[] = [
  {
    accessorKey: "transactionDate",
    header: "Ngày giao dịch",
    cell: ({ row }) => (
      <div className="w-[100px]">
        {format(new Date(row.getValue("transactionDate")), "dd/MM/yyyy")}
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Tên danh mục",
    cell: ({ row }) => {
      const category = row.original?.category;
      return <div className="w-20">{category?.name}</div>;
    },
  },
  {
    accessorKey: "actualAmount",
    header: "Thực tế",
    cell: ({ row }) => {
      const amount = row.getValue("actualAmount") as number;
      return <div>{formatNumberToVND(Number(amount))}</div>;
    },
  },
  {
    accessorKey: "estimatedAmount",
    header: "Dự kiến",
    cell: ({ row }) => {
      const amount = row.getValue("estimatedAmount") as number;
      return <div>{formatNumberToVND(Number(amount))}</div>;
    },
  },
  {
    accessorKey: "chenhLech",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Chênh lệch" />
    ),
    accessorFn: (row) => Number(row.actualAmount) - Number(row.estimatedAmount),
    cell: ({ row }) => {
      const chenhLech = row.getValue("chenhLech") as number;
      return (
        <div className={cn("font-bold", chenhLech < 0 ? "text-red-500" : "")}>
          {formatNumberToVND(chenhLech)}
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "transactionType",
    header: "Loại",
    cell: ({ row }) => {
      const type = row.getValue("transactionType") as string;
      return (
        <span
          className={cn(
            "capitalize font-bold",
            type === "Thu" ? "text-green-500" : "text-red-500"
          )}
        >
          {type}
        </span>
      );
    },
  },
];
