"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function VerifyPayment() {
  const params = useSearchParams();
  const router = useRouter();
  const reference = params.get("reference");

  useEffect(() => {
    if (!reference) return;

    fetch(`/api/payments/verify?reference=${reference}`)
      .then(() => router.push("/success"))
      .catch(() => router.push("/failed"));
  }, [reference]);

  return <p>Verifying payment...</p>;
}
