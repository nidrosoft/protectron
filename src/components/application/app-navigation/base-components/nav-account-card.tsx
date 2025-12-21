"use client";

import type { FC, HTMLAttributes } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Placement } from "@react-types/overlays";
import { BookOpen01, ChevronSelectorVertical, LogOut01, Settings01, User01, Calendar } from "@untitledui/icons";
import { useFocusManager } from "react-aria";
import type { DialogProps as AriaDialogProps } from "react-aria-components";
import { Button as AriaButton, Dialog as AriaDialog, DialogTrigger as AriaDialogTrigger, Popover as AriaPopover } from "react-aria-components";
import { AvatarLabelGroup } from "@/components/base/avatar/avatar-label-group";
import { Badge } from "@/components/base/badges/badges";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { createClient } from "@/lib/supabase/client";
import { cx } from "@/utils/cx";

type NavAccountType = {
    /** Unique identifier for the nav item. */
    id: string;
    /** Name of the account holder. */
    name: string;
    /** Email address of the account holder. */
    email: string;
    /** Avatar image URL. */
    avatar: string | null;
    /** Online status of the account holder. This is used to display the online status indicator. */
    status: "online" | "offline";
    /** User role */
    role?: string;
    /** Member since date */
    memberSince?: string;
};

export const NavAccountMenu = ({
    className,
    account,
    onSignOut,
    ...dialogProps
}: AriaDialogProps & { 
    className?: string; 
    account?: NavAccountType | null;
    onSignOut?: () => void;
}) => {
    const focusManager = useFocusManager();
    const dialogRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const onKeyDown = useCallback(
        (e: KeyboardEvent) => {
            switch (e.key) {
                case "ArrowDown":
                    focusManager?.focusNext({ tabbable: true, wrap: true });
                    break;
                case "ArrowUp":
                    focusManager?.focusPrevious({ tabbable: true, wrap: true });
                    break;
            }
        },
        [focusManager],
    );

    useEffect(() => {
        const element = dialogRef.current;
        if (element) {
            element.addEventListener("keydown", onKeyDown);
        }

        return () => {
            if (element) {
                element.removeEventListener("keydown", onKeyDown);
            }
        };
    }, [onKeyDown]);

    const getRoleBadgeColor = (role?: string) => {
        switch (role) {
            case "owner": return "brand";
            case "admin": return "purple";
            default: return "gray";
        }
    };

    const formatRole = (role?: string) => {
        if (!role) return "Member";
        return role.charAt(0).toUpperCase() + role.slice(1);
    };

    return (
        <AriaDialog
            {...dialogProps}
            ref={dialogRef}
            className={cx("w-72 rounded-xl bg-secondary_alt shadow-lg ring ring-secondary_alt outline-hidden", className)}
        >
            <div className="rounded-xl bg-primary ring-1 ring-secondary">
                {/* User Info Card */}
                {account && (
                    <div className="border-b border-secondary p-3">
                        <div className="flex items-start gap-3">
                            <AvatarLabelGroup 
                                status="online" 
                                size="md" 
                                src={account.avatar || undefined}
                                initials={account.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                                title={account.name} 
                                subtitle={account.email} 
                            />
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                            <Badge color={getRoleBadgeColor(account.role)} size="sm">
                                {formatRole(account.role)}
                            </Badge>
                            {account.memberSince && (
                                <div className="flex items-center gap-1 text-xs text-tertiary">
                                    <Calendar className="size-3" />
                                    <span>Joined {account.memberSince}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex flex-col gap-0.5 py-1.5">
                    <NavAccountCardMenuItem 
                        label="View profile" 
                        icon={User01} 
                        onClick={() => router.push("/settings?tab=profile")}
                    />
                    <NavAccountCardMenuItem 
                        label="Account settings" 
                        icon={Settings01} 
                        onClick={() => router.push("/settings")}
                    />
                    <NavAccountCardMenuItem 
                        label="Documentation" 
                        icon={BookOpen01} 
                        onClick={() => window.open("https://docs.protectron.ai", "_blank")}
                    />
                </div>
            </div>

            <div className="pt-1 pb-1.5">
                <NavAccountCardMenuItem 
                    label="Sign out" 
                    icon={LogOut01} 
                    onClick={onSignOut}
                />
            </div>
        </AriaDialog>
    );
};

const NavAccountCardMenuItem = ({
    icon: Icon,
    label,
    shortcut,
    ...buttonProps
}: {
    icon?: FC<{ className?: string }>;
    label: string;
    shortcut?: string;
} & HTMLAttributes<HTMLButtonElement>) => {
    return (
        <button {...buttonProps} className={cx("group/item w-full cursor-pointer px-1.5 focus:outline-hidden", buttonProps.className)}>
            <div
                className={cx(
                    "flex w-full items-center justify-between gap-3 rounded-md p-2 group-hover/item:bg-primary_hover",
                    // Focus styles.
                    "outline-focus-ring group-focus-visible/item:outline-2 group-focus-visible/item:outline-offset-2",
                )}
            >
                <div className="flex gap-2 text-sm font-semibold text-secondary group-hover/item:text-secondary_hover">
                    {Icon && <Icon className="size-5 text-fg-quaternary" />} {label}
                </div>

                {shortcut && (
                    <kbd className="flex rounded px-1 py-px font-body text-xs font-medium text-tertiary ring-1 ring-secondary ring-inset">{shortcut}</kbd>
                )}
            </div>
        </button>
    );
};

export const NavAccountCard = ({
    popoverPlacement,
}: {
    popoverPlacement?: Placement;
}) => {
    const triggerRef = useRef<HTMLDivElement>(null);
    const isDesktop = useBreakpoint("lg");
    const router = useRouter();
    const [account, setAccount] = useState<NavAccountType | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch user data from Supabase
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();
                
                if (!user) {
                    setIsLoading(false);
                    return;
                }

                // Get profile data
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("full_name, avatar_url, role, created_at")
                    .eq("id", user.id)
                    .single();

                // Format the join date
                const joinDate = profile?.created_at 
                    ? new Date(profile.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })
                    : undefined;

                setAccount({
                    id: user.id,
                    name: profile?.full_name || user.email?.split("@")[0] || "User",
                    email: user.email || "",
                    avatar: profile?.avatar_url || null,
                    status: "online",
                    role: profile?.role || "member",
                    memberSince: joinDate,
                });
            } catch (err) {
                console.error("Error fetching user data:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

    // Handle sign out
    const handleSignOut = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/");
    };

    if (isLoading) {
        return (
            <div className="relative flex items-center gap-3 rounded-xl p-3 ring-1 ring-secondary ring-inset animate-pulse">
                <div className="h-10 w-10 rounded-full bg-secondary" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 w-24 rounded bg-secondary" />
                    <div className="h-3 w-32 rounded bg-secondary" />
                </div>
            </div>
        );
    }

    if (!account) {
        return null;
    }

    return (
        <div ref={triggerRef} className="relative flex items-center gap-3 rounded-xl p-3 ring-1 ring-secondary ring-inset">
            <AvatarLabelGroup
                size="md"
                src={account.avatar || undefined}
                initials={account.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                title={account.name}
                subtitle={account.email}
                status={account.status}
            />

            <div className="absolute top-1.5 right-1.5">
                <AriaDialogTrigger>
                    <AriaButton className="flex cursor-pointer items-center justify-center rounded-md p-1.5 text-fg-quaternary outline-focus-ring transition duration-100 ease-linear hover:bg-primary_hover hover:text-fg-quaternary_hover focus-visible:outline-2 focus-visible:outline-offset-2 pressed:bg-primary_hover pressed:text-fg-quaternary_hover">
                        <ChevronSelectorVertical className="size-4 shrink-0" />
                    </AriaButton>
                    <AriaPopover
                        placement={popoverPlacement ?? (isDesktop ? "right bottom" : "top right")}
                        triggerRef={triggerRef}
                        offset={8}
                        className={({ isEntering, isExiting }) =>
                            cx(
                                "origin-(--trigger-anchor-point) will-change-transform",
                                isEntering &&
                                    "duration-150 ease-out animate-in fade-in placement-right:slide-in-from-left-0.5 placement-top:slide-in-from-bottom-0.5 placement-bottom:slide-in-from-top-0.5",
                                isExiting &&
                                    "duration-100 ease-in animate-out fade-out placement-right:slide-out-to-left-0.5 placement-top:slide-out-to-bottom-0.5 placement-bottom:slide-out-to-top-0.5",
                            )
                        }
                    >
                        <NavAccountMenu account={account} onSignOut={handleSignOut} />
                    </AriaPopover>
                </AriaDialogTrigger>
            </div>
        </div>
    );
};
