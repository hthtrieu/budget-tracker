"use client";
import React from "react";
import Transaction from "./Transaction";

interface TransactionDateBlockProps {
  title: string;
  transactions: any[]; // Mảng giao dịch truyền vào
}

const TransactionDateBlock: React.FC<TransactionDateBlockProps> = ({
  title,
  transactions,
}) => {
  return (
    <div>
      <p className="text-sm font-medium">{title}</p>
      <div className="flex flex-col gap-2">
        {transactions?.length > 0 ? (
          transactions.map((transaction) => (
            <Transaction key={transaction._id} transaction={transaction} />
          ))
        ) : (
          <p className="text-gray-500 text-sm">Không có giao dịch</p>
        )}
      </div>
    </div>
  );
};

export default TransactionDateBlock;
