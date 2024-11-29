"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/common/form/FormInput";
import { Constants } from "@/lib/constants";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
// Helper function to convert CSV to JSON
// const convertCSVToJSON = (csv: string) => {
//   const rows = csv.split("\n").map((row) => row.split(","));
//   const headers = rows[0]; // First row is headers
//   const data = rows.slice(1).map((row: string[]) => {
//     const obj: any = {};
//     row.forEach((col, index) => {
//       obj[headers[index]] = col;
//     });
//     return obj;
//   });
//   return data;
// };

const convertCSVToJSON = (csv: string) => {
  const rows = csv.split("\n");
  const headers = rows[0].split(","); // Dòng đầu tiên là headers
  const data = rows.slice(1).map((row) => {
    const cols: any[] = [];
    let temp = "";
    let insideQuotes = false;

    for (const char of row) {
      if (char === '"' && (temp === "" || temp[temp.length - 1] !== "\\")) {
        insideQuotes = !insideQuotes; // Toggle trạng thái bên trong dấu ngoặc kép
      } else if (char === "," && !insideQuotes) {
        cols.push(temp.trim()); // Thêm cột nếu không nằm trong dấu ngoặc kép
        temp = "";
      } else {
        temp += char; // Ghi thêm ký tự vào cột hiện tại
      }
    }
    cols.push(temp.trim()); // Thêm cột cuối cùng

    // Map headers với giá trị của từng cột
    const obj: any = {};
    headers.forEach((header, index) => {
      obj[header] = cols[index];
    });

    return obj;
  });
  return data;
};

export const UploadFile = ({
  onSubmitFile,
}: {
  onSubmitFile: (data: any) => void;
}) => {
  const [fileContent, setFileContent] = useState<string | null>(null); // Lưu nội dung file CSV
  const [fileName, setFileName] = useState<string | null>(null); // Lưu tên file

  // Define schema using Zod
  const formSchema = z.object({
    file: z
      .any()
      .refine((file) => file instanceof File && file.name.endsWith(".csv"), {
        message: "Chỉ chấp nhận file định dạng .csv.",
      }),
  });

  // Infer form data type from Zod schema
  type FormData = z.infer<typeof formSchema>;

  // Initialize React Hook Form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  // Submit handler
  const submitForm: SubmitHandler<FormData> = (values) => {
    const file = values.file;
    setFileName(file.name); // Lưu tên file

    // Sử dụng FileReader để đọc nội dung file
    const reader = new FileReader();
    reader.onload = () => {
      setFileContent(reader.result as string); // Lưu nội dung file
      const csvContent = reader.result as string;
      const jsonData = convertCSVToJSON(csvContent); // Convert CSV to JSON
      //   console.log("jsonData: ", jsonData);
      onSubmitFile(jsonData); // Call onSubmitFile with JSON data
    };
    reader.readAsText(file);
    // onSubmitFile(file);
  };

  return (
    <Card className="w-full h-full p-4">
      <CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submitForm)} className="space-y-4">
            <FormInput
              control={form.control}
              fieldName="file"
              type={Constants.INPUT_TYPE.FILE_UPLOAD}
              required={true}
            />
            <Button type="submit" variant="outline" className="w-full">
              Gửi
            </Button>
          </form>
        </Form>
      </CardHeader>

      <CardContent>
        <div className="text-sm text-gray-500">
          <p className="mb-4">
            <span className="font-semibold text-red-500">Lưu ý:</span> File phải
            được định dạng theo thứ tự:
          </p>
          <ul className="list-disc list-inside pl-4 mb-4">
            <li>Ngày tháng năm (DD-MM-YYYY)</li>
            <li>Nội dung</li>
            <li>Thực tế</li>
            <li>Dự kiến</li>
            <li>Loại (Thu/Chi)</li>
          </ul>
          <p>
            Chỉ chấp nhận file định dạng <strong>.csv</strong> và không vượt quá
            5MB.
          </p>
          <p>{`Chuỗi không được có dấu ','`}</p>
        </div>
        {fileName && (
          <div className="mt-4">
            <h3 className="font-semibold text-lg">File đã upload:</h3>
            <p className="text-gray-700">{fileName}</p>
            {fileContent && (
              <div className="mt-4">
                <h4 className="font-semibold">Nội dung file:</h4>
                <pre className="overflow-x-auto bg-gray-100 p-2 rounded">
                  {fileContent}
                </pre>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
