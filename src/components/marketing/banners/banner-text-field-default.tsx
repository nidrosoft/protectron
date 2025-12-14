"use client";

import { Mail01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";
import { Form } from "@/components/base/form/form";
import { Input } from "@/components/base/input/input";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";

export const BannerTextFieldDefault = () => {
    return (
        <div className="relative mx-2 mb-4 flex flex-col gap-4 rounded-xl bg-secondary_subtle p-4 shadow-lg ring-1 ring-primary ring-inset md:m-0 md:flex-row md:items-center md:gap-3 md:p-3">
            <div className="flex flex-1 items-center gap-4 md:w-0">
                <FeaturedIcon className="hidden md:flex" icon={Mail01} color="gray" theme="modern" size="lg" />
                <div className="flex flex-col gap-0.5 overflow-auto">
                    <p className="pr-8 text-md font-semibold text-secondary md:truncate md:pr-0">
                        Stay up to date with the latest news <span className="hidden md:inline">and updates</span>
                    </p>
                    <p className="text-md text-tertiary md:truncate">Lorem ipsum dolor sit amet consectetur odio nunc adipiscing viverra.</p>
                </div>
            </div>

            <div className="flex gap-2">
                <Form
                    onSubmit={(e) => {
                        e.preventDefault();
                        const data = Object.fromEntries(new FormData(e.currentTarget));
                        console.log("Form data:", data);
                    }}
                    className="flex flex-1 flex-col gap-3 md:w-100 md:flex-row md:gap-4"
                >
                    <Input isRequired size="md" name="email" type="email" placeholder="Enter your email" wrapperClassName="flex-1" />
                    <Button type="submit" color="secondary" size="lg">
                        Subscribe
                    </Button>
                </Form>
                <div className="absolute top-2 right-2 flex shrink-0 items-center justify-center md:static">
                    <CloseButton size="md" label="Dismiss" />
                </div>
            </div>
        </div>
    );
};
