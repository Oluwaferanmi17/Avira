"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ShieldCheck, Wallet } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const BecomeAHost = () => {
  const benefits = [
    { icon: <Wallet className="w-4 h-4" />, text: "Earn extra income" },
    {
      icon: <ShieldCheck className="w-4 h-4" />,
      text: "Insurance coverage included",
    },
    {
      icon: <CheckCircle2 className="w-4 h-4" />,
      text: "Complete control over schedule",
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl bg-[#00b894] shadow-2xl"
      >
        {/* Background Pattern (Optional subtle texture) */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-black/10 rounded-full blur-3xl" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-8 sm:p-12 lg:p-16 relative z-10">
          {/* Left Content */}
          <div className="text-white">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
              Turn your space into a <br />
              <span className="text-green-100">money-making engine</span>
            </h2>

            <p className="text-green-50 text-lg mb-8 max-w-md">
              Share your space with travelers, reach a global audience, and
              manage everything with ease. We handle the payments and security.
            </p>

            {/* Benefits List */}
            <div className="space-y-4 mb-10">
              {benefits.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 text-green-50 font-medium"
                >
                  <div className="p-1.5 bg-white/20 rounded-full text-white">
                    {item.icon}
                  </div>
                  {item.text}
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/host/signup">
                <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-[#00b894] font-bold text-lg shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all transform hover:-translate-y-1">
                  Start Hosting
                </button>
              </Link>

              <Link href="/host/learn-more">
                <button className="w-full sm:w-auto px-8 py-4 rounded-xl border-2 border-green-200/50 text-white font-semibold hover:bg-white/10 transition-colors flex items-center justify-center gap-2 group">
                  Learn more
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>

          {/* Right Content - The "Floating" Card */}
          <div className="relative flex justify-center lg:justify-end mt-8 lg:mt-0">
            <motion.div
              whileHover={{ y: -10, rotate: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative w-full max-w-sm bg-white rounded-2xl p-4 shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500"
            >
              {/* Earnings Badge */}
              <div className="absolute -top-6 -right-6 bg-yellow-400 text-yellow-900 font-bold px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 z-20 transform rotate-6">
                <Wallet className="w-5 h-5" />
                <span>Earned ₦350k</span>
              </div>

              <div className="relative aspect-4/3 rounded-xl overflow-hidden mb-4">
                <Image
                  src="https://plus.unsplash.com/premium_photo-1692873058899-624c0f96c5de?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=600"
                  alt="Happy Host"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  sizes="(max-w-768px) 100vw, 50vw"
                />
              </div>

              <div className="px-2 pb-2">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">
                      Ifeoma&apos;s Guesthouse
                    </h4>
                    <p className="text-gray-500 text-sm">
                      Port Harcourt, Nigeria
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg">
                    <span className="text-xs font-bold text-gray-900">4.9</span>
                    <span className="text-yellow-500">★</span>
                  </div>
                </div>
                <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden mt-3">
                  <div className="h-full w-[80%] bg-[#00b894]"></div>
                </div>
                <p className="text-xs text-gray-400 mt-2 text-right">
                  80% booked for December
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default BecomeAHost;
