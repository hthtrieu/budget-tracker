"use client";

import React from "react";
import { FormInput } from "@/components/common/form/FormInput";
import { Constants } from "@/lib/constants";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card } from "../ui/card";
import { CircleDollarSignIcon, HandCoins } from "lucide-react";

interface TransactionFormProps {
  defaultValues?: {
    transactionDate?: string;
    transactionType?: "Thu" | "Chi";
    category?: string;
    actualAmount?: string;
    estimatedAmount?: string;
    note?: string;
  };
  onSubmitTransactionForm?: (data: any) => void;
  categoryOptions?: { key: string; label: string }[];
}

const TransactionForm = (props: TransactionFormProps) => {
  // Define schema using Zod
  const formSchema = z.object({
    transactionDate: z
      .date({ required_error: "Không được bỏ trống" })
      .or(z.string().transform((val) => new Date(val))),
    transactionType: z.enum(["Thu", "Chi"]).optional(),
    category: z.string({ required_error: "Không được bỏ trống" }),
    actualAmount: z.string({ required_error: "Không được bỏ trống" }),
    estimatedAmount: z.string({ required_error: "Không được bỏ trống" }),
    note: z.string().optional(),
  });

  // Infer form data type from Zod schema
  type FormData = z.infer<typeof formSchema>;

  // Initialize React Hook Form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transactionDate: props.defaultValues?.transactionDate
        ? new Date(props.defaultValues.transactionDate)
        : new Date(),
      transactionType: props.defaultValues?.transactionType,
      category: props.defaultValues?.category || "",
      actualAmount: props.defaultValues?.actualAmount || "",
      estimatedAmount: props.defaultValues?.estimatedAmount || "",
      note: props.defaultValues?.note,
    },
  });

  // Submit handler
  const submitForm: SubmitHandler<FormData> = (values) => {
    props.onSubmitTransactionForm?.(values);
  };

  return (
    <Card className="p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitForm)}
          className="flex flex-col gap-2"
        >
          <FormInput
            control={form.control}
            fieldName="category"
            type={Constants.INPUT_TYPE.SELECT}
            label="Tên"
            placeholder="Tên loại chi tiêu"
            required={true}
            options={props.categoryOptions || []}
          />
          <FormInput
            control={form.control}
            fieldName="actualAmount"
            type={Constants.INPUT_TYPE.TEXT}
            label="Thực tế"
            placeholder="Số tiền thực tế"
            icon={<HandCoins />}
            alignIcon="right"
            required={true}
          />
          <FormInput
            control={form.control}
            fieldName="estimatedAmount"
            type={Constants.INPUT_TYPE.TEXT}
            label="Dự kiến"
            placeholder="Số tiền dự kiến"
            icon={<CircleDollarSignIcon />}
            alignIcon="right"
            required={true}
          />
          <FormInput
            control={form.control}
            fieldName="transactionType"
            type={Constants.INPUT_TYPE.SELECT}
            label="Loại"
            placeholder="Loại giao dịch"
            required={true}
            options={Constants.TransactionType}
          />

          <FormInput
            control={form.control}
            fieldName="transactionDate"
            type={Constants.INPUT_TYPE.DATE_PICKER}
            label="Ngày"
            placeholder="Ngày giao dịch"
            required={true}
          />
          <FormInput
            control={form.control}
            fieldName="note"
            type={Constants.INPUT_TYPE.TEXTAREA}
            label="Ghi chú"
            placeholder="Thêm Ghi chú"
            required={false}
          />
          <Button type="submit" variant="default" className="w-full">
            Lưu
          </Button>
        </form>
      </Form>
    </Card>
  );
};

export default TransactionForm;
