import { Resend } from "resend";

type OrderConfirmationInput = {
  to: string;
  customerName: string;
  orderId: string;
  items: { title: string; price: number; quantity: number }[];
  total: number;
};

// Using Resend's shared "onboarding@resend.dev" sender works immediately
// with no setup, but looks less professional and Resend may rate-limit it
// more strictly. Once you verify your own domain in Resend's dashboard
// (Domains -> Add Domain, then a few DNS records), change this to
// something like "MMboutique <orders@yourdomain.com>".
const FROM_ADDRESS = "MMboutique <onboarding@resend.dev>";

export async function sendOrderConfirmationEmail(input: OrderConfirmationInput) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — skipping order confirmation email.");
    return;
  }

  const resend = new Resend(apiKey);

  const itemLines = input.items
    .map(
      (item) =>
        `- ${item.title} × ${item.quantity} (£${(item.price * item.quantity).toFixed(2)})`
    )
    .join("\n");

  await resend.emails.send({
    from: FROM_ADDRESS,
    to: input.to,
    subject: `Your order is confirmed — #${input.orderId.slice(0, 8)}`,
    text: `Thanks for your order, ${input.customerName}!

Order reference: ${input.orderId}
Total: £${input.total.toFixed(2)}

${itemLines}

We'll be in touch about delivery. If anything looks wrong, just reply to this email.`
  });
}
