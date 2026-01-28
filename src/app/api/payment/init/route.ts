import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    // 1️⃣ Get user from session
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = Number(session.user.id);

    // 2️⃣ Read body
    const body = await req.json();
    const { bookingType, bookingId, amount, email } = body;

    if (!email || !amount || !bookingId || !bookingType) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // 3️⃣ Create payment
    const payment = await prisma.payment.create({
      data: {
        userId,
        amount,
        provider: "PAYSTACK",
        bookingType,
        bookingId: Number(bookingId),
      },
    });

    // 4️⃣ Init Paystack
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
      return new NextResponse(data.message, { status: 400 });
    }

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
