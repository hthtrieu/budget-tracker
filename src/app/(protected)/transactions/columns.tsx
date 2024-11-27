"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, PenIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/common/table/data-table-column-header";
import { cn, formatNumberToVND } from "@/lib/utils";
import CommonPopup from "@/components/common/popup/CommonPopup";
import React, { useState } from "react";
import { TransactionDocument } from "@/models/Transaction";
import { format } from "date-fns";
import TransactionForm from "@/components/transaction/TransactionForm";
import { CategoryDocument } from "@/models/Category";

export const columns: ColumnDef<TransactionDocument>[] = [
  {
    accessorKey: "transactionDate",
    header: "Ngay giao dich",
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
      const category = row.original.category;
      return <div className="w-20">{category.name}</div>;
    },
  },

  {
    accessorKey: "actualAmount",
    header: "Thuc te",
    cell: ({ row }) => {
      const amount = row.getValue("actualAmount") as number;
      return <div>{formatNumberToVND(Number(amount))}</div>;
    },
  },
  {
    accessorKey: "estimatedAmount",
    header: "Du kien",
    cell: ({ row }) => {
      const amount = row.getValue("estimatedAmount") as number;
      return <div>{formatNumberToVND(Number(amount))}</div>;
    },
  },
  {
    accessorKey: "chenhLech", // Giữ nguyên tên
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Chênh lệch" />
    ),
    accessorFn: (row) => Number(row.actualAmount) - Number(row.estimatedAmount), // Tính giá trị chênh lệch
    cell: ({ row }) => {
      const chenhLech = row.getValue("chenhLech") as number;
      return (
        <div className={cn("font-bold", chenhLech < 0 ? "text-red-500" : "")}>
          {formatNumberToVND(chenhLech)}
        </div>
      );
    },
    enableSorting: true, // Kích hoạt tính năng sắp xếp
    sortingFn: "basic", // Hoặc bạn có thể bỏ qua, mặc định là "basic"
  },

  {
    accessorKey: "transactionType",
    header: "Loai",
    cell: ({ row }) => {
      const type = row.getValue("transactionType") as string;
      return (
        <span
          className={cn(
            "capitalize font-bold",
            type == "Thu" ? "text-green-500" : "text-red-500"
          )}
        >
          {type}
        </span>
      );
    },
  },

  {
    accessorKey: "",
    id: "actions",
    cell: ({
      row,
      deleteTransaction,
      categoriesList,
      onEditTransaction,
    }: {
      row: any;
      deleteTransaction: (id: string) => void;
      categoriesList: any[];
      onEditTransaction: (data: any) => void;
    }) => {
      const transaction = row.original;
      const [isOpenExpensePopup, setIsOpenExpensePopup] = useState(false);
      const [isOpenEditPopup, setIsOpenEditPopup] = useState(false);
      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel></DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setIsOpenEditPopup(true)}>
                <PenIcon />
                Chinh sua
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsOpenExpensePopup(true)}>
                <Trash2Icon className="text-red-500" />
                Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <CommonPopup
            open={isOpenEditPopup}
            setOpen={setIsOpenEditPopup}
            isShowTrigger={false}
            title="Xác nhận xóa"
          >
            <TransactionForm
              defaultValues={{
                actualAmount: transaction.actualAmount,
                estimatedAmount: transaction.estimatedAmount,
                transactionDate: transaction.transactionDate,
                transactionType: transaction.transactionType,
                category: transaction.category._id,
              }}
              categoryOptions={
                categoriesList
                  ? categoriesList.map((cat: CategoryDocument) => ({
                      key: cat._id,
                      label: cat.name,
                    }))
                  : []
              }
              onSubmitTransactionForm={(data: any) => {
                onEditTransaction({ ...data, id: transaction._id });
              }}
            />
          </CommonPopup>
          <CommonPopup
            open={isOpenExpensePopup}
            setOpen={setIsOpenExpensePopup}
            isShowTrigger={false}
            title="Xác nhận xóa"
          >
            <div className="p-4 text-center">
              <p>
                Bạn có chắc chắn muốn xóa giao dịch này không? {transaction._id}
              </p>
              <div className="flex justify-end mt-4 gap-2">
                <Button
                  variant="ghost"
                  onClick={() => setIsOpenExpensePopup(false)}
                >
                  Hủy
                </Button>
                <Button
                  variant="destructive"
                  onClick={async () => {
                    await deleteTransaction(transaction._id); // Gọi hàm xóa được truyền từ Container
                    setIsOpenExpensePopup(false);
                  }}
                >
                  Xóa
                </Button>
              </div>
            </div>
          </CommonPopup>
        </>
      );
    },
  },
];
