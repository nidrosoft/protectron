"use client";

import type { FC, ReactNode } from "react";
import { useId } from "react";
import { Eye } from "@untitledui/icons";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import type { CurveType } from "recharts/types/shape/Curve";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { cx } from "@/utils/cx";
import { ActionsDropdown, MetricChangeIndicator, CustomizedDot, lineData, lineData2, lineData3 } from "./shared";

export const MetricsChart01 = ({
    title = "2,000",
    subtitle = "View 24 hours",
    change = "100%",
    changeDescription = "vs last month",
    actions = true,
    chartData = lineData,
    trend = "positive",
    footer,
    className,
}: {
    title?: string;
    subtitle?: string;
    change?: string;
    changeDescription?: string;
    actions?: boolean;
    trend?: "positive" | "negative";
    chartData?: { value: number; highlight?: boolean }[];
    footer?: ReactNode;
    className?: string;
}) => {
    const id = useId();

    const chartColor = trend === "positive" ? "text-fg-success-secondary" : "text-fg-error-secondary";

    return (
        <div className={cx("rounded-xl bg-primary shadow-xs ring-1 ring-secondary ring-inset", className)}>
            <div className="relative flex flex-col gap-5 px-4 py-5 md:px-5">
                <h3 className="text-md font-semibold text-primary">{subtitle}</h3>

                <div className="flex items-end justify-between gap-4">
                    <div className="flex flex-col gap-3">
                        <p className="flex-1 text-display-sm font-semibold text-primary">{title}</p>
                        <div className="flex gap-2">
                            <MetricChangeIndicator type="simple" trend={trend} value={change} />
                            <span className="text-sm font-medium text-tertiary">{changeDescription}</span>
                        </div>
                    </div>

                    <AreaChart
                        height={56}
                        width={112}
                        data={chartData}
                        margin={{
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0,
                        }}
                    >
                        <defs>
                            <linearGradient id={`gradient-${id}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="currentColor" className={chartColor} stopOpacity="1" />
                                <stop offset="95%" stopColor="currentColor" className={chartColor} stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        <Area
                            isAnimationActive={false}
                            className={chartColor}
                            dataKey="value"
                            type="monotone"
                            stroke="currentColor"
                            strokeWidth={2}
                            fill={`url(#gradient-${id})`}
                            fillOpacity={0.2}
                            dot={<CustomizedDot dotColor={chartColor} />}
                        />
                    </AreaChart>
                </div>

                {actions && (
                    <div className="absolute top-4 right-4 md:top-5 md:right-5">
                        <ActionsDropdown />
                    </div>
                )}
            </div>

            {footer && <div className="flex items-center justify-end border-t border-secondary p-4 md:px-5">{footer}</div>}
        </div>
    );
};

export const MetricsChart02 = ({
    icon = Eye,
    title = "2,000",
    subtitle = "View 24 hours",
    change = "100%",
    changeTrend = "positive",
    footer,
    className,
}: {
    icon?: FC<{ className?: string }>;
    title?: string;
    subtitle?: string;
    change?: string;
    changeTrend?: "positive" | "negative";
    footer?: ReactNode;
    className?: string;
}) => {
    const id = useId();
    const chartColor = changeTrend === "positive" ? "text-fg-success-secondary" : "text-fg-error-secondary";

    return (
        <div className={cx("rounded-xl bg-primary shadow-xs ring-1 ring-secondary ring-inset", className)}>
            <div className="relative flex flex-col gap-4 px-4 py-5 md:gap-5 md:px-5">
                <div className="flex items-center gap-3">
                    <FeaturedIcon color="gray" theme="modern" size="lg" icon={icon} />
                    <h3 className="text-md font-semibold text-primary">{subtitle}</h3>
                </div>

                <div className="flex items-end justify-between gap-4">
                    <div className="flex items-start gap-2">
                        <p className="flex-1 text-display-sm font-semibold text-primary lg:text-display-md">{title}</p>
                        <MetricChangeIndicator type="trend" trend={changeTrend} value={change} />
                    </div>

                    <AreaChart
                        height={56}
                        width={128}
                        data={lineData2}
                        margin={{
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0,
                        }}
                    >
                        <defs>
                            <linearGradient id={`gradient-${id}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="currentColor" className={chartColor} stopOpacity="1" />
                                <stop offset="95%" stopColor="currentColor" className={chartColor} stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        <Area
                            className={chartColor}
                            dataKey="a"
                            type="monotone"
                            strokeWidth={0}
                            fill="currentColor"
                            fillOpacity={0.2}
                            isAnimationActive={false}
                        />
                        <Area dataKey="b" type="monotone" strokeWidth={0} fill={`url(#gradient-${id})`} fillOpacity={0.2} isAnimationActive={false} />
                    </AreaChart>
                </div>

                <div className="absolute top-4 right-4 md:top-5 md:right-5">
                    <ActionsDropdown />
                </div>
            </div>

            {footer && <div className="flex items-center justify-end border-t border-secondary p-3 pr-4 md:p-4 md:pr-5">{footer}</div>}
        </div>
    );
};

export const MetricsChart03 = ({
    title = "2,000",
    subtitle = "View 24 hours",
    type = "trend",
    change,
    changeTrend,
    changeDescription,
    chartColor,
    chartAreaFill,
    chartCurveType,
    chartData = lineData3,
    footer,
    className,
}: {
    title?: string;
    subtitle?: string;
    type?: "simple" | "trend" | "modern";
    change: string;
    changeTrend: "positive" | "negative";
    changeDescription?: string;
    chartColor?: string;
    chartAreaFill?: string;
    chartCurveType?: CurveType;
    chartData?: { value: number }[];
    footer?: ReactNode;
    className?: string;
}) => {
    const id = useId();

    chartColor = chartColor ?? (changeTrend === "positive" ? "text-fg-success-secondary" : "text-fg-error-secondary");

    return (
        <div className={cx("rounded-xl bg-primary shadow-xs ring-1 ring-secondary ring-inset", className)}>
            <div className="relative flex flex-col gap-4 px-4 py-5 md:gap-5 md:px-5">
                <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-medium text-tertiary">{subtitle}</h3>

                    <div className="flex items-center gap-4">
                        <p className="flex-1 text-display-sm font-semibold text-primary">{title}</p>
                        <div className="flex gap-2">
                            <MetricChangeIndicator type={type} trend={changeTrend} value={change} />
                            {changeDescription && <span className="text-sm font-medium text-tertiary">{changeDescription}</span>}
                        </div>
                    </div>
                </div>

                <ResponsiveContainer height={72}>
                    <AreaChart
                        data={chartData}
                        margin={{
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0,
                        }}
                    >
                        <defs>
                            <linearGradient id={`gradient-${id}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="currentColor" className={chartColor} stopOpacity="1" />
                                <stop offset="95%" stopColor="currentColor" className={chartColor} stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        <Area
                            isAnimationActive={false}
                            className={chartColor}
                            dataKey="value"
                            type={chartCurveType || "monotone"}
                            stroke="currentColor"
                            strokeWidth={2}
                            fill={chartAreaFill || `url(#gradient-${id})`}
                            fillOpacity={0.2}
                        />
                    </AreaChart>
                </ResponsiveContainer>

                <div className="absolute top-4 right-4 md:top-5 md:right-5">
                    <ActionsDropdown />
                </div>
            </div>

            {footer && <div className="flex items-center justify-end border-t border-secondary p-3 pr-4 md:p-4 md:pr-5">{footer}</div>}
        </div>
    );
};

export const MetricsChart04 = ({
    title,
    subtitle,
    type = "trend",
    change,
    changeTrend,
    changeDescription,
    chartColor = "text-fg-success-secondary",
    chartAreaFill,
    chartCurveType,
    chartData = lineData3,
    footer,
    className,
}: {
    title: string;
    subtitle: string;
    type?: "simple" | "trend" | "modern";
    change: string;
    changeTrend: "positive" | "negative";
    changeDescription?: string;
    chartColor?: string;
    chartAreaFill?: string;
    chartCurveType?: CurveType;
    chartData?: { value: number }[];
    footer?: ReactNode;
    className?: string;
}) => {
    const id = useId();

    chartColor = chartColor ?? (changeTrend === "positive" ? "text-fg-success-secondary" : "text-fg-error-secondary");

    return (
        <div className={cx("flex flex-col overflow-hidden rounded-xl bg-secondary_subtle shadow-xs ring-1 ring-secondary ring-inset", className)}>
            <div className="mb-0.5 px-3 pt-2 pb-1.5 md:px-4">
                <h3 className="text-sm font-semibold text-primary">{subtitle}</h3>
            </div>
            <div className="relative flex flex-col gap-3 rounded-xl bg-primary px-3 py-3 shadow-xs ring-1 ring-secondary ring-inset md:gap-3 md:px-4">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-display-xs font-semibold text-primary">{title}</p>
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <MetricChangeIndicator type={type} trend={changeTrend} value={change} />
                            {changeDescription && <span className="text-xs font-medium text-tertiary whitespace-nowrap">{changeDescription}</span>}
                        </div>
                    </div>
                </div>

                <ResponsiveContainer height={48}>
                    <AreaChart
                        data={chartData}
                        margin={{
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0,
                        }}
                        className={chartColor}
                    >
                        <defs>
                            <linearGradient id={`gradient-${id}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="currentColor" className={chartColor} stopOpacity="1" />
                                <stop offset="95%" stopColor="currentColor" className={chartColor} stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        <Area
                            isAnimationActive={false}
                            className={chartColor}
                            dataKey="value"
                            type={chartCurveType || "monotone"}
                            stroke="currentColor"
                            strokeWidth={2}
                            fill={chartAreaFill || `url(#gradient-${id})`}
                            fillOpacity={0.2}
                        />
                    </AreaChart>
                </ResponsiveContainer>

                <div className="absolute top-4 right-4 md:top-5 md:right-5">
                    <ActionsDropdown />
                </div>
            </div>
            {footer && <div className="flex items-center justify-end py-3 pr-4 pl-3 md:pr-5 md:pl-4">{footer}</div>}
        </div>
    );
};
