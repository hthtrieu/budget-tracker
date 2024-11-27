import React from "react";
import { Constants } from "@/lib/constants";
import { FormInput } from "@/components/common/form/FormInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Card } from "../ui/card";

// Define schema using Zod
const formSchema = z.object({
  month: z.number().min(0).max(12), // Month: 0 (All) to 12
  year: z.number().min(1900).max(2100), // Year within range
});

// Infer form data type from Zod schema
type FormData = z.infer<typeof formSchema>;

// Generate month options dynamically
const generateMonthOptions = () => [
  { key: 0, label: "All" }, // Default "All" option
  ...Array.from({ length: 12 }, (_, index) => ({
    key: index + 1,
    label: `${index + 1}`,
  })),
];

// Generate year options dynamically
const generateYearOptions = (startYear: number, count: number) =>
  Array.from({ length: count }, (_, index) => {
    const year = startYear + index;
    return { key: year, label: year.toString() };
  });

export const MonthYearSelect = ({
  onSelect,
}: {
  onSelect: (month: number | null, year: number) => void;
}) => {
  // Initialize React Hook Form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      month: new Date().getMonth() + 1, // Default to "All"
      year: new Date().getFullYear(), // Default to current year
    },
  });

  // Watch for form value changes
  const { watch } = form;
  const month = watch("month");
  const year = watch("year");

  // Call onSelect whenever month or year changes
  React.useEffect(() => {
    onSelect(month === 0 ? null : month, year);
  }, [month, year, onSelect]);

  // Dynamic options
  const MONTH_OPTIONS = generateMonthOptions();
  const YEAR_OPTIONS = generateYearOptions(2024, 5); // Generate options for 5 years starting from 2024

  return (
    <Card className="w-full my-4 p-2">
      <Form {...form}>
        <form className="flex items-center gap-2">
          {/* Month Input */}
          <FormInput
            control={form.control}
            type={Constants.INPUT_TYPE.SELECT}
            fieldName="month"
            options={MONTH_OPTIONS}
            className="flex items-center gap-2 w-1/2"
            classNameInput="border-none !mt-0 w-1/2"
            label="Tháng"
            classNameLabel="w-1/2 font-bold text-green-500 bg-green-200 p-2 rounded-lg"
          />

          {/* Year Input */}
          <FormInput
            control={form.control}
            type={Constants.INPUT_TYPE.SELECT}
            fieldName="year"
            options={YEAR_OPTIONS}
            className="flex items-center gap-2 w-1/2"
            classNameInput="border-none !mt-0 w-1/2"
            label="Năm"
            classNameLabel="w-1/2 font-bold text-green-500 bg-green-200 p-2 rounded-lg"
          />
        </form>
      </Form>
    </Card>
  );
};
