"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import NavBar from "@/app/components/Home/NavBar";
import Footer from "@/app/components/Home/Footer";

export default function PaymentVerifyPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const reference = searchParams.get("reference");
    const trxref = searchParams.get("trxref");

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("Verifying your payment...");

    useEffect(() => {
        const verifyPayment = async () => {
            const ref = reference || trxref;
            if (!ref) {
                setStatus("error");
                setMessage("No payment reference found.");
                return;
            }

            try {
                const res = await fetch(`/api/payment/verify?reference=${ref}`);
                const data = await res.json();

                if (res.ok) {
                    setStatus("success");
                    setMessage("Payment successful! Redirecting to your booking...");

                    // Small delay before redirecting to success page
                    setTimeout(() => {
                        router.push(`/booking/success/${ref}`);
                    }, 2000);
                } else {
                    setStatus("error");
                    setMessage(data.error || "Payment verification failed.");
                }
            } catch (error) {
                console.error("Verification error:", error);
                setStatus("error");
                setMessage("An error occurred while verifying your payment.");
            }
        };

        verifyPayment();
    }, [reference, trxref, router]);

    return (
        <div className="min-h-screen flex flex-col bg-white text-slate-900">
            <NavBar />
            <main className="flex-1 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
                    {status === "loading" && (
                        <div className="space-y-4">
                            <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mx-auto" />
                            <h1 className="text-xl font-semibold">{message}</h1>
                            <p className="text-slate-500 text-sm">Please do not close this window.</p>
                        </div>
                    )}

                    {status === "success" && (
                        <div className="space-y-4">
                            <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto" />
                            <h1 className="text-xl font-semibold text-slate-800">Payment Verified</h1>
                            <p className="text-slate-600">{message}</p>
                        </div>
                    )}

                    {status === "error" && (
                        <div className="space-y-4">
                            <XCircle className="h-12 w-12 text-red-600 mx-auto" />
                            <h1 className="text-xl font-semibold text-slate-800">Verification Failed</h1>
                            <p className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100 italic">
                                {message}
                            </p>
                            <button
                                onClick={() => router.push("/")}
                                className="mt-4 px-6 py-2.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition font-medium w-full"
                            >
                                Back to Home
                            </button>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
