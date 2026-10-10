import { Resend } from "resend";

type OrderConfirmationInput = {
  to: string;
  customerName: string;
  orderNumber: number;
  items: { title: string; price: number; quantity: number }[];
  total: number;
};

// IMPORTANT LIMITATION: Resend's shared "onboarding@resend.dev" test
// sender can ONLY deliver to the email address you signed up to Resend
// with. Sending to anyone else (i.e. a real customer) is rejected by
// Resend, which is why checkout emails stop arriving as soon as you test
// with a different address. To email real customers you must verify a
// domain you own in Resend (Domains -> Add Domain, then add the DNS
// records it gives you at your domain registrar), then change this to
// something like "MMBoutique <orders@yourdomain.com>".
const FROM_ADDRESS = "MMBoutique <onboarding@resend.dev>";

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

  // Resend does NOT throw when it rejects a send (bad key, unverified
  // recipient, rate limit...). It returns { data, error } instead — so
  // the result has to be checked explicitly, or failures vanish without
  // a trace. Throwing here lets the caller log the real reason.
  const { data, error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to: input.to,
    subject: `Your order is confirmed — #${input.orderNumber}`,
    text: `Thanks for your order, ${input.customerName}!

Order number: #${input.orderNumber}
Total: £${input.total.toFixed(2)}

${itemLines}

We'll be in touch about delivery. If anything looks wrong, just reply to this email.`
  });

  if (error) {
    throw new Error(`Resend rejected the email (${error.name}): ${error.message}`);
  }

  console.log(`Order #${input.orderNumber} confirmation sent to ${input.to} (Resend id: ${data?.id})`);
}
