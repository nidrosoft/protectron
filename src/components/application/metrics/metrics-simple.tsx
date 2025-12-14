"use client";

import type { ReactNode } from "react";
import { TrendUp01, Zap } from "@untitledui/icons";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { cx } from "@/utils/cx";
import { ActionsDropdown, MetricChangeIndicator } from "./shared";

export const MetricsSimple = ({
    title = "2,000",
    subtitle = "View 24 hours",
    type,
    trend,
    change,
    footer,
    className,
}: {
    title?: string;
    subtitle?: string;
    type: "simple" | "trend" | "modern";
    trend: "positive" | "negative";
    change?: string;
    footer?: ReactNode;
    className?: string;
}) => {
    return (
        <div className={cx("rounded-xl bg-primary shadow-xs ring-1 ring-secondary ring-inset", className)}>
            <div className="relative flex flex-col gap-2 px-4 py-5 md:px-5">
                <h3 className="text-sm font-medium text-tertiary">{subtitle}</h3>

                <div className="flex items-end gap-4">
                    <p className="flex-1 text-display-sm font-semibold text-primary">{title}</p>
                    <MetricChangeIndicator type={type} trend={trend} value={change} />
                </div>

                <div className="absolute top-4 right-4 md:top-5 md:right-5">
                    <ActionsDropdown />
                </div>
            </div>

            {footer && <div className="flex items-center justify-end border-t border-secondary p-4 md:px-5">{footer}</div>}
        </div>
    );
};

export const MetricsIcon01 = ({
    title = "2,000",
    subtitle = "View 24 hours",
    footer,
    className,
}: {
    title?: string;
    subtitle?: string;
    footer?: ReactNode;
    className?: string;
}) => {
    return (
        <div className={cx("rounded-xl bg-primary shadow-xs ring-1 ring-secondary ring-inset", className)}>
            <div className="relative flex flex-col gap-4 px-4 py-5 md:gap-5 md:px-5">
                <FeaturedIcon color="success" theme="light" icon={TrendUp01} size="lg" />

                <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-medium text-tertiary">{subtitle}</h3>

                    <div className="flex items-end gap-4">
                        <p className="flex-1 text-display-sm font-semibold text-primary">{title}</p>
                        <MetricChangeIndicator type="modern" trend="positive" value="100%" />
                    </div>
                </div>

                <div className="absolute top-4 right-4 md:top-5 md:right-5">
                    <ActionsDropdown />
                </div>
            </div>

            {footer && <div className="flex items-center justify-end border-t border-secondary p-4 md:px-5">{footer}</div>}
        </div>
    );
};

export const MetricsIcon02 = ({
    title = "2,000",
    subtitle = "View 24 hours",
    footer,
    className,
}: {
    title?: string;
    subtitle?: string;
    footer?: ReactNode;
    className?: string;
}) => {
    return (
        <div className={cx("rounded-xl bg-primary shadow-xs ring-1 ring-secondary ring-inset", className)}>
            <div className="relative flex flex-col gap-4 px-4 py-5 md:gap-5 md:px-5">
                <div className="flex items-center gap-3">
                    <FeaturedIcon color="brand" theme="light" size="lg" icon={Zap} />
                    <h3 className="text-md font-semibold text-primary">{subtitle}</h3>
                </div>

                <div className="flex flex-col gap-3">
                    <p className="flex-1 text-display-sm font-semibold text-primary">{title}</p>
                    <div className="flex gap-2">
                        <MetricChangeIndicator type="simple" trend="positive" value="100%" />
                        <span className="text-sm font-medium text-tertiary">vs last month</span>
                    </div>
                </div>

                <div className="absolute top-4 right-4 md:top-5 md:right-5">
                    <ActionsDropdown />
                </div>
            </div>

            {footer && <div className="flex items-center justify-end border-t border-secondary p-4 md:px-5">{footer}</div>}
        </div>
    );
};
