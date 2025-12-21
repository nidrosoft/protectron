"use client";

import { useState } from "react";
import { Add, Sms, Card as CardIcon } from "iconsax-react";
import { SlideoutMenu } from "@/components/application/slideout-menus/slideout-menu";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { RadioGroupPaymentIcon } from "@/components/base/radio-groups/radio-group-payment-icon";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { VisaIcon, MastercardIcon, ApplePayIcon } from "@/components/foundations/payment-icons";

interface PaymentCard {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

interface PaymentMethodSlideoutProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  paymentMethods?: PaymentCard[];
  onAddCard?: () => Promise<void>;
  onSetDefault?: (cardId: string) => Promise<void>;
  onRemoveCard?: (cardId: string) => Promise<void>;
  billingEmail?: string;
  onUpdateBillingEmail?: (email: string) => Promise<void>;
}

const getCardIcon = (brand: string) => {
  switch (brand.toLowerCase()) {
    case "visa":
      return <VisaIcon className="h-8 w-11.5" />;
    case "mastercard":
      return <MastercardIcon className="h-8 w-11.5" />;
    case "amex":
    case "american express":
      return <ApplePayIcon className="h-8 w-11.5" />;
    default:
      return <MastercardIcon className="h-8 w-11.5" />;
  }
};

export const PaymentMethodSlideout = ({
  isOpen,
  onOpenChange,
  paymentMethods = [],
  onAddCard,
  onSetDefault,
  billingEmail = "",
  onUpdateBillingEmail,
}: PaymentMethodSlideoutProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [email, setEmail] = useState(billingEmail);

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleAddCard = async () => {
    if (!onAddCard) return;
    setIsAddingCard(true);
    try {
      await onAddCard();
    } catch (error) {
      console.error("Failed to add card:", error);
      setIsAddingCard(false);
    }
  };

  const handleConfirm = async () => {
    if (email !== billingEmail && onUpdateBillingEmail) {
      setIsProcessing(true);
      try {
        await onUpdateBillingEmail(email);
      } catch (error) {
        console.error("Failed to update billing email:", error);
      } finally {
        setIsProcessing(false);
      }
    }
    handleClose();
  };

  const paymentCardItems = paymentMethods.map((card) => ({
    value: card.id,
    title: `${card.brand} ending in ${card.last4}`,
    description: `Expires ${card.expMonth.toString().padStart(2, "0")}/${card.expYear}${card.isDefault ? " • Default" : ""}`,
    logo: getCardIcon(card.brand),
  }));

  const defaultCardId = paymentMethods.find((c) => c.isDefault)?.id || paymentMethods[0]?.id;

  return (
    <SlideoutMenu.Trigger isOpen={isOpen} onOpenChange={onOpenChange}>
      <SlideoutMenu isDismissable>
        <SlideoutMenu.Header
          onClose={handleClose}
          className="relative flex w-full items-start gap-4 px-4 pt-6 md:px-6"
        >
          <FeaturedIcon size="md" color="gray" theme="modern" icon={CardIcon} />
          <section className="flex flex-col gap-0.5">
            <h1 className="text-md font-semibold text-primary md:text-lg">
              Payment methods
            </h1>
            <p className="text-sm text-tertiary">
              Manage your payment methods and billing contact.
            </p>
          </section>
        </SlideoutMenu.Header>

        <SlideoutMenu.Content>
          <section className="flex flex-col items-end gap-4">
            {paymentMethods.length > 0 ? (
              <RadioGroupPaymentIcon
                aria-label="Payment methods"
                defaultValue={defaultCardId}
                items={paymentCardItems}
                className="w-full"
                onChange={(value) => {
                  if (onSetDefault && value !== defaultCardId) {
                    onSetDefault(value);
                  }
                }}
              />
            ) : (
              <div className="flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-secondary bg-secondary_subtle py-8">
                <CardIcon size={32} className="text-quaternary" />
                <p className="mt-2 text-sm text-tertiary">No payment methods added</p>
                <p className="text-xs text-quaternary">Add a card to get started</p>
              </div>
            )}
            <Button
              size="md"
              color="link-color"
              iconLeading={Add}
              onClick={handleAddCard}
              isDisabled={isAddingCard}
            >
              {isAddingCard ? "Redirecting..." : "Add payment method"}
            </Button>
          </section>

          <div className="w-full border-t border-secondary" />

          <div className="flex flex-col gap-4">
            <section className="flex flex-col gap-1">
              <p className="text-sm font-medium text-secondary">Billing contact</p>
              <p className="text-sm text-tertiary">
                Invoices and receipts will be sent to this email.
              </p>
            </section>
            <Input
              size="md"
              isRequired
              icon={Sms}
              placeholder="Email"
              label="Email address"
              value={email}
              onChange={setEmail}
            />
          </div>
        </SlideoutMenu.Content>

        <SlideoutMenu.Footer className="flex w-full justify-end gap-3">
          <Button size="md" color="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button size="md" onClick={handleConfirm} isDisabled={isProcessing}>
            {isProcessing ? "Saving..." : "Done"}
          </Button>
        </SlideoutMenu.Footer>
      </SlideoutMenu>
    </SlideoutMenu.Trigger>
  );
};

export default PaymentMethodSlideout;
