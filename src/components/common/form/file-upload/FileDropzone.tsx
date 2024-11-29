"use client";
import React, { useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CloudUploadIcon } from "lucide-react";

interface FileDropzoneProps {
  placeholder: string;
  classNameInput?: string;
  field: any;
  name: string;
  maxFileSize?: number; // Kích thước tối đa (bytes), mặc định 5MB
  readOnly?: boolean;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  placeholder,
  classNameInput,
  field,
  name,
  maxFileSize = 5 * 1024 * 1024, // 5MB
  readOnly = false,
}) => {
  const { setValue } = useFormContext();
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  const onDelete = () => {
    setFileName(null);
    setError(null);
    setValue(name, null);
  };

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    // accept: accept as unknown as Accept,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];

      // Kiểm tra định dạng file
      if (!file.name.endsWith(".csv")) {
        setError("Chỉ chấp nhận file định dạng .csv.");
        return;
      }

      // Kiểm tra kích thước file
      if (file.size > maxFileSize) {
        setError(
          `File quá lớn. Kích thước tối đa là ${maxFileSize / 1024 / 1024}MB.`
        );
        return;
      }

      setFileName(file.name);
      setError(null);
      setValue(name, file);
      //   setValue(`${name}.data`, acceptedFiles[0]);
      //   setValue(`${name}.path`, URL.createObjectURL(acceptedFiles[0]));
    },
    noClick: true,
  });

  return (
    <div
      {...getRootProps({
        className: cn(
          "relative flex flex-col items-center justify-center w-full border-[1px] rounded-lg p-4",
          error ? "border-red-500" : "border-gray-300"
        ),
      })}
    >
      <div className="flex flex-col items-center justify-center">
        <CloudUploadIcon className="w-12 h-12 text-violet-500 mb-4" />
        <p className="text-sm font-medium text-gray-600">{placeholder}</p>
        {!fileName && (
          <Button
            variant="secondary"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              fileRef?.current?.click();
            }}
            className="mt-4"
            disabled={readOnly}
          >
            {"Chon file"}
          </Button>
        )}
        <Input
          {...field}
          {...getInputProps()}
          type="file"
          className={cn("hidden", classNameInput)}
          ref={fileRef}
          accept=".csv"
        />
      </div>
      {fileName && (
        <div className="mt-4 text-sm text-green-600">
          File đã chọn: <span className="font-medium">{fileName}</span>
          <div className="space-x-4">
            <Button
              variant="secondary"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                fileRef?.current?.click();
              }}
              className="mt-4"
              disabled={readOnly}
            >
              {"Thay đổi File"}
            </Button>
            <Button
              variant="destructive"
              type="button"
              onClick={onDelete}
              className="mt-2"
              disabled={readOnly}
            >
              Xóa File
            </Button>
          </div>
        </div>
      )}
      {error && <div className="mt-2 text-sm text-red-500">{error}</div>}
      {/* {fileName && (
       
      )} */}
    </div>
  );
};
