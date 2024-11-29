import React from "react";
import clsx from "clsx";
import { CheckIcon } from "lucide-react";

interface StepperProps {
  steps: string[];
  currentStep: number;
  onStepChange?: (step: number) => void;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  onStepChange,
}) => {
  return (
    <div className="flex w-full mx-auto flex-row items-start sm:items-center justify-between">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;

        return (
          <div
            key={index}
            className={`flex flex-col sm:flex-row items-center ${
              index === steps.length - 1 ? "" : "md:w-1/3"
            }`}
          >
            {/* Step Circle */}
            <div
              className={clsx(
                "flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2",
                isCompleted
                  ? "bg-violet-500 border-violet-500 text-white"
                  : isActive
                  ? "border-violet-500 text-violet-500"
                  : "border-gray-300 text-gray-400"
              )}
              onClick={() => onStepChange?.(index)}
            >
              {isCompleted ? <CheckIcon /> : index + 1}
            </div>

            {/* Step Label */}
            <div className="text-center sm:text-left mt-2 sm:mt-0 sm:ml-4">
              <span
                className={clsx(
                  "text-xs sm:text-sm font-medium",
                  isCompleted || isActive ? "text-violet-500" : "text-gray-500"
                )}
              >
                {step}
              </span>
            </div>

            {/* Divider */}
            {index < steps.length - 1 && (
              <div
                className={clsx(
                  "hidden sm:block flex-grow h-[2px] mx-1 sm:mx-4",
                  isCompleted ? "bg-violet-500" : "bg-gray-300"
                )}
              ></div>
            )}
          </div>
        );
      })}
    </div>
  );
};
