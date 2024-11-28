"use client";
import React, { useEffect, useState } from "react";
import { columns as defaultColumns } from "./columns"; // Import các cột mặc định
import { DataTable } from "@/components/common/table/data-table";
import { Card } from "@/components/ui/card";
import { TransactionDocument } from "@/models/Transaction";
import TableSkeleton from "@/components/common/table/table-skeleton";
import CommonPopup from "@/components/common/popup/CommonPopup";
import TransactionForm from "@/components/transaction/TransactionForm";
import { useSession } from "next-auth/react";
import { CategoryDocument } from "@/models/Category";
import { Button } from "@/components/ui/button";
import { ActionsCell } from "./ActionCell";
export default function Container() {
  // const [data, setData] = useState<TransactionDocument[]>([]);
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [categoriesList, setCategoriesList] = useState<CategoryDocument[]>([]);
  const [transactionsList, setTransactionsList] = useState<
    TransactionDocument[]
  >([]);
  const [isOpenPopup, setIsOpenPopup] = useState<boolean>(false);
  // overview hook
  const onCreateNewTransaction = async (data: any) => {
    if (!session?.user?.id) {
      return;
    }

    const userId = session.user.id;
    try {
      const response = await fetch("/api/user/transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          categoryId: data?.category,
          transactionType: data?.transactionType,
          actualAmount: data?.actualAmount,
          estimatedAmount: data?.estimatedAmount,
          transactionDate: data?.transactionDate,
        }),
      });

      if (response.ok) {
        await response.json();
        getUserTransactions();
        setIsOpenPopup(false);
      } else {
        const error = await response.json();
        console.log("error: ", error);
      }
    } catch (error) {
      console.error("Error submitting category:", error);
    }
  };

  const getUserCategoriesList = async () => {
    // setIsloading(true);
    if (!session?.user?.id) {
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
        setCategoriesList(result.data);
      } else {
        const error = await response.json();
        console.error("Error:", error.message);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      // setIsloading(false);
    }
  };
  const getUserTransactions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/user/transaction", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        setTransactionsList(result.data);
      } else {
        const error = await response.json();
        console.log("error: ", error);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (session?.user?.id) {
      getUserTransactions();
      getUserCategoriesList();
    }
    //eslint-disable-next-line
  }, [session]);

  // Hàm xóa transaction
  const deleteTransaction = async (id: string) => {
    try {
      const response = await fetch(`/api/user/transaction?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error deleting transaction:", errorData.message);
        // alert("Không thể xóa giao dịch. Vui lòng thử lại.");
        return;
      }

      getUserTransactions();

      // // Cập nhật lại danh sách giao dịch sau khi xóa
      // setData((prevData) =>
      //   prevData.filter((transaction) => transaction._id !== id)
      // );
    } catch (error) {
      console.error("Error deleting transaction:", error);
      alert("Đã xảy ra lỗi khi xóa giao dịch.");
    }
  };
  const onEditTransaction = async (data: any) => {
    if (!session?.user?.id) {
      return;
    }

    const userId = session.user.id;
    try {
      const response = await fetch("/api/user/transaction", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          transactionId: data?.id,
          categoryId: data?.category,
          transactionType: data?.transactionType,
          actualAmount: data?.actualAmount,
          estimatedAmount: data?.estimatedAmount,
          transactionDate: data?.transactionDate,
        }),
      });

      if (response.ok) {
        await response.json();
        getUserTransactions();
      } else {
        const error = await response.json();
        alert(error);
      }
    } catch (error) {
      console.error("Error submitting category:", error);
    }
  };
  // Truyền hàm vào columns
  // const columns = defaultColumns.map((column) => {
  //   if (column.id === "actions") {
  //     return {
  //       ...column,
  //       cell: ({ row }: { row: { original: TransactionDocument } }) => (
  //         // eslint-disable-next-line
  //         <column.cell
  //           row={row}
  //           deleteTransaction={deleteTransaction}
  //           categoriesList={categoriesList}
  //           onEditTransaction={onEditTransaction}
  //         />
  //       ),
  //     };
  //   }
  //   return column;
  // });

  const columns = [
    ...defaultColumns,
    {
      id: "actions",
      cell: ({ row }: { row: { original: TransactionDocument } }) => (
        <ActionsCell
          row={row.original}
          deleteTransaction={deleteTransaction}
          categoriesList={categoriesList}
          onEditTransaction={onEditTransaction}
        />
      ),
    },
  ];

  if (isLoading) {
    return (
      <div>
        Loading...
        <TableSkeleton headers={columns} />
      </div>
    );
  }

  if (!transactionsList || transactionsList.length === 0) {
    return <Card className="container mx-auto py-10">No data</Card>;
  }

  return (
    <Card className="container mx-auto py-10">
      <div className="flex justify-end mx-2">
        <CommonPopup
          open={isOpenPopup}
          setOpen={setIsOpenPopup}
          title={`Thêm dữ liệu`}
          isShowTrigger={true}
          TriggerComponent={
            <Button
              size={"sm"}
              onClick={() => {
                setIsOpenPopup(true);
              }}
              className="my-2 "
              variant={"default"}
            >
              {"Them du lieu"}
            </Button>
          }
        >
          <TransactionForm
            categoryOptions={
              categoriesList
                ? categoriesList.map((cat: CategoryDocument) => ({
                    key: cat._id,
                    label: cat.name,
                  }))
                : []
            }
            onSubmitTransactionForm={(data: any) => {
              // if (isFunction(onCreateTransaction)) {
              onCreateNewTransaction(data);
              //   setIsOpenPopup(false);
              // }
            }}
          />
        </CommonPopup>
      </div>
      <DataTable columns={columns} data={transactionsList} />
    </Card>
  );
}
