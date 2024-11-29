import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const ProcessSuccess = ({
  isSuccessed = false,
}: {
  isSuccessed: boolean;
}) => {
  const router = useRouter();

  return (
    <Card className="flex flex-col items-center justify-center h-full text-center">
      <CardHeader>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </CardHeader>
      <CardContent>
        {isSuccessed ? (
          <>
            <h2 className="mt-4 text-2xl font-semibold text-green-600">
              Tải lên thành công!
            </h2>
            <p className="mt-2 text-gray-600">
              Tệp của bạn đã được tải lên và xử lý thành công.
            </p>
            <Button onClick={() => router.push("/overview")} variant={"ghost"}>
              Tiếp tục
            </Button>
          </>
        ) : (
          <>
            <h2 className="mt-4 text-2xl font-semibold text-red-600">
              Tải lên không thành công!
            </h2>
            <p className="mt-2 text-gray-600">Hãy thử tải lại file.</p>
          </>
        )}
      </CardContent>
    </Card>
  );
};
