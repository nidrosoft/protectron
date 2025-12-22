"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Mail01 } from "@untitledui/icons";
import { Key } from "iconsax-react";
import { Button } from "@/components/base/buttons/button";
import { Form } from "@/components/base/form/form";
import { Input } from "@/components/base/input/input";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/base/toast/toast";

type ForgotPasswordStep = "email" | "check-email" | "new-password" | "success";

function ForgotPasswordContent() {
  const router = useRouter();
  const { addToast } = useToast();
  const [step, setStep] = useState<ForgotPasswordStep>("email");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleSendResetEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const emailValue = formData.get("email") as string;
    setEmail(emailValue);

    const supabase = createClient();

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(emailValue, {
        redirectTo: `${window.location.origin}/forgot-password?step=new-password`,
      });

      if (error) {
        addToast({
          title: "Error",
          message: error.message,
          type: "error",
        });
        setIsLoading(false);
        return;
      }

      setStep("check-email");
    } catch (error) {
      addToast({
        title: "Error",
        message: "An unexpected error occurred",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetNewPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      addToast({
        title: "Passwords don't match",
        message: "Please make sure both passwords are the same",
        type: "error",
      });
      setIsLoading(false);
      return;
    }

    const supabase = createClient();

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        addToast({
          title: "Error",
          message: error.message,
          type: "error",
        });
        setIsLoading(false);
        return;
      }

      setStep("success");
    } catch (error) {
      addToast({
        title: "Error",
        message: "An unexpected error occurred",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setIsLoading(true);
    const supabase = createClient();

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/forgot-password?step=new-password`,
      });

      if (error) {
        addToast({
          title: "Error",
          message: error.message,
          type: "error",
        });
      } else {
        addToast({
          title: "Email sent",
          message: "We've sent another reset link to your email",
          type: "success",
        });
      }
    } catch (error) {
      addToast({
        title: "Error",
        message: "An unexpected error occurred",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const searchParams = useSearchParams();

  // Check URL params on mount for password reset callback
  useEffect(() => {
    const stepParam = searchParams.get("step");
    if (stepParam === "new-password") {
      setStep("new-password");
    }
  }, [searchParams]);

  return (
    <section className="flex min-h-screen flex-col bg-primary">
      {/* Header */}
      <header className="p-6 md:p-8">
        <Link href="/" className="flex items-center">
          <Image
            src="/assets/images/logo-light.png"
            alt="Protectron"
            width={615}
            height={126}
            className="h-8 w-auto dark:hidden"
            priority
          />
          <Image
            src="/assets/images/logo-dark.png"
            alt="Protectron"
            width={615}
            height={126}
            className="hidden h-8 w-auto dark:block"
            priority
          />
        </Link>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm">
          {/* Step 1: Enter Email */}
          {step === "email" && (
            <div className="flex flex-col items-center gap-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-secondary bg-primary shadow-sm">
                <Key size={28} color="#7C3AED" variant="Bold" />
              </div>

              <div className="text-center">
                <h1 className="text-display-xs font-semibold text-primary md:text-display-sm">
                  Forgot password?
                </h1>
                <p className="mt-2 text-md text-tertiary">
                  No worries, we'll send you reset instructions.
                </p>
              </div>

              <Form onSubmit={handleSendResetEmail} className="w-full">
                <div className="flex flex-col gap-5">
                  <Input
                    isRequired
                    hideRequiredIndicator
                    label="Email"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    size="md"
                  />
                  <Button type="submit" size="lg" isLoading={isLoading} className="w-full">
                    Reset password
                  </Button>
                </div>
              </Form>

              <Button
                color="link-gray"
                size="md"
                onClick={() => router.push("/")}
                iconLeading={ArrowLeft}
              >
                Back to log in
              </Button>
            </div>
          )}

          {/* Step 2: Check Email */}
          {step === "check-email" && (
            <div className="flex flex-col items-center gap-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-secondary bg-primary shadow-sm">
                <Mail01 className="h-7 w-7 text-brand-600" />
              </div>

              <div className="text-center">
                <h1 className="text-display-xs font-semibold text-primary md:text-display-sm">
                  Check your email
                </h1>
                <p className="mt-2 text-md text-tertiary">
                  We sent a password reset link to
                </p>
                <p className="mt-1 text-md font-medium text-primary">{email}</p>
              </div>

              <Button
                size="lg"
                className="w-full"
                onClick={() => window.open("mailto:", "_blank")}
              >
                Open email app
              </Button>

              <div className="flex items-center gap-1 text-sm">
                <span className="text-tertiary">Didn't receive the email?</span>
                <Button
                  color="link-color"
                  size="sm"
                  onClick={handleResendEmail}
                  isLoading={isLoading}
                >
                  Click to resend
                </Button>
              </div>

              <Button
                color="link-gray"
                size="md"
                onClick={() => router.push("/")}
                iconLeading={ArrowLeft}
              >
                Back to log in
              </Button>
            </div>
          )}

          {/* Step 3: Set New Password */}
          {step === "new-password" && (
            <div className="flex flex-col items-center gap-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-secondary bg-primary shadow-sm">
                <Key size={28} color="#7C3AED" variant="Bold" />
              </div>

              <div className="text-center">
                <h1 className="text-display-xs font-semibold text-primary md:text-display-sm">
                  Set new password
                </h1>
                <p className="mt-2 text-md text-tertiary">
                  Your new password must be different from previously used passwords.
                </p>
              </div>

              <Form onSubmit={handleSetNewPassword} className="w-full">
                <div className="flex flex-col gap-5">
                  <Input
                    isRequired
                    hideRequiredIndicator
                    label="Password"
                    type="password"
                    name="password"
                    placeholder="Enter new password"
                    size="md"
                    hint="Must be at least 8 characters."
                    minLength={8}
                  />
                  <Input
                    isRequired
                    hideRequiredIndicator
                    label="Confirm password"
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    size="md"
                    minLength={8}
                  />
                  <Button type="submit" size="lg" isLoading={isLoading} className="w-full">
                    Reset password
                  </Button>
                </div>
              </Form>

              <Button
                color="link-gray"
                size="md"
                onClick={() => router.push("/")}
                iconLeading={ArrowLeft}
              >
                Back to log in
              </Button>
            </div>
          )}

          {/* Step 4: Success */}
          {step === "success" && (
            <div className="flex flex-col items-center gap-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-success-200 bg-success-50">
                <svg
                  className="h-7 w-7 text-success-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <div className="text-center">
                <h1 className="text-display-xs font-semibold text-primary md:text-display-sm">
                  Password reset
                </h1>
                <p className="mt-2 text-md text-tertiary">
                  Your password has been successfully reset. Click below to log in.
                </p>
              </div>

              <Button
                size="lg"
                className="w-full"
                onClick={() => router.push("/")}
              >
                Continue to log in
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="flex justify-center p-6 md:p-8">
        <p className="text-sm text-tertiary">© Protectron {new Date().getFullYear()}</p>
      </footer>
    </section>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-primary">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
      </div>
    }>
      <ForgotPasswordContent />
    </Suspense>
  );
}