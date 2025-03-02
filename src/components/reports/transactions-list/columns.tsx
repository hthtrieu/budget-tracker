"use client";

import { ColumnDef } from "@tanstack/react-table";
// import { DataTableColumnHeader } from "@/components/common/table/data-table-column-header";
import {
  // cn,
  formatNumberToVND,
} from "@/lib/utils";
import React from "react";
// Loại dữ liệu mới dựa trên dữ liệu mẫu
export type TransactionReport = {
  actualAmount: number;
  estimatedAmount: number;
  transactionType: boolean;
  category: { name: string };
};

// Định nghĩa các cột cho bảng
export const columns: ColumnDef<TransactionReport>[] = [
  // {
  //   accessorKey: "id.$oid",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Transaction ID" />
  //   ),
  //   cell: ({ row }) => <span>{row.getValue("id.$oid")}</span>,
  // },
  {
    accessorKey: "category",
    header: "Tên danh mục",
    cell: ({ row }) => {
      const category = row.original.category;
      return <div className="w-[100px]">{category.name}</div>;
    },
  },

  {
    accessorKey: "actualAmount",
    header: "Thuc te",
    cell: ({ row }) => {
      const amount = row.getValue("actualAmount") as number;
      return <div className="font-medium">{formatNumberToVND(amount)}</div>;
    },
  },
  // {
  //   accessorKey: "estimatedAmount",
  //   header: "Du kien",
  //   cell: ({ row }) => {
  //     const amount = row.getValue("estimatedAmount") as number;
  //     return <div className="">{formatNumberToVND(amount)}</div>;
  //   },
  // },
  // {
  //   accessorKey: "chenhLech",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Chênh lệch" />
  //   ),
  //   accessorFn: (row) => Number(row.actualAmount) - Number(row.estimatedAmount), // Tính giá trị chênh lệch
  //   cell: ({ row }) => {
  //     const chenhLech = row.getValue("chenhLech") as number;
  //     return (
  //       <div className={cn("font-bold", chenhLech < 0 ? "text-red-500" : "")}>
  //         {formatNumberToVND(chenhLech)}
  //       </div>
  //     );
  //   },
  //   enableSorting: true,
  //   sortingFn: "basic",
  // },

  // {
  //   accessorKey: "",
  //   id: "actions",
  //   cell: ({ row }) => {
  //     const transaction = row.original;
  //     // eslint-disable-next-line react-hooks/rules-of-hooks
  //     const [isOpenExpensePopup, setIsOpenExpensePopup] = useState(false);

  //     return (
  //       <>
  //         <DropdownMenu>
  //           <DropdownMenuTrigger asChild>
  //             <Button variant="ghost" className="h-8 w-8 p-0">
  //               <span className="sr-only">Open menu</span>
  //               <MoreHorizontal className="h-4 w-4" />
  //             </Button>
  //           </DropdownMenuTrigger>
  //           <DropdownMenuContent align="end">
  //             <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //             <DropdownMenuItem>Chinh sua</DropdownMenuItem>
  //             <DropdownMenuSeparator />
  //             <DropdownMenuItem onClick={() => setIsOpenExpensePopup(true)}>
  //               <Trash2Icon className="text-red-500" />
  //               Xóa
  //             </DropdownMenuItem>
  //           </DropdownMenuContent>
  //         </DropdownMenu>

  //         {/* CommonPopup outside of the menu */}
  //         <CommonPopup
  //           open={isOpenExpensePopup}
  //           setOpen={setIsOpenExpensePopup}
  //           isShowTrigger={false} // No trigger inside the popup
  //           title="Xác nhận xóa"
  //         >
  //           <div className="p-4 text-center">
  //             <p>
  //               Bạn có chắc chắn muốn xóa giao dịch này không?{" "}
  //               {transaction.id.$oid}
  //             </p>
  //             <div className="flex justify-end mt-4 gap-2">
  //               <Button
  //                 variant="ghost"
  //                 onClick={() => setIsOpenExpensePopup(false)}
  //               >
  //                 Hủy
  //               </Button>
  //               <Button
  //                 variant="destructive"
  //                 onClick={() => {
  //                   // Add delete logic here
  //                   setIsOpenExpensePopup(false);
  //                 }}
  //               >
  //                 Xóa
  //               </Button>
  //             </div>
  //           </div>
  //         </CommonPopup>
  //       </>
  //     );
  //   },
  // },
];
