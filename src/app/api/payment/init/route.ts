import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      bookingType,
      bookingId,
      amount, // already in kobo from frontend
      email,
      userId,
    } = body;

    if (!email || !amount || !bookingId || !bookingType || !userId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // 1. Create payment record
    const payment = await prisma.payment.create({
      data: {
        userId: Number(userId),
        amount,
        provider: "PAYSTACK",
        bookingType,
        bookingId: Number(bookingId),
      },
    });

    // 2. Initialize Paystack
    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount,
        reference: `PAY_${payment.id}`,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/verify`,
        metadata: {
          bookingType,
          bookingId,
          paymentId: payment.id,
        },
      }),
    });

    const data = await res.json();

    if (!data.status) {
      console.error("Paystack init error:", data.message);
      return new NextResponse(data.message || "Paystack initialization failed", { status: 400 });
    }

    // 3. Save provider reference
    await prisma.payment.update({
      where: { id: payment.id },
      data: { providerRef: data.data.reference },
    });

    return NextResponse.json({
      authorizationUrl: data.data.authorization_url,
    });
  } catch (err) {
    console.error("Payment init error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
