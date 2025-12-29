"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Mail01 } from "@untitledui/icons";
import { ShieldTick } from "iconsax-react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { Globe } from "@/components/ui/globe";
import { ConfirmationModal } from "@/components/application/modals/confirmation-modal";
import { DialogTrigger as AriaDialogTrigger, Heading as AriaHeading } from "react-aria-components";
import { Modal, ModalOverlay, Dialog } from "@/components/application/modals/modal";
import { CloseButton } from "@/components/base/buttons/close-button";
import { Carousel } from "@/components/application/carousel/carousel-base";
import { CarouselIndicator } from "@/components/application/carousel/carousel.demo";
import { Button } from "@/components/base/buttons/button";
import { SocialButton } from "@/components/base/buttons/social-button";
import { Form } from "@/components/base/form/form";
import { Input } from "@/components/base/input/input";
import { cx } from "@/utils/cx";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/base/toast/toast";

type AuthMode = "signin" | "signup";

const ProtectronLogo = ({ className }: { className?: string }) => (
  <div className={cx("flex items-center", className)}>
    <Image
      src="/assets/images/logo-light.png"
      alt="Protectron"
      width={615}
      height={126}
      className="h-9 w-auto dark:hidden"
      priority
    />
    <Image
      src="/assets/images/logo-dark.png"
      alt="Protectron"
      width={615}
      height={126}
      className="hidden h-9 w-auto dark:block"
      priority
    />
  </div>
);

const ProtectronLogoMinimal = ({ className }: { className?: string }) => (
  <div className={cx("flex items-center", className)}>
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
  const { addToast } = useToast();
  const [mode, setMode] = useState<AuthMode>("signup");
  const [isLoading, setIsLoading] = useState(false);
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const company = formData.get("company") as string;

    const supabase = createClient();

    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          addToast({
            title: "Sign in failed",
            message: error.message,
            type: "error",
          });
          setIsLoading(false);
          return;
        }

        addToast({
          title: "Welcome back!",
          message: "You have successfully signed in.",
          type: "success",
        });

        router.push("/dashboard");
        router.refresh();
      } else {
        // Sign up user - the database trigger handles organization/profile creation
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              company_name: company,
            },
            emailRedirectTo: `${window.location.origin}/assessment`,
          },
        });

        if (authError) {
          addToast({
            title: "Sign up failed",
            message: authError.message,
            type: "error",
          });
          setIsLoading(false);
          return;
        }

        // Check if email confirmation is required
        if (authData.user && !authData.session) {
          // Email confirmation required
          addToast({
            title: "Check your email",
            message: "We sent you a confirmation link. Please check your email to complete signup.",
            type: "success",
          });
          setIsLoading(false);
          return;
        }

        // Show welcome toast and go to assessment/onboarding flow
        addToast({
          title: "Account created successfully!",
          message: "Welcome to Protectron. Let's get started with your compliance assessment.",
          type: "success",
        });
        
        router.push("/assessment");
        router.refresh();
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

  const handleGoogleAuth = () => {
    setIsComingSoonOpen(true);
  };

  return (
    <>
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
                {mode === "signin" && (
                  <div className="flex justify-end">
                    <Button
                      color="link-color"
                      size="sm"
                      onClick={() => router.push("/forgot-password")}
                      type="button"
                    >
                      Forgot password?
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4">
                <Button type="submit" size="lg" isLoading={isLoading}>
                  {mode === "signup" ? "Get started" : "Sign in"}
                </Button>
                <SocialButton social="google" theme="color" onClick={handleGoogleAuth}>
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
          <p className="text-sm text-tertiary">© Protectron {new Date().getFullYear()}</p>
          <a href="mailto:support@protectron.ai" className="flex items-center gap-2 text-sm text-tertiary">
            <Mail01 className="size-4 text-fg-quaternary" />
            support@protectron.ai
          </a>
        </footer>
      </div>

      {/* Right Side - Globe */}
      <div className="hidden h-full bg-primary lg:block">
        <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-primary">
          {/* Globe Container - Positioned to align with sign in/sign up toggle */}
          <div className="relative flex flex-1 w-full items-center justify-center pt-16">
            <Globe className="top-0 max-w-[850px]" />
          </div>
          
          {/* Carousel Text at Bottom */}
          <div className="relative z-10 w-full px-8 pb-10 bg-primary">
            <Carousel.Root className="w-full" opts={{ loop: true }} plugins={[Autoplay({ delay: 3000, stopOnInteraction: false })]}>
              <Carousel.Content overflowHidden={false}>
                {carouselContent.map((item, i) => (
                  <Carousel.Item key={i} className="flex flex-col items-center">
                    <div className="flex max-w-md flex-col gap-2 text-center">
                      <p className="text-display-xs font-semibold text-primary">{item.title}</p>
                      <p className="text-md font-medium text-tertiary">{item.description}</p>
                    </div>
                  </Carousel.Item>
                ))}
              </Carousel.Content>
              
              <div className="mt-6 flex items-center justify-center gap-12">
                <Carousel.PrevTrigger className="cursor-pointer rounded-full p-2 text-tertiary transition hover:bg-secondary hover:text-primary">
                  <ChevronLeft className="size-5" />
                </Carousel.PrevTrigger>

                <CarouselIndicator size="lg" />

                <Carousel.NextTrigger className="cursor-pointer rounded-full p-2 text-tertiary transition hover:bg-secondary hover:text-primary">
                  <ChevronRight className="size-5" />
                </Carousel.NextTrigger>
              </div>
            </Carousel.Root>
          </div>
        </div>
      </div>
    </section>

      {/* Coming Soon Modal for Google Sign-in */}
      <AriaDialogTrigger isOpen={isComingSoonOpen} onOpenChange={setIsComingSoonOpen}>
        <ModalOverlay isDismissable>
          <Modal>
            <Dialog>
              <div className="relative w-full overflow-hidden rounded-2xl bg-primary shadow-xl sm:max-w-md">
                <CloseButton 
                  onClick={() => setIsComingSoonOpen(false)} 
                  theme="light" 
                  size="lg" 
                  className="absolute top-3 right-3 z-20" 
                />
                <div className="flex flex-col items-center gap-4 px-6 py-8 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100">
                    <ShieldTick size={28} className="text-brand-600" color="currentColor" variant="Bold" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <AriaHeading slot="title" className="text-lg font-semibold text-primary">
                      Coming Soon
                    </AriaHeading>
                    <p className="text-sm text-tertiary">
                      Google sign-in will be available soon. For now, please sign up with your email and password.
                    </p>
                  </div>
                  <Button 
                    color="primary" 
                    size="lg" 
                    className="mt-2 w-full"
                    onClick={() => setIsComingSoonOpen(false)}
                  >
                    Got it
                  </Button>
                </div>
              </div>
            </Dialog>
          </Modal>
        </ModalOverlay>
      </AriaDialogTrigger>
    </>
  );
}
