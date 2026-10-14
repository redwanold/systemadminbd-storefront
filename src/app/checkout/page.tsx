import type { Metadata } from "next";
import { CheckoutFlow } from "@/components/checkout-flow";

export const metadata: Metadata = {
  title: "Secure checkout",
  description: "Complete your Systemadminbd order.",
};

export default function CheckoutPage() {
  return <CheckoutFlow />;
}
