"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Mail01 } from "@untitledui/icons";
import { ShieldTick } from "iconsax-react";
import { Carousel } from "@/components/application/carousel/carousel-base";
import { CarouselIndicator } from "@/components/application/carousel/carousel.demo";
import { Button } from "@/components/base/buttons/button";
import { SocialButton } from "@/components/base/buttons/social-button";
import { Form } from "@/components/base/form/form";
import { Input } from "@/components/base/input/input";
import { cx } from "@/utils/cx";

type AuthMode = "signin" | "signup";

const ProtectronLogo = ({ className }: { className?: string }) => (
  <div className={cx("flex items-center gap-3", className)}>
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600">
      <ShieldTick size={24} color="#fff" variant="Bold" />
    </div>
    <span className="text-xl font-semibold text-primary">Protectron</span>
  </div>
);

const ProtectronLogoMinimal = ({ className }: { className?: string }) => (
  <div className={cx("flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600", className)}>
    <ShieldTick size={24} color="#fff" variant="Bold" />
  </div>
);

const carouselContent = [
  {
    title: "10-Minute Risk Assessment",
    description: "Quickly classify your AI systems under the EU AI Act with our intelligent questionnaire. Get instant risk categorization and compliance roadmap.",
  },
  {
    title: "AI-Powered Document Generation",
    description: "Generate compliant technical documentation, risk assessments, and policies in minutes. Our AI understands EU AI Act requirements.",
  },
  {
    title: "One-Click Audit Reports",
    description: "Export comprehensive compliance reports ready for regulators. Track progress, evidence, and maintain a complete audit trail.",
  },
  {
    title: "Stay Ahead of Deadlines",
    description: "August 2026 deadline for high-risk AI systems is approaching. Start your compliance journey today and avoid costly penalties.",
  },
];

export function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("signup");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    console.log("Form data:", data);
    
    if (mode === "signin") {
      // Sign in goes directly to dashboard
      router.push("/dashboard");
    } else {
      // Sign up goes to assessment/onboarding flow
      router.push("/assessment");
    }
  };

  return (
    <section className="grid min-h-screen grid-cols-1 bg-primary lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex flex-col bg-primary">
        <header className="hidden p-8 md:block">
          <ProtectronLogo />
        </header>
        
        <div className="flex flex-1 justify-center px-4 py-12 md:items-center md:px-8 md:py-0">
          <div className="flex w-full flex-col gap-8 sm:max-w-90">
            <div className="flex flex-col gap-6">
              <ProtectronLogoMinimal className="lg:hidden" />

              {/* Mode Switcher */}
              <div className="flex rounded-lg bg-secondary p-1">
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className={cx(
                    "flex-1 rounded-md py-2 text-sm font-semibold transition-all",
                    mode === "signin"
                      ? "bg-primary text-primary shadow-sm"
                      : "text-tertiary hover:text-secondary"
                  )}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className={cx(
                    "flex-1 rounded-md py-2 text-sm font-semibold transition-all",
                    mode === "signup"
                      ? "bg-primary text-primary shadow-sm"
                      : "text-tertiary hover:text-secondary"
                  )}
                >
                  Sign up
                </button>
              </div>

              <div className="flex flex-col gap-2 md:gap-3">
                <h1 className="text-display-xs font-semibold text-primary md:text-display-md">
                  {mode === "signup" ? "Create your account" : "Welcome back"}
                </h1>
                <p className="text-md text-tertiary">
                  {mode === "signup" 
                    ? "Start your EU AI Act compliance journey today." 
                    : "Sign in to access your compliance dashboard."}
                </p>
              </div>
            </div>

            <Form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-5">
                {mode === "signup" && (
                  <Input 
                    isRequired 
                    hideRequiredIndicator 
                    label="Full name" 
                    name="name" 
                    placeholder="Enter your name" 
                    size="md" 
                  />
                )}
                {mode === "signup" && (
                  <Input 
                    isRequired 
                    hideRequiredIndicator 
                    label="Company name" 
                    name="company" 
                    placeholder="Enter your company name" 
                    size="md" 
                  />
                )}
                <Input 
                  isRequired 
                  hideRequiredIndicator 
                  label="Email" 
                  type="email" 
                  name="email" 
                  placeholder="Enter your email" 
                  size="md" 
                />
                <Input
                  isRequired
                  hideRequiredIndicator
                  label="Password"
                  type="password"
                  name="password"
                  size="md"
                  placeholder={mode === "signup" ? "Create a password" : "Enter your password"}
                  hint={mode === "signup" ? "Must be at least 8 characters." : undefined}
                  minLength={8}
                />
              </div>

              <div className="flex flex-col gap-4">
                <Button type="submit" size="lg">
                  {mode === "signup" ? "Get started" : "Sign in"}
                </Button>
                <SocialButton social="google" theme="color">
                  {mode === "signup" ? "Sign up with Google" : "Sign in with Google"}
                </SocialButton>
              </div>
            </Form>

            <div className="flex justify-center gap-1 text-center">
              <span className="text-sm text-tertiary">
                {mode === "signup" ? "Already have an account?" : "Don't have an account?"}
              </span>
              <Button 
                onClick={() => setMode(mode === "signup" ? "signin" : "signup")} 
                color="link-color" 
                size="md"
              >
                {mode === "signup" ? "Log in" : "Sign up"}
              </Button>
            </div>
          </div>
        </div>

        <footer className="hidden justify-between p-8 pt-11 lg:flex">
          <p className="text-sm text-tertiary">© Protectron 2024</p>
          <a href="mailto:support@protectron.ai" className="flex items-center gap-2 text-sm text-tertiary">
            <Mail01 className="size-4 text-fg-quaternary" />
            support@protectron.ai
          </a>
        </footer>
      </div>

      {/* Right Side - Carousel */}
      <div className="hidden h-full bg-primary py-4 pr-4 lg:block">
        <Carousel.Root className="relative h-full w-full items-center justify-center overflow-hidden rounded-[20px] bg-brand-section lg:flex">
          <div className="flex w-full flex-col items-center gap-8">
            <Carousel.Content overflowHidden={false}>
              {carouselContent.map((item, i) => (
                <Carousel.Item key={i} className="flex flex-col items-center gap-20">
                  {/* Compliance Visual */}
                  <div className="flex flex-col items-center gap-6 transition lg:scale-75 xl:scale-100">
                    <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                      <ShieldTick size={48} color="#fff" variant="Bold" />
                    </div>
                    <div className="flex gap-2">
                      <div className="h-2 w-2 rounded-full bg-success-400" />
                      <div className="h-2 w-2 rounded-full bg-warning-400" />
                      <div className="h-2 w-2 rounded-full bg-error-400" />
                      <div className="h-2 w-2 rounded-full bg-brand-300" />
                    </div>
                  </div>
                  
                  <div className="flex max-w-114 flex-col gap-2 text-center">
                    <p className="text-display-xs font-semibold text-primary_on-brand">{item.title}</p>
                    <p className="text-md font-medium text-tertiary_on-brand">{item.description}</p>
                  </div>
                </Carousel.Item>
              ))}
            </Carousel.Content>
            
            <div className="flex items-center justify-center gap-16">
              <Carousel.PrevTrigger className="cursor-pointer rounded-full p-2 outline-focus-ring transition duration-100 ease-linear focus-visible:outline-2 focus-visible:outline-offset-2">
                <ChevronLeft className="size-5 text-fg-white" />
              </Carousel.PrevTrigger>

              <CarouselIndicator size="lg" />

              <Carousel.NextTrigger className="cursor-pointer rounded-full p-2 outline-focus-ring transition duration-100 ease-linear focus-visible:outline-2 focus-visible:outline-offset-2">
                <ChevronRight className="size-5 text-fg-white" />
              </Carousel.NextTrigger>
            </div>
          </div>
        </Carousel.Root>
      </div>
    </section>
  );
}
