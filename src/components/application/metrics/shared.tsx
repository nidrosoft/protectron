"use client";

import type { FC } from "react";
import { ArrowDown, ArrowDownRight, ArrowUp, ArrowUpRight, Copy01, Eye, Share01, TrendDown01, TrendUp01 } from "@untitledui/icons";
import type { Props as DotProps } from "recharts/types/shape/Dot";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { cx } from "@/utils/cx";

export const ActionsDropdown = () => (
    <Dropdown.Root>
        <Dropdown.DotsButton />

        <Dropdown.Popover className="w-min">
            <Dropdown.Menu>
                <Dropdown.Item icon={Eye}>
                    <span className="pr-4">View more</span>
                </Dropdown.Item>
                <Dropdown.Item icon={Share01}>
                    <span className="pr-4">Share</span>
                </Dropdown.Item>
                <Dropdown.Item icon={Copy01}>
                    <span className="pr-4">Copy link</span>
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown.Popover>
    </Dropdown.Root>
);

interface MetricChangeIndicatorProps {
    type: "simple" | "trend" | "modern";
    trend: "positive" | "negative";
    value?: string;
    className?: string;
}

export const MetricChangeIndicator = ({ type, trend, value, className }: MetricChangeIndicatorProps) => {
    const icons = {
        positive: {
            simple: ArrowUp,
            trend: TrendUp01,
            modern: ArrowUpRight,
        },
        negative: {
            simple: ArrowDown,
            trend: TrendDown01,
            modern: ArrowDownRight,
        },
    };

    const Icon = icons[trend][type];

    return (
        <div
            className={cx(
                "flex items-center",
                type === "simple" ? "gap-0.5" : "gap-1",
                type === "modern" && "rounded-md bg-primary py-0.5 pr-2 pl-1.5 shadow-xs ring-1 ring-primary ring-inset",
                className,
            )}
        >
            <Icon
                className={cx(
                    "stroke-[3px] text-fg-success-secondary",
                    type === "modern" ? "size-3" : "size-4",
                    trend === "negative" ? "text-fg-error-secondary" : "text-fg-success-secondary",
                )}
            />
            <span
                className={cx(
                    "text-sm font-medium text-secondary",
                    type === "modern" ? "text-secondary" : trend === "negative" ? "text-error-primary" : "text-success-primary",
                )}
            >
                {value}
            </span>
        </div>
    );
};

export const CustomizedDot = (props: DotProps & { payload?: { highlight?: boolean }; dotColor?: string }) => {
    if (!props.payload?.highlight) {
        return null;
    }

    const size = 20;

    return (
        <svg
            x={Number(props.cx) - size / 2}
            y={Number(props.cy) - size / 2}
            width={size}
            height={size}
            viewBox="0 0 20 20"
            fill="none"
            className={cx("text-fg-success-secondary", props.dotColor)}
        >
            <rect x="1.75" y="1.625" width="17.25" height="17.25" rx="8.625" className="stroke-current" strokeOpacity={0.2} strokeWidth="2" />
            <rect x="6.125" y="6" width="8.5" height="8.5" rx="4.25" className="fill-bg-primary stroke-current" strokeWidth="2" />
        </svg>
    );
};

// Default chart data
export const lineData = [
    { value: 10 },
    { value: 15 },
    { value: 12 },
    { value: 20 },
    { value: 18 },
    { value: 25 },
    { value: 30 },
    { value: 28 },
    { value: 32 },
    { value: 35 },
    { value: 40, highlight: true },
    { value: 32 },
    { value: 40 },
    { value: 50 },
    { value: 55 },
];

export const lineData2 = [
    { a: 10, b: 0 },
    { a: 5, b: 30 },
    { a: 30, b: 20 },
    { a: 20, b: 35 },
];

export const lineData3 = [{ value: 0 }, { value: 9 }, { value: 6 }, { value: 15 }];
