"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { vi } from "date-fns/locale";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
interface DatePickerProps {
  field: any;
}
export function DatePicker(props: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div>
          <Input
            value={
              props.field.value
                ? format(props.field.value, "PPP", { locale: vi })
                : "Chọn ngày"
            }
            icon={<CalendarIcon />}
            readOnly={true}
            className="cursor-pointer"
            alignIcon="right"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={props.field.value}
          onSelect={props.field.onChange}
          // disabled={(date) =>
          //   date > new Date() || date < new Date("1900-01-01")
          // }
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
