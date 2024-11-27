"use client";
import React, { useEffect, useState } from "react";
import OverviewBlock from "@/components/home/overview/OverviewBlock";
import TransactionsList from "@/components/home/transaction-data/TransactionsList";
import { useSession } from "next-auth/react";
import { startOfDay, subDays, isSameDay, isThisWeek } from "date-fns";
import { TransactionDocument } from "@/models/Transaction";
import { CategoryDocument } from "@/models/Category";

const HomeContainer = () => {
  const { data: session } = useSession();
  const [categoriesList, setCategoriesList] = useState<CategoryDocument[]>([]);

  // overview hook
  const onCreateNewTransaction = async (data: any) => {
    if (!session?.user?.id) {
      return;
    }

    const userId = session.user.id; // Lấy userId từ session
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
      } else {
        const error = await response.json();
        alert(error);
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
        setCategoriesList(result.data); // Lưu danh sách categories vào state
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
  // transaction list hook
  const [groupedTransactions, setGroupedTransactions] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
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
        groupTransactionsByDate(result.data);
      } else {
        const error = await response.json();
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Phân loại giao dịch
  const groupTransactionsByDate = (transactions: TransactionDocument[]) => {
    const today = startOfDay(new Date());
    const yesterday = subDays(today, 1);

    const grouped = {
      today: [],
      yesterday: [],
      thisWeek: [],
      older: [],
    };

    transactions.forEach((transaction: TransactionDocument) => {
      const transactionDate = new Date(transaction.transactionDate);

      if (isSameDay(transactionDate, today)) {
        grouped.today.push(transaction);
      } else if (isSameDay(transactionDate, yesterday)) {
        grouped.yesterday.push(transaction);
      } else if (isThisWeek(transactionDate)) {
        grouped.thisWeek.push(transaction);
      } else {
        grouped.older.push(transaction);
      }
    });

    setGroupedTransactions(grouped);
  };

  useEffect(() => {
    if (session?.user?.id) {
      getUserTransactions();
      getUserCategoriesList();
    }
  }, [session]);
  return (
    <div className="flex flex-col gap-4">
      <OverviewBlock
        categoriesList={categoriesList}
        onCreateTransaction={onCreateNewTransaction}
      />
      <TransactionsList
        groupedTransactions={groupedTransactions}
        isLoading={isLoading}
      />
    </div>
  );
};

export default HomeContainer;
