"use client";
import React, { useEffect, useState } from "react";
import OverviewBlock from "@/components/home/overview/OverviewBlock";
import TransactionsList from "@/components/home/transaction-data/TransactionsList";
import { useSession } from "next-auth/react";
import { startOfDay, subDays, isSameDay, isThisWeek } from "date-fns";
import { TransactionDocument } from "@/models/Transaction";
import { CategoryDocument } from "@/models/Category";
import { MonthYearSelect } from "@/components/reports/MonthYearSelect";

const HomeContainer = () => {
  const { data: session } = useSession();
  const [categoriesList, setCategoriesList] = useState<CategoryDocument[]>([]);
  const [transactions, setTransactions] = useState<TransactionDocument[]>([]);

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
          note: data?.note,
        }),
      });

      if (response.ok) {
        await response.json();
        getUserTransactions({ month, year });
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
  const [month, setMonth] = useState<number | null>(null);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const getUserTransactions = async ({
    month,
    year,
  }: {
    month: number | null;
    year: number;
  }) => {
    setIsLoading(true);
    // const date = new Date();
    // const year = date.getFullYear();
    // const month = date.getMonth() + 1;
    try {
      let url = `/api/user/transaction?year=${year}`;
      if (month !== null && month > 0) {
        url += `&month=${month}`;
      }
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        groupTransactionsByDate(result.data);
        setTransactions(result.data);
      } else {
        //eslint disable next-line
        const error = await response.json();
        console.log("error: ", error);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const onMonthYearSelect = (
    selectedMonth: number | null,
    selectedYear: number
  ) => {
    setMonth(selectedMonth);
    setYear(selectedYear);
  };

  // Phân loại giao dịch
  const groupTransactionsByDate = (transactions: TransactionDocument[]) => {
    const today = startOfDay(new Date());
    const yesterday = subDays(today, 1);

    const grouped: {
      today: any[];
      yesterday: any[];
      thisWeek: any[];
      // older: any[];
    } = {
      today: [],
      yesterday: [],
      thisWeek: [],
      // older: [],
    };

    transactions.forEach((transaction: TransactionDocument) => {
      const transactionDate = new Date(transaction.transactionDate);

      if (isSameDay(transactionDate, today)) {
        grouped.today.push(transaction);
      } else if (isSameDay(transactionDate, yesterday)) {
        grouped.yesterday.push(transaction);
      } else if (isThisWeek(transactionDate)) {
        grouped.thisWeek.push(transaction);
      }
      // else {
      //   grouped.older.push(transaction);
      // }
    });

    setGroupedTransactions(grouped);
  };

  useEffect(() => {
    if (session?.user?.id) {
      getUserTransactions({ month, year });
      getUserCategoriesList();
    }
    //eslint-disable-next-line
  }, [session, month, year]);
  // useEffect(() => {
  //   getUserTransactions({ month, year });
  // }, [month, year]);
  return (
    <div className="flex flex-col gap-4">
      <MonthYearSelect
        onSelect={(selectedMonth: number | null, selectedYear: number) =>
          onMonthYearSelect(selectedMonth, selectedYear)
        }
      />
      <OverviewBlock
        categoriesList={categoriesList}
        onCreateTransaction={onCreateNewTransaction}
        transactionsList={transactions}
      />
      <TransactionsList
        groupedTransactions={groupedTransactions}
        isLoading={isLoading}
      />
    </div>
  );
};

export default HomeContainer;
