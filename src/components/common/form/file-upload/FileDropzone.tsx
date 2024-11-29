// "use client";
// import React, { useRef, useState } from "react";
// import { useDropzone } from "react-dropzone";
// import { useFormContext } from "react-hook-form";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { cn } from "@/lib/utils";
// import { CloudUploadIcon } from "lucide-react";

// interface FileDropzoneProps {
//   placeholder: string;
//   classNameInput?: string;
//   field: any;
//   name: string;
//   maxFileSize?: number; // Kích thước tối đa (bytes), mặc định 5MB
//   readOnly?: boolean;
// }

// export const FileDropzone: React.FC<FileDropzoneProps> = ({
//   placeholder,
//   classNameInput,
//   field,
//   name,
//   maxFileSize = 5 * 1024 * 1024, // 5MB
//   readOnly = false,
// }) => {
//   const { setValue } = useFormContext();
//   const [fileName, setFileName] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   const fileRef = useRef<HTMLInputElement>(null);

//   const onDelete = () => {
//     setFileName(null);
//     setError(null);
//     setValue(name, null);
//   };

//   const { getRootProps, getInputProps } = useDropzone({
//     multiple: false,
//     // accept: accept as unknown as Accept,
//     onDrop: (acceptedFiles) => {
//       const file = acceptedFiles[0];

//       // Kiểm tra định dạng file
//       if (!file.name.endsWith(".csv")) {
//         setError("Chỉ chấp nhận file định dạng .csv.");
//         return;
//       }

//       // Kiểm tra kích thước file
//       if (file.size > maxFileSize) {
//         setError(
//           `File quá lớn. Kích thước tối đa là ${maxFileSize / 1024 / 1024}MB.`
//         );
//         return;
//       }

//       setFileName(file.name);
//       setError(null);
//       setValue(name, file);
//       //   setValue(`${name}.data`, acceptedFiles[0]);
//       //   setValue(`${name}.path`, URL.createObjectURL(acceptedFiles[0]));
//     },
//     noClick: true,
//   });

//   return (
//     <div
//       {...getRootProps({
//         className: cn(
//           "relative flex flex-col items-center justify-center w-full",
//           error ? "border-red-500" : "border-gray-300"
//         ),
//       })}
//     >
//       <div className="flex flex-col items-center justify-center w-full h-full">
//         <p className="text-sm font-medium text-gray-600">{placeholder}</p>
//         {!fileName && (
//           <Button
//             variant="outline"
//             type="button"
//             onClick={(e) => {
//               e.preventDefault();
//               fileRef?.current?.click();
//             }}
//             className="w-full h-24"
//             disabled={readOnly}
//           >
//             {/* {"Chon file"} */}
//             <CloudUploadIcon
//               className="text-violet-500 w-full h-24"
//               size={32}
//             />
//           </Button>
//         )}
//         <Input
//           {...field}
//           {...getInputProps()}
//           type="file"
//           className={cn("hidden", classNameInput)}
//           ref={fileRef}
//           accept=".csv"
//         />
//       </div>
//       {fileName && (
//         <div className="mt-4 text-sm text-green-600">
//           File đã chọn: <span className="font-medium">{fileName}</span>
//           <div className="flex justify-between">
//             <Button
//               variant="secondary"
//               type="button"
//               onClick={(e) => {
//                 e.preventDefault();
//                 fileRef?.current?.click();
//               }}
//               className="mt-4"
//               disabled={readOnly}
//             >
//               {"Thay đổi File"}
//             </Button>
//             <Button
//               variant="destructive"
//               type="button"
//               onClick={onDelete}
//               className="mt-2"
//               disabled={readOnly}
//             >
//               Xóa File
//             </Button>
//           </div>
//         </div>
//       )}
//       {error && <div className="mt-2 text-sm text-red-500">{error}</div>}
//       {/* {fileName && (

//       )} */}
//     </div>
//   );
// };

"use client";
import React, { useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CloudUploadIcon, Trash2Icon } from "lucide-react";

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
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (!file.name.endsWith(".csv")) {
        setError("Chỉ chấp nhận file định dạng .csv.");
        return;
      }

      if (file.size > maxFileSize) {
        setError(
          `File quá lớn. Kích thước tối đa là ${maxFileSize / 1024 / 1024}MB.`
        );
        return;
      }

      setFileName(file.name);
      setError(null);
      setValue(name, file);
    },
    noClick: true,
  });

  return (
    <div
      {...getRootProps({
        className: cn(
          "relative flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer",
          error
            ? "border-red-500 bg-red-50"
            : "border-gray-300 bg-gray-100 hover:bg-gray-200"
        ),
      })}
    >
      <div className="flex flex-col items-center justify-center w-full h-full">
        {!fileName ? (
          <>
            <CloudUploadIcon className="text-violet-500" size={64} />
            <p className="mt-2 text-sm font-medium text-gray-600">
              {placeholder}
            </p>
            <Button
              variant="outline"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                fileRef?.current?.click();
              }}
              className="mt-4"
              disabled={readOnly}
            >
              Chọn File
            </Button>
          </>
        ) : (
          <div className="text-center">
            <p className="text-sm text-violet-600">File đã chọn:</p>
            <span className="font-medium text-gray-800">{fileName}</span>
            <div className="flex justify-center mt-4 space-x-2">
              <Button
                variant="secondary"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  fileRef?.current?.click();
                }}
                disabled={readOnly}
              >
                Thay đổi File
              </Button>
              <Button
                variant="destructive"
                type="button"
                onClick={onDelete}
                disabled={readOnly}
              >
                <Trash2Icon size={16} className="mr-2" />
                Xóa File
              </Button>
            </div>
          </div>
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
      {error && <div className="mt-2 text-sm text-red-500">{error}</div>}
    </div>
  );
};
