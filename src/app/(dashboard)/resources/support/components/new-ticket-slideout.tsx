"use client";

import { useState } from "react";
import { SlideoutMenu } from "@/components/application/slideout-menus/slideout-menu";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { createClient } from "@/lib/supabase/client";
import { cx } from "@/utils/cx";

interface NewTicketSlideoutProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onTicketCreated: () => void;
}

const categories = [
  { value: "bug", label: "Bug Report" },
  { value: "feature", label: "Feature Request" },
  { value: "billing", label: "Billing" },
  { value: "compliance", label: "Compliance" },
  { value: "account", label: "Account" },
  { value: "other", label: "Other" },
];

const priorities = [
  { value: "low", label: "Low" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

export const NewTicketSlideout = ({
  isOpen,
  onOpenChange,
  onTicketCreated,
}: NewTicketSlideoutProps) => {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("other");
  const [priority, setPriority] = useState("normal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const handleSubmit = async () => {
    if (!subject.trim() || !description.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("You must be logged in to submit a ticket.");
        return;
      }

      // Get user profile for organization_id
      const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id, full_name")
        .eq("id", user.id)
        .single();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: insertError } = await (supabase as any)
        .from("support_tickets")
        .insert({
          user_id: user.id,
          organization_id: profile?.organization_id || null,
          subject: subject.trim(),
          description: description.trim(),
          category,
          priority,
          user_email: user.email,
          user_name: profile?.full_name || user.email?.split("@")[0],
        });

      if (insertError) {
        console.error("Error creating ticket:", insertError);
        setError("Failed to create ticket. Please try again.");
        return;
      }

      // Send email notification to support team
      try {
        await fetch("/api/v1/support", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject: subject.trim(),
            description: description.trim(),
            category,
            priority,
            userEmail: user.email,
            userName: profile?.full_name || user.email?.split("@")[0],
          }),
        });
      } catch (emailError) {
        // Don't fail the ticket creation if email fails
        console.error("Failed to send email notification:", emailError);
      }

      // Reset form
      setSubject("");
      setDescription("");
      setCategory("other");
      setPriority("normal");
      onTicketCreated();
    } catch (err) {
      console.error("Error:", err);
      setError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubject("");
    setDescription("");
    setCategory("other");
    setPriority("normal");
    setError(null);
    onOpenChange(false);
  };

  return (
    <SlideoutMenu.Trigger isOpen={isOpen} onOpenChange={onOpenChange}>
      <SlideoutMenu isDismissable>
        <SlideoutMenu.Header
          onClose={handleClose}
          className="relative flex w-full flex-col gap-0.5 px-4 pt-6 md:px-6"
        >
          <h1 className="text-md font-semibold text-primary md:text-lg">
            New Support Ticket
          </h1>
          <p className="text-sm text-tertiary">
            Describe your issue and we'll get back to you as soon as possible.
          </p>
        </SlideoutMenu.Header>

        <SlideoutMenu.Content>
          <div className="flex flex-col gap-5">
            {error && (
              <div className="rounded-lg bg-error-50 p-3 text-sm text-error-700">
                {error}
              </div>
            )}

            {/* Subject */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="subject" className="text-sm font-medium text-secondary">
                Subject <span className="text-error-500">*</span>
              </label>
              <Input
                id="subject"
                placeholder="Brief summary of your issue"
                value={subject}
                onChange={setSubject}
              />
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="category" className="text-sm font-medium text-secondary">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-secondary bg-primary px-3 py-2.5 text-sm text-primary shadow-xs outline-none focus:border-brand-300 focus:ring-4 focus:ring-brand-100"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-secondary">Priority</label>
              <div className="flex flex-wrap gap-2">
                {priorities.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPriority(p.value)}
                    className={cx(
                      "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                      priority === p.value
                        ? "border-brand-300 bg-brand-50 text-brand-700"
                        : "border-secondary bg-primary text-secondary hover:bg-secondary_subtle"
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="description" className="text-sm font-medium text-secondary">
                Description <span className="text-error-500">*</span>
              </label>
              <textarea
                id="description"
                placeholder="Please describe your issue in detail. Include any relevant information that might help us assist you."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="w-full rounded-lg border border-secondary bg-primary px-3 py-2.5 text-sm text-primary shadow-xs outline-none placeholder:text-placeholder focus:border-brand-300 focus:ring-4 focus:ring-brand-100 resize-none"
              />
              <p className="text-xs text-tertiary">
                The more detail you provide, the faster we can help.
              </p>
            </div>
          </div>
        </SlideoutMenu.Content>

        <SlideoutMenu.Footer className="flex w-full items-center justify-end gap-3">
          <Button size="md" color="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            size="md"
            color="primary"
            onClick={handleSubmit}
            disabled={isSubmitting || !subject.trim() || !description.trim()}
          >
            {isSubmitting ? "Submitting..." : "Submit Ticket"}
          </Button>
        </SlideoutMenu.Footer>
      </SlideoutMenu>
    </SlideoutMenu.Trigger>
  );
};

export default NewTicketSlideout;
