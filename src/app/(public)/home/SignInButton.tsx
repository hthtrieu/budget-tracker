"use client";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const SignInButton = () => {
  const router = useRouter();

  const { data: session } = useSession();
  return (
    <Button
      className="bg-white text-pink-500 hover:bg-gray-100"
      onClick={() => {
        if (!session || !session.user) {
          signIn("google");
        } else {
          router.push("/overview");
        }
      }}
    >
      {!session?.user ? "Đăng nhập ngay" : "Dữ liệu của bạn"}
    </Button>
  );
};

export default SignInButton;
