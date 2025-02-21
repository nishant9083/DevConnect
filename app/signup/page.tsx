import { Metadata } from "next";
import { SignUpForm } from "@/components/signup-form";

export const metadata: Metadata = {
  title: "Sign Up - DevConnect",
  description: "Create your DevConnect account",
};

export default function SignUpPage() {
  return (
    <div className="container flex flex-col items-center justify-center">
      <div className="flex flex-col sm:flex-row justify-center space-y-6 sm:space-y-0 sm:space-x-6 w-full px-8">
        <div className="flex flex-col space-y-2 justify-center items-center text-center sm:text-left sm:w-1/2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign up to connect with developers in your area
          </p>
        </div>
        <div className="sm:w-1/2">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
}
