"use client";

import { useMemo, useState } from "react";
import {
    BarChartSquare02,
    CheckDone01,
    Edit01,
    FilterLines,
    HomeLine,
    PieChart03,
    Plus,
    Rows01,
    SearchLg,
    Trash01,
    UploadCloud02,
    Users01,
    XClose,
} from "@untitledui/icons";
import type { SortDescriptor } from "react-aria-components";
import { FeaturedCardQRCode } from "@/components/application/app-navigation/base-components/featured-cards";
import { SidebarNavigationDualTier } from "@/components/application/app-navigation/sidebar-navigation/sidebar-dual-tier";
import { MetricsChart04 } from "@/components/application/metrics/metrics";
import { PaginationCardMinimal } from "@/components/application/pagination/pagination";
import { Table, TableCard } from "@/components/application/table/table";
import { Avatar } from "@/components/base/avatar/avatar";
import { BadgeWithButton, BadgeWithDot } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { Input } from "@/components/base/input/input";
import { ProgressBar } from "@/components/base/progress-indicators/progress-indicators";

const customers = [
    {
        id: "customer-01",
        company: {
            name: "Ephemeral",
            website: "ephemeral.io",
            imageUrl: "https://www.untitledui.com/logos/images/Ephemeral.jpg",
        },
        about: {
            title: "Content curating app",
            description: "Brings all your news into one place",
        },
        license_use: 70,
        status: "customer",
    },
    {
        id: "customer-02",
        company: {
            name: "Stack3d Lab",
            website: "stack3dlab.com",
            imageUrl: "https://www.untitledui.com/logos/images/Stack3d Lab.jpg",
        },
        about: {
            title: "Design software",
            description: "Super lightweight design app",
        },
        license_use: 60,
        status: "churned",
    },
    {
        id: "customer-03",
        company: {
            name: "Warpspeed",
            website: "getwarpspeed.com",
            imageUrl: "https://www.untitledui.com/logos/images/Warpspeed.jpg",
        },
        about: {
            title: "Data prediction",
            description: "AI and machine learning data",
        },
        license_use: 30,
        status: "customer",
    },
    {
        id: "customer-04",
        company: {
            name: "CloudWatch",
            website: "cloudwatch.app",
            imageUrl: "https://www.untitledui.com/logos/images/CloudWatch.jpg",
        },
        about: {
            title: "Productivity app",
            description: "Time management and productivity",
        },
        license_use: 80,
        status: "customer",
    },
    {
        id: "customer-05",
        company: {
            name: "ContrastAI",
            website: "contrastai.com",
            imageUrl: "https://www.untitledui.com/logos/images/ContrastAI.jpg",
        },
        about: {
            title: "Web app integrations",
            description: "Connect web apps seamlessly",
        },
        license_use: 20,
        status: "churned",
    },
    {
        id: "customer-06",
        company: {
            name: "Convergence",
            website: "convergence.io",
            imageUrl: "https://www.untitledui.com/logos/images/Convergence.jpg",
        },
        about: {
            title: "Sales CRM",
            description: "Web-based sales doc management",
        },
        license_use: 10,
        status: "customer",
    },
    {
        id: "customer-07",
        company: {
            name: "Sisyphus",
            website: "sisyphus.com",
            imageUrl: "https://www.untitledui.com/logos/images/Sisyphus.jpg",
        },
        about: {
            title: "Automation and workflow",
            description: "Time tracking, invoicing and expenses",
        },
        license_use: 40,
        status: "customer",
    },
];

export const Dashboard07 = () => {
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>();

    const sortedItems = useMemo(() => {
        if (!sortDescriptor) return customers;

        return customers.toSorted((a, b) => {
            let first = a[sortDescriptor.column as keyof typeof a];
            let second = b[sortDescriptor.column as keyof typeof b];

            // Extract name from objects if needed
            if (typeof first === "object" && first && "name" in first) {
                first = first.name;
            }
            if (typeof second === "object" && second && "name" in second) {
                second = second.name;
            }

            // Handle numbers
            if (typeof first === "number" && typeof second === "number") {
                return sortDescriptor.direction === "ascending" ? first - second : second - first;
            }

            // Handle strings
            if (typeof first === "string" && typeof second === "string") {
                const result = first.localeCompare(second);
                return sortDescriptor.direction === "ascending" ? result : -result;
            }

            return 0;
        });
    }, [sortDescriptor]);

    return (
        <div className="flex flex-col bg-primary lg:flex-row">
            <SidebarNavigationDualTier
                hideBorder
                activeUrl="/dashboard"
                items={[
                    {
                        label: "Home",
                        href: "/",
                        icon: HomeLine,
                    },
                    {
                        label: "Dashboard",
                        href: "/dashboard",
                        icon: BarChartSquare02,
                    },
                    {
                        label: "Projects",
                        href: "/projects",
                        icon: Rows01,
                    },
                    {
                        label: "Tasks",
                        href: "/tasks",
                        icon: CheckDone01,
                        badge: 8,
                    },
                    {
                        label: "Reporting",
                        href: "/reporting",
                        icon: PieChart03,
                    },
                    {
                        label: "Users",
                        href: "/users",
                        icon: Users01,
                    },
                ]}
                featureCard={
                    <FeaturedCardQRCode
                        title="Verify this device"
                        description="Open the app and scan the QR code below to verify this device."
                        confirmLabel="Verify another way"
                        onConfirm={() => {}}
                        onDismiss={() => {}}
                    />
                }
            />
            <main className="min-w-0 flex-1 lg:pt-2">
                <div className="relative flex h-full flex-col gap-8 border-secondary pt-8 pb-12 shadow-xs lg:rounded-tl-[40px] lg:border-t lg:border-l">
                    <div className="flex flex-col justify-between gap-4 px-4 lg:flex-row lg:px-8">
                        <div className="flex flex-col gap-0.5 lg:gap-1">
                            <p className="text-xl font-semibold text-primary lg:text-display-xs">Welcome back, Olivia</p>
                            <p className="text-md text-tertiary">Track, manage and forecast your customers and orders.</p>
                        </div>
                        <div className="flex gap-3">
                            <Button size="md" color="secondary" iconLeading={UploadCloud02}>
                                Import
                            </Button>
                            <Button size="md" iconLeading={Plus}>
                                Add
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-5 px-4 md:flex-row md:flex-wrap lg:gap-6 lg:px-8">
                        <MetricsChart04
                            className="flex-1 md:min-w-[320px]"
                            title="2,420"
                            subtitle="Total customers"
                            change="40%"
                            type="trend"
                            changeTrend="positive"
                            chartCurveType="linear"
                            chartColor="text-fg-success-secondary"
                            changeDescription="vs last month"
                            chartData={[
                                { value: 8 },
                                { value: 10 },
                                { value: 11 },
                                { value: 16 },
                                { value: 17 },
                                { value: 18 },
                                { value: 16 },
                                { value: 19 },
                                { value: 20 },
                                { value: 22 },
                                { value: 19 },
                                { value: 22 },
                            ]}
                        />
                        <MetricsChart04
                            className="flex-1 md:min-w-[320px]"
                            title="1,210"
                            subtitle="Members"
                            change="10%"
                            type="trend"
                            chartCurveType="linear"
                            changeTrend="negative"
                            chartColor="text-fg-error-secondary"
                            changeDescription="vs last month"
                            chartData={[
                                { value: 22 },
                                { value: 19 },
                                { value: 22 },
                                { value: 20 },
                                { value: 19 },
                                { value: 16 },
                                { value: 18 },
                                { value: 17 },
                                { value: 16 },
                                { value: 11 },
                                { value: 10 },
                                { value: 8 },
                            ]}
                        />
                        <MetricsChart04
                            className="flex-1 md:min-w-[320px]"
                            title="316"
                            subtitle="Active now"
                            change="20%"
                            type="trend"
                            chartCurveType="linear"
                            changeTrend="positive"
                            chartColor="text-fg-success-secondary"
                            changeDescription="vs last month"
                            chartData={[
                                { value: 5 },
                                { value: 9 },
                                { value: 7 },
                                { value: 8 },
                                { value: 9 },
                                { value: 10 },
                                { value: 13 },
                                { value: 9 },
                                { value: 10 },
                                { value: 11 },
                                { value: 13 },
                                { value: 9 },
                                { value: 11 },
                                { value: 10 },
                                { value: 8 },
                                { value: 17 },
                                { value: 16 },
                                { value: 19 },
                                { value: 22 },
                                { value: 18 },
                                { value: 17 },
                                { value: 16 },
                                { value: 17 },
                                { value: 19 },
                                { value: 15 },
                                { value: 16 },
                                { value: 15 },
                                { value: 17 },
                            ]}
                        />
                    </div>

                    <div className="flex w-full flex-col gap-6 px-4 lg:px-8">
                        <div className="hidden justify-between gap-4 lg:flex">
                            <div className="flex gap-3">
                                <Button iconTrailing={XClose} size="md" color="secondary">
                                    All time
                                </Button>
                                <Button iconTrailing={XClose} size="md" color="secondary">
                                    US, AU, +4
                                </Button>
                                <Button iconLeading={FilterLines} size="md" color="secondary">
                                    More filters
                                </Button>
                            </div>
                            <Input icon={SearchLg} shortcut aria-label="Search" placeholder="Search" size="sm" className="w-80" />
                        </div>
                        <div className="flex flex-col gap-3 lg:hidden">
                            <Input icon={SearchLg} shortcut aria-label="Search" placeholder="Search" size="sm" />
                            <Button iconLeading={FilterLines} size="md" color="secondary">
                                More filters
                            </Button>
                            <div className="flex gap-3">
                                <BadgeWithButton color="gray" size="md" type="modern" buttonLabel="Clear" onButtonClick={() => {}}>
                                    All time
                                </BadgeWithButton>
                                <BadgeWithButton color="gray" size="md" type="modern" buttonLabel="Clear" onButtonClick={() => {}}>
                                    US, AU, +4
                                </BadgeWithButton>
                            </div>
                        </div>

                        <TableCard.Root className="-mx-4 rounded-none lg:mx-0 lg:rounded-xl">
                            <Table
                                aria-label="Trades"
                                selectionMode="multiple"
                                defaultSelectedKeys={["customer-01", "customer-02", "customer-03", "customer-06", "customer-07"]}
                                sortDescriptor={sortDescriptor}
                                onSortChange={setSortDescriptor}
                            >
                                <Table.Header className="bg-primary">
                                    <Table.Head id="company" isRowHeader allowsSorting label="Company" className="w-full" />
                                    <Table.Head id="license_use" label="License use" className="lg:min-w-34" />
                                    <Table.Head id="status" label="Status" />
                                    <Table.Head id="users" label="Users" allowsSorting />
                                    <Table.Head id="about" label="About" />
                                    <Table.Head id="actions" />
                                </Table.Header>
                                <Table.Body items={sortedItems}>
                                    {(customer) => (
                                        <Table.Row id={customer.id} highlightSelectedRow={false}>
                                            <Table.Cell className="lg:px-2">
                                                <div className="group flex items-center gap-3">
                                                    <Avatar src={customer.company.imageUrl} alt={customer.company.name} size="md" />
                                                    <div>
                                                        <p className="text-sm font-medium text-primary">{customer.company.name}</p>
                                                        <p className="text-sm text-tertiary">{customer.company.website}</p>
                                                    </div>
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <ProgressBar min={0} max={100} value={customer.license_use} />
                                            </Table.Cell>
                                            <Table.Cell>
                                                <BadgeWithDot
                                                    size="sm"
                                                    type="modern"
                                                    color={customer.status === "customer" ? "success" : "gray"}
                                                    className="capitalize"
                                                >
                                                    {customer.status}
                                                </BadgeWithDot>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <div className="flex -space-x-1">
                                                    <Avatar
                                                        className="ring-[1.5px] ring-bg-primary"
                                                        size="xs"
                                                        src="https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80"
                                                        alt="Olivia Rhye"
                                                    />
                                                    <Avatar
                                                        className="ring-[1.5px] ring-bg-primary"
                                                        size="xs"
                                                        src="https://www.untitledui.com/images/avatars/phoenix-baker?fm=webp&q=80"
                                                        alt="Phoenix Baker"
                                                    />
                                                    <Avatar
                                                        className="ring-[1.5px] ring-bg-primary"
                                                        size="xs"
                                                        src="https://www.untitledui.com/images/avatars/lana-steiner?fm=webp&q=80"
                                                        alt="Lana Steiner"
                                                    />
                                                    <Avatar
                                                        className="ring-[1.5px] ring-bg-primary"
                                                        size="xs"
                                                        src="https://www.untitledui.com/images/avatars/demi-wilkinson?fm=webp&q=80"
                                                        alt="Demi Wilkinson"
                                                    />

                                                    <Avatar
                                                        className="ring-[1.5px] ring-bg-primary"
                                                        size="xs"
                                                        src="https://www.untitledui.com/images/avatars/candice-wu?fm=webp&q=80"
                                                        alt="Candice Wu"
                                                    />
                                                    <Avatar
                                                        size="xs"
                                                        className="ring-[1.5px] ring-bg-primary"
                                                        placeholder={
                                                            <span className="flex items-center justify-center text-xs font-semibold text-quaternary">+5</span>
                                                        }
                                                    />
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <div>
                                                    <p className="text-sm font-medium text-primary">{customer.about.title}</p>
                                                    <p className="text-sm text-nowrap text-tertiary">{customer.about.description}</p>
                                                </div>
                                            </Table.Cell>

                                            <Table.Cell className="px-4">
                                                <div className="flex justify-end gap-0.5">
                                                    <ButtonUtility size="xs" color="tertiary" tooltip="Delete" icon={Trash01} />
                                                    <ButtonUtility size="xs" color="tertiary" tooltip="Edit" icon={Edit01} />
                                                </div>
                                            </Table.Cell>
                                        </Table.Row>
                                    )}
                                </Table.Body>
                            </Table>
                            <PaginationCardMinimal page={1} total={10} align="left" />
                        </TableCard.Root>
                    </div>
                </div>
            </main>
        </div>
    );
};
