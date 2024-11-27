"use client";
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const CommonPopup = (props: any) => {
  const {
    open,
    setOpen,
    isShowTrigger,
    TriggerComponent,
    title,
    children,
    className,
  } = props;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {isShowTrigger && TriggerComponent && (
        <DialogTrigger asChild>{TriggerComponent}</DialogTrigger>
      )}
      <DialogContent className={cn(`w-full p-0`, className)}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
        <CardFooter className="flex justify-center gap-6"></CardFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CommonPopup;
