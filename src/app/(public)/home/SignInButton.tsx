"use client";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import React from "react";

const SignInButton = () => {
  return (
    <Button
      className="bg-white text-pink-500 hover:bg-gray-100"
      onClick={() => signIn("google")}
    >
      Đăng nhập ngay
    </Button>
  );
};

export default SignInButton;
