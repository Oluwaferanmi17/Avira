import crypto from "crypto";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-paystack-signature");

    if (!signature) {
      return new NextResponse("No signature provided", { status: 401 });
    }

    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
      .update(body)
      .digest("hex");

    if (hash !== signature) {
      return new NextResponse("Invalid signature", { status: 401 });
    }

    const event = JSON.parse(body);

    if (event.event === "charge.success") {
      const reference = event.data.reference;
      const paymentId = Number(reference.replace("PAY_", ""));

      // 1. Update Payment record
      const payment = await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: "PAID",
          providerTxId: event.data.id.toString(),
          metadata: event.data
        },
      });

      // 2. Update associated booking
      const bookingUpdateData = { paymentStatus: "PAID" as const };

      if (payment.bookingType === "STAY") {
        await prisma.stayBooking.update({
          where: { id: payment.bookingId },
          data: bookingUpdateData,
        });
      } else if (payment.bookingType === "EVENT") {
        await prisma.eventBooking.update({
          where: { id: payment.bookingId },
          data: bookingUpdateData,
        });
      } else if (payment.bookingType === "EXPERIENCE") {
        await prisma.experienceBooking.update({
          where: { id: payment.bookingId },
          data: bookingUpdateData,
        });
      }

      console.log(`Payment ${paymentId} and associated ${payment.bookingType} booking updated via webhook.`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
