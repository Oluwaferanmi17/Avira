import crypto from "crypto";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("x-paystack-signature")!;

  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
    .update(body)
    .digest("hex");

  if (hash !== signature) {
    return new NextResponse("Invalid signature", { status: 401 });
  }

  const event = JSON.parse(body);

  if (event.event === "charge.success") {
    const paymentId = Number(event.data.reference.replace("PAY_", ""));

    await prisma.payment.update({
      where: { id: paymentId },
      data: { status: "PAID" },
    });
  }

  return NextResponse.json({ received: true });
}
