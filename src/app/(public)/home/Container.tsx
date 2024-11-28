"use client";
import React, { useEffect, useState } from "react";
// import OverviewBlock from "@/components/home/overview/OverviewBlock";
import TransactionsList from "@/components/home/transaction-data/TransactionsList";
import { useSession } from "next-auth/react";
import { startOfDay, subDays, isSameDay, isThisWeek } from "date-fns";
import { TransactionDocument } from "@/models/Transaction";

const HomeContainer = () => {
  const { data: session } = useSession();
  // transaction list hook
  // const [transactionsList, setTransactionsList] = useState<any>([]);
  const [groupedTransactions, setGroupedTransactions] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // Lấy danh sách giao dịch từ API
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
        // setTransactionsList(result.data);
        console.log("fetched data: ", result.data);
        groupTransactionsByDate(result.data);
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

  // Phân loại giao dịch
  const groupTransactionsByDate = (transactions: TransactionDocument[]) => {
    const today = startOfDay(new Date());
    const yesterday = subDays(today, 1);

    const grouped: {
      today: any[];
      yesterday: any[];
      thisWeek: any[];
      older: any[];
    } = {
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
    console.log("use effect is calling");
    if (session?.user?.id) {
      getUserTransactions();
    }
    //eslint-disable-next-line
  }, [session]);
  return (
    <div className="flex flex-col gap-4">
      {/* <OverviewBlock /> */}
      <TransactionsList
        groupedTransactions={groupedTransactions}
        isLoading={isLoading}
      />
    </div>
  );
};

export default HomeContainer;
