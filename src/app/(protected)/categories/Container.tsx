"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircleIcon } from "lucide-react";
import CommonPopup from "@/components/common/popup/CommonPopup";
import CategoryForm from "@/components/category/CategoryForm";
import { useSession } from "next-auth/react";
import { CategoryDocument } from "@/models/Category";
import { DataTable } from "@/components/common/table/data-table";
import { columns as defaultColumns } from "./columns"; // Import các cột mặc định
import { ActionsCell } from "./ActionCell";

const Container = () => {
  const [isOpenExpensePopup, setIsOpenExpensePopup] = useState(false);
  const { data: session } = useSession(); // Lấy session từ next-auth
  const [categoriesList, setCategoriesList] = useState<CategoryDocument[]>([]);

  // Hàm lấy danh sách categories của người dùng
  const getUserCategoriesList = async () => {
    if (!session?.user?.id) {
      console.error("User not logged in");
      return;
    }

    try {
      const response = await fetch("/api/user/category", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        setCategoriesList(result.data); // Lưu danh sách categories vào state
      } else {
        const error = await response.json();
        console.error("Error:", error.message);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      getUserCategoriesList();
    }
    //eslint-disable-next-line
  }, [session]);

  const submitCategoryForm = async (data: any) => {
    if (!session?.user?.id) {
      console.error("User not logged in");
      return;
    }

    const userId = session.user.id; // Lấy userId từ session
    const categoryName = data.name; // Lấy category name từ form

    try {
      const response = await fetch("/api/user/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, categoryName }), // Gửi dữ liệu dưới dạng JSON
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Category created:", result);
        // Xử lý dữ liệu sau khi tạo category thành công (ví dụ: cập nhật UI, đóng popup)
        setIsOpenExpensePopup(false); // Đóng popup
        // Lấy lại danh sách categories sau khi tạo mới
        getUserCategoriesList();
      } else {
        const error = await response.json();
        console.error("Error:", error.message);
      }
    } catch (error) {
      console.error("Error submitting category:", error);
    }
  };
  const onEditCategory = async (data: any) => {
    if (!session?.user?.id) {
      return;
    }
    try {
      const response = await fetch("/api/user/category", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoryId: data?.id,
          name: data?.name,
        }),
      });

      if (response.ok) {
        await response.json();
        getUserCategoriesList();
      } else {
        const error = await response.json();
        alert(error);
      }
    } catch (error) {
      console.error("Error submitting category:", error);
    }
  };
  const onDeleteCategory = async (id: string) => {
    try {
      const response = await fetch(`/api/user/category?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error deleting category:", errorData.message);
        return;
      }

      getUserCategoriesList();
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Đã xảy ra lỗi khi xóa danh muc.");
    }
  };
  const columns = [
    ...defaultColumns,
    {
      id: "actions",
      cell: ({ row }: { row: { original: CategoryDocument } }) => (
        <ActionsCell
          row={row.original}
          onDelete={onDeleteCategory}
          onEdit={onEditCategory}
        />
      ),
    },
  ];

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Danh sách mục chi tiêu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="w-full flex justify-end">
            <CommonPopup
              open={isOpenExpensePopup}
              setOpen={setIsOpenExpensePopup}
              isShowTrigger={true}
              TriggerComponent={
                <Button variant={"default"}>
                  <PlusCircleIcon />
                  {"Thêm mục"}
                </Button>
              }
              title="Thêm dữ liệu"
            >
              <CategoryForm onSubmitForm={submitCategoryForm} />
            </CommonPopup>
          </div>
          <DataTable columns={columns} data={categoriesList} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Container;
