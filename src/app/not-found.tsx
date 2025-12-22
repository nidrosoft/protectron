"use client";

import { ArrowLeft } from "@untitledui/icons";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/base/buttons/button";

export default function NotFound() {
    const router = useRouter();

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
                <div className="flex w-full max-w-md flex-col items-center gap-8 text-center">
                    <div className="flex flex-col items-center gap-4">
                        <span className="text-md font-semibold text-brand-600">404 error</span>
                        <h1 className="text-display-sm font-semibold text-primary md:text-display-md">
                            Page not found
                        </h1>
                        <p className="text-md text-tertiary">
                            Sorry, the page you are looking for doesn&apos;t exist or has been moved.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 w-full sm:flex-row sm:justify-center">
                        <Button 
                            color="secondary" 
                            size="lg" 
                            iconLeading={ArrowLeft} 
                            onClick={() => router.back()}
                        >
                            Go back
                        </Button>
                        <Button 
                            size="lg" 
                            onClick={() => router.push("/")}
                        >
                            Take me home
                        </Button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="flex justify-center p-6 md:p-8">
                <p className="text-sm text-tertiary">© Protectron {new Date().getFullYear()}</p>
            </footer>
        </section>
    );
}
