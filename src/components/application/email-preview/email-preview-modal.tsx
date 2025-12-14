"use client";

import { useState } from "react";
import {
  Sms,
  TickCircle,
  Warning2,
  InfoCircle,
  Clock,
  DocumentText1,
  Cpu,
  Calendar,
} from "iconsax-react";
import { DialogTrigger as AriaDialogTrigger, Heading as AriaHeading } from "react-aria-components";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";
import { cx } from "@/utils/cx";

type EmailType = 
  | "requirement-complete"
  | "deadline-reminder"
  | "document-generated"
  | "team-invite"
  | "compliance-achieved"
  | "weekly-summary";

interface EmailPreviewModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  emailType?: EmailType;
}

const emailTemplates: Record<EmailType, {
  subject: string;
  icon: typeof Sms;
  iconColor: string;
  iconBg: string;
  preview: React.ReactNode;
}> = {
  "requirement-complete": {
    subject: "Requirement Completed: Risk Management System",
    icon: TickCircle,
    iconColor: "text-success-600",
    iconBg: "bg-success-100",
    preview: (
      <div className="space-y-4">
        <p>Hi Cyriac,</p>
        <p>Great news! A requirement has been marked as complete for your AI system.</p>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success-100">
              <TickCircle size={16} className="text-success-600" variant="Bold" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Establish risk management system</p>
              <p className="text-sm text-gray-500">Automated Hiring Screener • Article 9</p>
            </div>
          </div>
        </div>
        <p>Your compliance progress is now at <strong>65%</strong>.</p>
        <div className="pt-2">
          <a href="#" className="inline-block rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white">
            View Requirement
          </a>
        </div>
      </div>
    ),
  },
  "deadline-reminder": {
    subject: "⚠️ Deadline Approaching: High-Risk AI Compliance",
    icon: Warning2,
    iconColor: "text-warning-600",
    iconBg: "bg-warning-100",
    preview: (
      <div className="space-y-4">
        <p>Hi Cyriac,</p>
        <p>This is a reminder that an important compliance deadline is approaching.</p>
        <div className="rounded-lg border border-warning-200 bg-warning-50 p-4">
          <div className="flex items-center gap-3">
            <Calendar size={20} className="text-warning-600" />
            <div>
              <p className="font-medium text-gray-900">High-Risk AI Compliance Deadline</p>
              <p className="text-sm text-warning-700">August 2, 2026 • 234 days remaining</p>
            </div>
          </div>
        </div>
        <p>You have <strong>2 AI systems</strong> that need attention:</p>
        <ul className="list-disc pl-5 space-y-1 text-gray-600">
          <li>Automated Hiring Screener (50% complete)</li>
          <li>Fraud Detection System (75% complete)</li>
        </ul>
        <div className="pt-2">
          <a href="#" className="inline-block rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white">
            View Dashboard
          </a>
        </div>
      </div>
    ),
  },
  "document-generated": {
    subject: "Document Generated: Technical Documentation",
    icon: DocumentText1,
    iconColor: "text-brand-600",
    iconBg: "bg-brand-100",
    preview: (
      <div className="space-y-4">
        <p>Hi Cyriac,</p>
        <p>Your compliance document has been generated successfully.</p>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center gap-3">
            <DocumentText1 size={20} className="text-brand-600" />
            <div>
              <p className="font-medium text-gray-900">Technical Documentation</p>
              <p className="text-sm text-gray-500">Customer Support Chatbot • 245 KB</p>
            </div>
          </div>
        </div>
        <p>The document is ready for review in your Documents library.</p>
        <div className="pt-2 flex gap-3">
          <a href="#" className="inline-block rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white">
            View Document
          </a>
          <a href="#" className="inline-block rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700">
            Download PDF
          </a>
        </div>
      </div>
    ),
  },
  "team-invite": {
    subject: "You've been invited to join Acme Corporation on ComplyAI",
    icon: Sms,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-100",
    preview: (
      <div className="space-y-4">
        <p>Hi there,</p>
        <p><strong>Cyriac</strong> has invited you to join <strong>Acme Corporation</strong> on ComplyAI.</p>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-600 font-semibold">
              AC
            </div>
            <div>
              <p className="font-medium text-gray-900">Acme Corporation</p>
              <p className="text-sm text-gray-500">Technology / SaaS • 3 team members</p>
            </div>
          </div>
        </div>
        <p>As a team member, you'll be able to:</p>
        <ul className="list-disc pl-5 space-y-1 text-gray-600">
          <li>View and manage AI systems</li>
          <li>Generate compliance documents</li>
          <li>Upload evidence files</li>
        </ul>
        <div className="pt-2">
          <a href="#" className="inline-block rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white">
            Accept Invitation
          </a>
        </div>
        <p className="text-sm text-gray-500">This invitation expires in 7 days.</p>
      </div>
    ),
  },
  "compliance-achieved": {
    subject: "🎉 Congratulations! Your AI System is Now Compliant",
    icon: TickCircle,
    iconColor: "text-success-600",
    iconBg: "bg-success-100",
    preview: (
      <div className="space-y-4">
        <p>Hi Cyriac,</p>
        <p>Congratulations! Your AI system has achieved full EU AI Act compliance.</p>
        <div className="rounded-lg border border-success-200 bg-success-50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success-100">
              <Cpu size={20} className="text-success-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Customer Support Chatbot</p>
              <p className="text-sm text-success-700">✓ All 8 requirements complete</p>
            </div>
          </div>
        </div>
        <p>You can now:</p>
        <ul className="list-disc pl-5 space-y-1 text-gray-600">
          <li>Generate a compliance report</li>
          <li>Download your compliance badge</li>
          <li>Share your Trust Center page</li>
        </ul>
        <div className="pt-2 flex gap-3">
          <a href="#" className="inline-block rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white">
            View AI System
          </a>
          <a href="#" className="inline-block rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700">
            Get Badge
          </a>
        </div>
      </div>
    ),
  },
  "weekly-summary": {
    subject: "Your Weekly Compliance Summary",
    icon: InfoCircle,
    iconColor: "text-gray-600",
    iconBg: "bg-gray-100",
    preview: (
      <div className="space-y-4">
        <p>Hi Cyriac,</p>
        <p>Here's your weekly compliance summary for Acme Corporation.</p>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Overall Compliance</span>
            <span className="font-semibold text-gray-900">72%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div className="h-2 rounded-full bg-brand-500" style={{ width: "72%" }} />
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <p className="text-2xl font-bold text-gray-900">5</p>
              <p className="text-sm text-gray-500">AI Systems</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-success-600">+3</p>
              <p className="text-sm text-gray-500">Requirements completed</p>
            </div>
          </div>
        </div>
        <p><strong>This week's activity:</strong></p>
        <ul className="list-disc pl-5 space-y-1 text-gray-600">
          <li>2 documents generated</li>
          <li>3 requirements marked complete</li>
          <li>1 evidence file uploaded</li>
        </ul>
        <div className="pt-2">
          <a href="#" className="inline-block rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white">
            View Full Dashboard
          </a>
        </div>
      </div>
    ),
  },
};

const emailTypeLabels: Record<EmailType, string> = {
  "requirement-complete": "Requirement Complete",
  "deadline-reminder": "Deadline Reminder",
  "document-generated": "Document Generated",
  "team-invite": "Team Invitation",
  "compliance-achieved": "Compliance Achieved",
  "weekly-summary": "Weekly Summary",
};

export const EmailPreviewModal = ({
  isOpen,
  onOpenChange,
  emailType: initialType = "requirement-complete",
}: EmailPreviewModalProps) => {
  const [selectedType, setSelectedType] = useState<EmailType>(initialType);
  const template = emailTemplates[selectedType];
  const Icon = template.icon;

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <AriaDialogTrigger isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalOverlay isDismissable>
        <Modal>
          <Dialog>
            <div className="relative w-full overflow-hidden rounded-2xl bg-primary shadow-xl sm:max-w-3xl">
              <CloseButton
                onClick={handleClose}
                theme="light"
                size="lg"
                className="absolute top-4 right-4 z-20"
              />

              {/* Header */}
              <div className="border-b border-secondary px-6 py-5">
                <AriaHeading slot="title" className="text-lg font-semibold text-primary">
                  Email Notification Preview
                </AriaHeading>
                <p className="mt-1 text-sm text-tertiary">
                  Preview how email notifications will appear to recipients
                </p>
              </div>

              {/* Content */}
              <div className="flex max-h-[70vh]">
                {/* Email Type Selector */}
                <div className="w-56 shrink-0 border-r border-secondary bg-secondary_subtle p-4">
                  <p className="mb-3 text-xs font-medium uppercase tracking-wide text-tertiary">
                    Email Types
                  </p>
                  <div className="flex flex-col gap-1">
                    {(Object.keys(emailTemplates) as EmailType[]).map((type) => {
                      const tmpl = emailTemplates[type];
                      const TypeIcon = tmpl.icon;
                      return (
                        <button
                          key={type}
                          onClick={() => setSelectedType(type)}
                          className={cx(
                            "flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-all",
                            selectedType === type
                              ? "bg-brand-100 text-brand-700"
                              : "text-secondary hover:bg-secondary"
                          )}
                        >
                          <TypeIcon size={16} color="currentColor" className={selectedType === type ? "text-brand-600" : "text-tertiary"} />
                          <span className="truncate">{emailTypeLabels[type]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Email Preview */}
                <div className="flex-1 overflow-y-auto p-6">
                  {/* Email Header */}
                  <div className="rounded-t-lg border border-b-0 border-gray-200 bg-gray-50 p-4">
                    <div className="flex items-center gap-3">
                      <div className={cx("flex h-10 w-10 items-center justify-center rounded-lg", template.iconBg)}>
                        <Icon size={20} color="currentColor" className={template.iconColor} variant="Bold" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {template.subject}
                        </p>
                        <p className="text-xs text-gray-500">
                          From: ComplyAI &lt;notifications@complyai.com&gt;
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Email Body */}
                  <div className="rounded-b-lg border border-gray-200 bg-white p-6">
                    {/* Logo */}
                    <div className="mb-6 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
                        <span className="text-sm font-bold text-white">C</span>
                      </div>
                      <span className="font-semibold text-gray-900">ComplyAI</span>
                    </div>

                    {/* Content */}
                    <div className="text-sm text-gray-600 leading-relaxed">
                      {template.preview}
                    </div>

                    {/* Footer */}
                    <div className="mt-8 border-t border-gray-100 pt-6">
                      <p className="text-xs text-gray-400 text-center">
                        You're receiving this email because you have notifications enabled for your ComplyAI account.
                        <br />
                        <a href="#" className="text-brand-600 hover:underline">Manage preferences</a>
                        {" • "}
                        <a href="#" className="text-brand-600 hover:underline">Unsubscribe</a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end border-t border-secondary px-6 py-4">
                <Button size="md" color="secondary" onClick={handleClose}>
                  Close
                </Button>
              </div>
            </div>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </AriaDialogTrigger>
  );
};

export default EmailPreviewModal;
