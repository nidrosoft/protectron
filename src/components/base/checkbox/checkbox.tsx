"use client";

import type { ReactNode, Ref } from "react";
import { Checkbox as AriaCheckbox, type CheckboxProps as AriaCheckboxProps } from "react-aria-components";
import { cx } from "@/utils/cx";

export interface CheckboxBaseProps {
    size?: "sm" | "md";
    className?: string;
    isFocusVisible?: boolean;
    isSelected?: boolean;
    isDisabled?: boolean;
    isIndeterminate?: boolean;
}

export const CheckboxBase = ({ className, isSelected, isDisabled, isIndeterminate, size = "sm", isFocusVisible = false }: CheckboxBaseProps) => {
    return (
        <div
            className={cx(
                "relative flex shrink-0 cursor-pointer appearance-none items-center justify-center rounded bg-primary ring-1 ring-primary ring-inset",
                size === "sm" ? "h-4 w-4" : "h-5 w-5 rounded-md",
                (isSelected || isIndeterminate) && "bg-brand-solid ring-bg-brand-solid",
                isDisabled && "cursor-not-allowed bg-disabled_subtle ring-disabled",
                isFocusVisible && "outline-2 outline-offset-2 outline-focus-ring",
                className,
            )}
        >
            {/* Indeterminate icon (dash) */}
            {isIndeterminate && (
                <svg
                    aria-hidden="true"
                    viewBox="0 0 12 12"
                    fill="none"
                    className={cx(
                        "pointer-events-none text-fg-white",
                        size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5",
                        isDisabled && "text-fg-disabled_subtle",
                    )}
                >
                    <path d="M2.5 6H9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )}

            {/* Checkmark icon */}
            {isSelected && !isIndeterminate && (
                <svg
                    aria-hidden="true"
                    viewBox="0 0 12 12"
                    fill="none"
                    className={cx(
                        "pointer-events-none text-fg-white",
                        size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5",
                        isDisabled && "text-fg-disabled_subtle",
                    )}
                >
                    <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )}
        </div>
    );
};
CheckboxBase.displayName = "CheckboxBase";

interface CheckboxProps extends AriaCheckboxProps {
    ref?: Ref<HTMLLabelElement>;
    size?: "sm" | "md";
    label?: ReactNode;
    hint?: ReactNode;
}

export const Checkbox = ({ label, hint, size = "sm", className, ...ariaCheckboxProps }: CheckboxProps) => {
    const sizes = {
        sm: {
            root: "gap-2",
            textWrapper: "",
            label: "text-sm font-medium",
            hint: "text-sm",
        },
        md: {
            root: "gap-3",
            textWrapper: "gap-0.5",
            label: "text-md font-medium",
            hint: "text-md",
        },
    };

    return (
        <AriaCheckbox
            {...ariaCheckboxProps}
            className={(state) =>
                cx(
                    "flex items-start",
                    state.isDisabled && "cursor-not-allowed",
                    sizes[size].root,
                    typeof className === "function" ? className(state) : className,
                )
            }
        >
            {({ isSelected, isIndeterminate, isDisabled, isFocusVisible }) => (
                <>
                    <CheckboxBase
                        size={size}
                        isSelected={isSelected}
                        isIndeterminate={isIndeterminate}
                        isDisabled={isDisabled}
                        isFocusVisible={isFocusVisible}
                        className={label || hint ? "mt-0.5" : ""}
                    />
                    {(label || hint) && (
                        <div className={cx("inline-flex flex-col", sizes[size].textWrapper)}>
                            {label && <p className={cx("text-secondary select-none", sizes[size].label)}>{label}</p>}
                            {hint && (
                                <span className={cx("text-tertiary", sizes[size].hint)} onClick={(event) => event.stopPropagation()}>
                                    {hint}
                                </span>
                            )}
                        </div>
                    )}
                </>
            )}
        </AriaCheckbox>
    );
};
Checkbox.displayName = "Checkbox";
