"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircleIcon } from "lucide-react";
import CommonPopup from "@/components/common/popup/CommonPopup";
import CategoryForm from "@/components/category/CategoryForm";
import { useSession } from "next-auth/react";
import { CategoryDocument } from "@/models/Category";

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

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Danh sách mục chi tiêu</CardTitle>
        </CardHeader>
        <CardContent>
          <CommonPopup
            open={isOpenExpensePopup}
            setOpen={setIsOpenExpensePopup}
            isShowTrigger={true}
            TriggerComponent={
              <Button variant={"secondary"}>
                <PlusCircleIcon />
                {"Thêm mục"}
              </Button>
            }
            title="Thêm dữ liệu"
          >
            <CategoryForm onSubmitForm={submitCategoryForm} />
          </CommonPopup>
          {/* Hiển thị danh sách categories */}
          <div>
            {categoriesList.length > 0 ? (
              <ul>
                {categoriesList.map((category) => (
                  <li key={category._id}>{category.name}</li>
                ))}
              </ul>
            ) : (
              <p>Không có danh mục nào.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Container;
