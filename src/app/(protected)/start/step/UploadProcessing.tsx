import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React from "react";

export const UploadProcessing = () => {
  return (
    <Card className="flex flex-col items-center justify-center h-full">
      <CardHeader>
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-violet-500 border-opacity-50"></div>
      </CardHeader>
      <CardContent>
        <p className="mt-4 text-violet-500 text-lg font-medium">
          Đang xử lý tệp của bạn, vui lòng đợi...
        </p>
      </CardContent>
    </Card>
  );
};
