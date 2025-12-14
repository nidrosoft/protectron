"use client";

import { ChevronLeft, ChevronRight, Mail01 } from "@untitledui/icons";
import { Carousel } from "@/components/application/carousel/carousel-base";
import { CarouselIndicator } from "@/components/application/carousel/carousel.demo";
import { Button } from "@/components/base/buttons/button";
import { SocialButton } from "@/components/base/buttons/social-button";
import { Form } from "@/components/base/form/form";
import { Input } from "@/components/base/input/input";
import { UntitledLogo } from "@/components/foundations/logo/untitledui-logo";
import { UntitledLogoMinimal } from "@/components/foundations/logo/untitledui-logo-minimal";
import { StatsCardMockupCarousel } from "./stats-card-mockup-carousel";

export const SignupSplitCarousel = () => {
    return (
        <section className="grid min-h-screen grid-cols-1 bg-primary lg:grid-cols-2">
            <div className="flex flex-col bg-primary">
                <header className="hidden p-8 md:block">
                    <UntitledLogo />
                </header>
                <div className="flex flex-1 justify-center px-4 py-12 md:items-center md:px-8 md:py-0">
                    <div className="flex w-full flex-col gap-8 sm:max-w-90">
                        <div className="flex flex-col gap-6">
                            <UntitledLogoMinimal className="size-10 lg:hidden" />

                            <div className="flex flex-col gap-2 md:gap-3">
                                <h1 className="text-display-xs font-semibold text-primary md:text-display-md">Sign up</h1>
                                <p className="text-md text-tertiary">Start your 30-day free trial.</p>
                            </div>
                        </div>

                        <Form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const data = Object.fromEntries(new FormData(e.currentTarget));
                                console.log("Form data:", data);
                            }}
                            className="flex flex-col gap-6"
                        >
                            <div className="flex flex-col gap-5">
                                <Input isRequired hideRequiredIndicator label="Name" name="name" placeholder="Enter your name" size="md" />
                                <Input isRequired hideRequiredIndicator label="Email" type="email" name="email" placeholder="Enter your email" size="md" />
                                <Input
                                    isRequired
                                    hideRequiredIndicator
                                    label="Password"
                                    type="password"
                                    name="password"
                                    size="md"
                                    placeholder="Create a password"
                                    hint="Must be at least 8 characters."
                                    minLength={8}
                                />
                            </div>

                            <div className="flex flex-col gap-4">
                                <Button type="submit" size="lg">
                                    Get started
                                </Button>
                                <SocialButton social="google" theme="color">
                                    Sign up with Google
                                </SocialButton>
                            </div>
                        </Form>

                        <div className="flex justify-center gap-1 text-center">
                            <span className="text-sm text-tertiary">Already have an account?</span>
                            <Button href="#" color="link-color" size="md">
                                Log in
                            </Button>
                        </div>
                    </div>
                </div>

                <footer className="hidden justify-between p-8 pt-11 lg:flex">
                    <p className="text-sm text-tertiary">© Untitled UI 2077</p>

                    <a href="mailto:help@untitledui.com" className="flex items-center gap-2 text-sm text-tertiary">
                        <Mail01 className="size-4 text-fg-quaternary" />
                        help@untitledui.com
                    </a>
                </footer>
            </div>

            <div className="hidden h-full bg-primary py-4 pr-4 lg:block">
                <Carousel.Root className="relative h-full w-full items-center justify-center overflow-hidden rounded-[20px] bg-brand-section lg:flex">
                    <div className="flex w-full flex-col items-center gap-8">
                        <Carousel.Content overflowHidden={false}>
                            {Array.from({
                                length: 4,
                            }).map((_, i) => (
                                <Carousel.Item key={i} className="flex flex-col items-center gap-20">
                                    <StatsCardMockupCarousel className="transition lg:scale-75 xl:scale-100" />
                                    <div className="flex max-w-114 flex-col gap-2 text-center">
                                        <p className="text-display-xs font-semibold text-primary_on-brand">Introducing AutoReports 2.0®</p>
                                        <p className="text-md font-medium text-tertiary_on-brand">
                                            Powerful, self-serve product and growth analytics to help you convert, engage, and retain more users.
                                        </p>
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
};
