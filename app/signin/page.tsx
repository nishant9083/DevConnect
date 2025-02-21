import { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";
import { onSubmit } from "./actions";
import * as React from "react";

export const metadata: Metadata = {
  title: "Sign In - DevConnect",
  description: "Sign in to your DevConnect account",
};

export default function SignInPage({ params }: { params: { error?: string } }) {
  return (
    <div className="container flex flex-col items-center justify-center">
      <div className="flex flex-col sm:flex-row justify-center space-y-6 sm:space-y-0 sm:space-x-6 w-full px-8">
        <div className="flex flex-col space-y-2 justify-center items-center text-center sm:text-left sm:w-1/2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your account to continue
          </p>
          {/* {params?.error && (
        <p className="text-sm text-red-500">{params.error}</p>
        )} */}
        </div>
        <div className="sm:w-1/2">
          <AuthForm />
        </div>
      </div>
    </div>
  );
}
