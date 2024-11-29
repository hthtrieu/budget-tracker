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

import { CategoryDocument } from "@/models/Category";
import CategoryForm from "@/components/category/CategoryForm";

interface ActionsCellProps {
  row: CategoryDocument;
  onDelete: (id: string) => void;
  onEdit: (data: any) => void;
}

export const ActionsCell = ({ row, onDelete, onEdit }: ActionsCellProps) => {
  const [isOpenDeletePopup, setIsOpenDeletePopup] = useState(false);
  //eslint-disable-next-line
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
          <DropdownMenuItem onClick={() => setIsOpenEditPopup(true)}>
            <PenIcon /> Chỉnh sửa
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsOpenDeletePopup(true)}>
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
        <CategoryForm
          onSubmitForm={(data: any) => {
            onEdit({ ...data, id: row?._id });
          }}
          defaultValues={{ name: row.name }}
        />
      </CommonPopup>
      {/* Popup cho xóa */}
      <CommonPopup
        open={isOpenDeletePopup}
        setOpen={setIsOpenDeletePopup}
        title="Xác nhận xóa"
      >
        <div className="p-4 text-center">
          <p>Bạn có chắc chắn muốn xóa danh muc này không?</p>
          <Button variant="ghost" onClick={() => setIsOpenDeletePopup(false)}>
            Hủy
          </Button>
          <Button variant="destructive" onClick={() => onDelete(row._id)}>
            Xóa
          </Button>
        </div>
      </CommonPopup>
    </>
  );
};
