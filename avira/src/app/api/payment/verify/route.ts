import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const reference = searchParams.get("reference");

    if (!reference) {
      return NextResponse.json(
        { error: "Missing payment reference" },
        { status: 400 },
      );
    }

    // 1. Verify with Paystack
    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      },
    );

    const data = await res.json();

    if (!data.status || data.data.status !== "success") {
      return NextResponse.json(
        { error: "Payment verification failed", details: data.message },
        { status: 400 },
      );
    }

    // 2. Update Payment record
    const paymentId = Number(reference.replace("PAY_", ""));
    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: "PAID",
        providerTxId: data.data.id.toString(),
        metadata: data.data,
      },
    });

    // 3. Update associated booking
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

    return NextResponse.json({ ok: true, message: "Payment verified and booking updated" });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
