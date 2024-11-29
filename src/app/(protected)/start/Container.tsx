"use client";

import React, { useState } from "react";
import { Stepper } from "@/components/common/stepper/Stepper";
import { UploadFile } from "./step/UploadFile";
import { UploadProcessing } from "./step/UploadProcessing";
import { ProcessSuccess } from "./step/ProcessEnd";

export default function Container() {
  const [currentStep, setCurrentStep] = useState(0); // Để quản lý bước hiện tại
  const [isSuccessed, setIsSuccessed] = useState<boolean>(false);
  const steps = ["Tải lên", "Đang xử lý", "Hoàn tất"];

  // Hàm xử lý khi submit form
  const onSubmitFile = async (data: any) => {
    // Chuyển ngay sang bước 2 (Đang xử lý)
    setCurrentStep(1);

    try {
      // Giả sử gửi request tới API
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data,
        }),
      });

      if (response.ok) {
        // Nếu thành công, chuyển sang bước 3 (Hoàn tất)
        setCurrentStep(2);
        setIsSuccessed(true);
      } else {
        const error = await response.json();
        console.error("Error: ", error);
        setIsSuccessed(false);
      }
    } catch (error) {
      setIsSuccessed(false);
      console.error("Error uploading file:", error);
    } finally {
    }
  };

  // Các component cho các bước
  const stepComponents = [
    <UploadFile key={1} onSubmitFile={onSubmitFile} />,
    <UploadProcessing key={2} />,
    <ProcessSuccess key={3} isSuccessed={isSuccessed} />,
  ];

  return (
    <div className="container p-2 md:p-8 w-full h-full">
      {/* Stepper */}
      <Stepper
        steps={steps}
        currentStep={currentStep}
        // onStepChange={(step) => setCurrentStep(step)}
      />

      {/* Current Step Content */}
      <div className="mt-8">{stepComponents[currentStep]}</div>
    </div>
  );
}
