/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Slider from "react-slick";
import { FaSearchLocation } from "react-icons/fa";
import { useSession } from "next-auth/react";
import Image from "next/image"; // Import Next.js Image
import WelcomeToast from "./WelcomeToast";

// Ensure you import slick-carousel CSS in your globals.css or here
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const images = [
  "https://images.unsplash.com/photo-1694336662153-287aed24d9ef?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fG5pZ2VyaWElMjBmZXN0aXZhbHxlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1719314313652-d9835e0c52c3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bmlnZXJpYSUyMHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1691497373354-74e68ddf3a22?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fG5pZ2VyaWElMjBtYXJrZXR8ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1618828665011-0abd973f7bb8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bmlnZXJpYSUyMGxhbmRzY2FwZXxlbnwwfHwwfHx8MA%3D%3D",
];

const HeroSection = () => {
  const { data: session, status: authStatus } = useSession();
  const [showWelcome, setShowWelcome] = useState(false);
  const prevStatus = useRef(authStatus);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    // Fix for dots positioning
    appendDots: (dots: any) => (
      <div style={{ bottom: "20px" }}>
        <ul className="m-0"> {dots} </ul>
      </div>
    ),
  };

  useEffect(() => {
    // Check if user just transitioned from unauthenticated to authenticated
    // AND if we haven't shown the welcome message yet in this session.
    if (
      prevStatus.current === "loading" && // or 'unauthenticated' depending on flow
      authStatus === "authenticated" &&
      !sessionStorage.getItem("welcomeShown")
    ) {
      setShowWelcome(true);
      sessionStorage.setItem("welcomeShown", "true");
    }

    // Reset logic if needed (optional, depends on if you want it to show on re-login)
    if (authStatus === "unauthenticated") {
      sessionStorage.removeItem("welcomeShown");
    }

    prevStatus.current = authStatus;
  }, [authStatus]);

  return (
    <section className="relative bg-linear-to-br from-green-50 via-white to-orange-50 pt-28 pb-12 px-6 md:px-12 overflow-hidden min-h-[600px] flex items-center">
      {/* Toast Positioned Absolutely to avoid layout shift */}
      {showWelcome && session?.user?.name && (
        <div className="absolute top-4 right-4 z-50">
          <WelcomeToast userName={session.user.name} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10 w-full max-w-7xl mx-auto z-10">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-[#1c1c1c]">
            Discover Nigeria. <br />
            <span className="text-[#00b894]">
              Stay Local. Experience Culture.
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-lg mt-4">
            Explore vibrant cities, attend cultural events, and find the perfect
            stay across Nigeria.
          </p>

          <div className="mt-6 flex gap-4 flex-wrap">
            <button className="bg-[#00b894] text-white px-6 py-3 rounded-2xl shadow hover:bg-[#019a7a] transition font-medium">
              Start Exploring
            </button>
            <button className="border border-[#00b894] text-[#00b894] px-6 py-3 rounded-2xl hover:bg-[#e6fdf8] transition font-medium">
              View Upcoming Events
            </button>
          </div>

          <div className="max-w-md py-6">
            <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 shadow-sm bg-white focus-within:ring-2 focus-within:ring-[#00b894] transition-all">
              <FaSearchLocation className="text-gray-500 mr-3 text-xl" />
              <input
                type="text"
                placeholder="Where are you going?"
                className="w-full outline-none placeholder:text-gray-500 text-gray-700"
              />
            </div>
          </div>
        </motion.div>

        {/* Image Slider */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative rounded-3xl overflow-hidden shadow-[0_0_20px_rgba(34,197,94,0.3)] w-full max-w-lg mx-auto aspect-4/3 md:aspect-square md:h-[500px]"
        >
          <Slider {...sliderSettings} className="h-full">
            {images.map((imgUrl, index) => (
              <div key={index} className="relative h-full w-full outline-none">
                {/* Using Next.js Image Component */}
                <div className="relative h-[400px] md:h-[500px] w-full">
                  <Image
                    src={imgUrl}
                    alt={`Nigeria Tourism Highlight ${index + 1}`}
                    fill
                    className="object-cover rounded-2xl"
                    sizes="(max-w-768px) 100vw, 50vw"
                    priority={index === 0} // Prioritize loading the first image
                  />
                </div>
              </div>
            ))}
          </Slider>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
