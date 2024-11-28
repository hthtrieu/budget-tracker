import { MoreHorizontal, PenIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CommonPopup from "@/components/common/popup/CommonPopup";
import { useState } from "react";
import { TransactionDocument } from "@/models/Transaction";
import TransactionForm from "@/components/transaction/TransactionForm";
import { CategoryDocument } from "@/models/Category";

interface ActionsCellProps {
  row: TransactionDocument;
  deleteTransaction: (id: string) => void;
  categoriesList: any[];
  onEditTransaction: (data: any) => void;
}

export const ActionsCell = ({
  row,
  deleteTransaction,
  categoriesList,
  onEditTransaction,
}: ActionsCellProps) => {
  const [isOpenExpensePopup, setIsOpenExpensePopup] = useState(false);
  //eslint-disable-next-line
  const [isOpenEditPopup, setIsOpenEditPopup] = useState(false);
  const transaction = row;

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
          <DropdownMenuItem onClick={() => setIsOpenEditPopup(true)}>
            <PenIcon /> Chỉnh sửa
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsOpenExpensePopup(true)}>
            <Trash2Icon className="text-red-500" /> Xóa
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
            transactionDate: transaction.transactionDate.toString(),
            transactionType: transaction.transactionType,
            category: transaction.category._id.toString(),
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
      {/* Popup cho xóa */}
      <CommonPopup
        open={isOpenExpensePopup}
        setOpen={setIsOpenExpensePopup}
        title="Xác nhận xóa"
      >
        <div className="p-4 text-center">
          <p>Bạn có chắc chắn muốn xóa giao dịch này không?</p>
          <Button variant="ghost" onClick={() => setIsOpenExpensePopup(false)}>
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={() => deleteTransaction(row._id)}
          >
            Xóa
          </Button>
        </div>
      </CommonPopup>
    </>
  );
};
