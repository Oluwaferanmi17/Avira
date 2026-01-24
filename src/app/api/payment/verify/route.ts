import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get("reference");

  // 🔐 Guard clause
  if (!reference) {
    return NextResponse.json(
      { error: "Missing payment reference" },
      { status: 400 },
    );
  }

  const res = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    },
  );

  const data = await res.json();

  if (data.data.status !== "success") {
    return NextResponse.json({ error: "Payment failed" }, { status: 400 });
  }

  const paymentId = Number(reference.replace("PAY_", ""));

  await prisma.payment.update({
    where: { id: paymentId },
    data: {
      status: "PAID",
      providerTxId: data.data.id.toString(),
    },
  });

  return NextResponse.json({ ok: true });
}
