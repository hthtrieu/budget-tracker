"use client";

import React from "react";
import { FormInput } from "@/components/common/form/FormInput";
import { Constants } from "@/lib/constants";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
const CategoryForm = ({
  onSubmitForm,
  defaultValues,
}: {
  onSubmitForm: any;
  defaultValues?: {
    name: string;
  };
}) => {
  // Define schema using Zod
  const formSchema = z.object({
    name: z.string().min(2, { message: "Required" }),
  });

  // Infer form data type from Zod schema
  type FormData = z.infer<typeof formSchema>;

  // Initialize React Hook Form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultValues?.name,
    },
  });

  // Submit handler
  const submitForm: SubmitHandler<FormData> = (values) => {
    onSubmitForm(values);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitForm)}>
        <div className="w-full space-y-2">
          <FormInput
            control={form.control}
            fieldName="name"
            type={Constants.INPUT_TYPE.TEXT}
            label="Tên mục"
            placeholder="Nhập Tên mục"
            required={true}
          />
          <Button type="submit" variant="default" className="w-full">
            Tao
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CategoryForm;
