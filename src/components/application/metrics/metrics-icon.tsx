"use client";

import type { FC, ReactNode } from "react";
import { TrendUp01 } from "@untitledui/icons";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { cx } from "@/utils/cx";
import { ActionsDropdown, MetricChangeIndicator } from "./shared";

export const MetricsIcon03 = ({
    icon = TrendUp01,
    title = "2,000",
    subtitle = "View 24 hours",
    change = "100%",
    changeTrend = "positive",
    actions = true,
    className,
    footer,
}: {
    icon?: FC<{ className?: string }>;
    title?: string;
    subtitle?: string;
    change?: string;
    changeTrend?: "positive" | "negative";
    actions?: boolean;
    footer?: ReactNode;
    className?: string;
}) => {
    return (
        <div className={cx("rounded-xl bg-primary shadow-xs ring-1 ring-secondary ring-inset", className)}>
            <div className="relative flex flex-col gap-4 px-4 py-5 md:gap-5 md:px-5">
                <FeaturedIcon color="gray" theme="modern" icon={icon || TrendUp01} size="lg" />

                <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-semibold text-tertiary">{subtitle}</h3>

                    <div className="flex flex-wrap items-center gap-3 lg:gap-4">
                        <p className="flex-1 text-display-sm font-semibold text-primary">{title}</p>
                        <div className="flex gap-2">
                            <MetricChangeIndicator type="trend" trend={changeTrend} value={change} />
                            <span className="text-sm font-medium text-tertiary">vs last month</span>
                        </div>
                    </div>
                </div>

                {actions && (
                    <div className="absolute top-4 right-4 md:top-5 md:right-5">
                        <ActionsDropdown />
                    </div>
                )}
            </div>

            {footer && <div className="flex items-center justify-end border-t border-secondary p-3 pr-4 md:p-4 md:pr-5">{footer}</div>}
        </div>
    );
};

export const MetricsIcon04 = ({
    icon = TrendUp01,
    title = "2,000",
    subtitle = "View 24 hours",
    change = "100%",
    changeTrend = "positive",
    actions = true,
    footer,
    className,
}: {
    icon?: FC<{ className?: string }>;
    title?: string;
    subtitle?: string;
    change?: string;
    changeTrend?: "positive" | "negative";
    actions?: boolean;
    footer?: ReactNode;
    className?: string;
}) => {
    return (
        <div className={cx("min-w-70 rounded-xl bg-primary shadow-xs ring-1 ring-secondary ring-inset", className)}>
            <div className="relative flex flex-col gap-4 px-4 py-5 md:flex-row md:px-5">
                <FeaturedIcon color="gray" theme="modern" icon={icon} size="md" />

                <div className="flex w-full flex-col gap-2">
                    <h3 className="text-sm font-semibold text-tertiary">{subtitle}</h3>

                    <div className="flex w-full flex-wrap items-center justify-between gap-4">
                        <p className="flex-1 text-display-sm font-semibold text-primary">{title}</p>

                        <MetricChangeIndicator type="modern" trend={changeTrend} value={change} />
                    </div>
                </div>

                {actions && (
                    <div className="absolute top-4 right-4 md:top-5 md:right-5">
                        <ActionsDropdown />
                    </div>
                )}
            </div>

            {footer && <div className="flex items-center justify-end border-t border-secondary p-3 pr-4 md:p-4 md:pr-5">{footer}</div>}
        </div>
    );
};
