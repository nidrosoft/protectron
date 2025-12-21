"use client";

import { DocumentDownload, ExportSquare } from "iconsax-react";
import { Button } from "@/components/base/buttons/button";
import { Badge } from "@/components/base/badges/badges";
import type { Invoice } from "@/hooks/use-billing";
import { LoadingIndicator } from "@/components/application/loading-indicator/loading-indicator";

interface BillingHistoryTableProps {
  invoices: Invoice[];
  isLoading?: boolean;
}

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "paid":
      return (
        <Badge size="sm" color="success">
          Paid
        </Badge>
      );
    case "open":
    case "draft":
      return (
        <Badge size="sm" color="warning">
          Pending
        </Badge>
      );
    case "void":
    case "uncollectible":
      return (
        <Badge size="sm" color="error">
          Failed
        </Badge>
      );
    default:
      return (
        <Badge size="sm" color="gray">
          {status}
        </Badge>
      );
  }
};

export const BillingHistoryTable = ({ invoices, isLoading }: BillingHistoryTableProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingIndicator type="dot-circle" size="md" label="Loading billing history..." />
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-secondary bg-secondary_subtle py-12">
        <DocumentDownload size={40} className="text-quaternary" />
        <p className="mt-3 text-sm font-medium text-secondary">No billing history</p>
        <p className="mt-1 text-sm text-tertiary">
          Your invoices will appear here once you subscribe to a plan.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-secondary">
      <table className="min-w-full divide-y divide-secondary">
        <thead className="bg-secondary_subtle">
          <tr>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-tertiary"
            >
              Invoice
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-tertiary"
            >
              Date
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-tertiary"
            >
              Amount
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-tertiary"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-tertiary"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-secondary bg-primary">
          {invoices.map((invoice) => (
            <tr key={invoice.id} className="hover:bg-secondary_subtle transition-colors">
              <td className="whitespace-nowrap px-4 py-4">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-primary">
                    {invoice.number || invoice.id.slice(0, 12)}
                  </span>
                  {invoice.description && (
                    <span className="text-xs text-tertiary truncate max-w-[200px]">
                      {invoice.description}
                    </span>
                  )}
                </div>
              </td>
              <td className="whitespace-nowrap px-4 py-4">
                <span className="text-sm text-secondary">{formatDate(invoice.createdAt)}</span>
              </td>
              <td className="whitespace-nowrap px-4 py-4">
                <span className="text-sm font-medium text-primary">
                  {formatCurrency(invoice.amount, invoice.currency)}
                </span>
              </td>
              <td className="whitespace-nowrap px-4 py-4">{getStatusBadge(invoice.status)}</td>
              <td className="whitespace-nowrap px-4 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  {invoice.hostedInvoiceUrl && (
                    <Button
                      size="sm"
                      color="link-gray"
                      iconLeading={ExportSquare}
                      onClick={() => window.open(invoice.hostedInvoiceUrl!, "_blank")}
                    >
                      View
                    </Button>
                  )}
                  {invoice.invoicePdf && (
                    <Button
                      size="sm"
                      color="link-color"
                      iconLeading={DocumentDownload}
                      onClick={() => window.open(invoice.invoicePdf!, "_blank")}
                    >
                      PDF
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BillingHistoryTable;
