"use client";
import { motion } from "framer-motion";
import Slider from "react-slick";
import { FaSearchLocation } from "react-icons/fa";
// import { Badge } from "lucide-react";
import { useSession } from "next-auth/react";
import WelcomeToast from "./WelcomeToast";
import { useState, useEffect, useRef } from "react";
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
  };
  useEffect(() => {
    if (
      prevStatus.current === "unauthenticated" &&
      authStatus === "authenticated" &&
      !sessionStorage.getItem("welcomeShown")
    ) {
      setShowWelcome(true);
      sessionStorage.setItem("welcomeShown", "true");

      const timer = setTimeout(() => setShowWelcome(false), 5000);
      return () => clearTimeout(timer);
    }
    if (authStatus === "unauthenticated") {
      sessionStorage.removeItem("welcomeShown");
    }
    prevStatus.current = authStatus;
  }, [authStatus]);
  // const [showWelcome, setShowWelcome] = useState(false);
  useEffect(() => {
    if (session?.user) {
      setShowWelcome(true);
      const timer = setTimeout(() => setShowWelcome(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [session]);
  return (
    <section className=" bg-white py-1 px-6 md:px-12 overflow-hidden">
      {/* {showWelcome && session?.user?.name && (
        <WelcomeToast userName={session.user.name} />
      )} */}
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10 z-10 ">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className=" z-10"
        >
          <h1 className="text-4xl mt-25 md:text-6xl font-extrabold leading-tight text-[#1c1c1c]">
            Discover Nigeria. <br />
            <span className="text-[#00b894]">
              Stay Local. Experience Culture.
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-lg">
            Explore vibrant cities, attend cultural events, and find the perfect
            stay across Nigeria.
          </p>
          <div className="flex gap-4 flex-wrap">
            <button className="bg-[#00b894] text-white px-6 py-3 rounded-2xl shadow hover:bg-[#019a7a] transition">
              Start Exploring
            </button>
            <button className="border border-[#00b894] text-[#00b894] px-6 py-3 rounded-2xl hover:bg-[#e6fdf8] transition">
              View Upcoming Events
            </button>
          </div>
          <div className="mt-6 max-w-md">
            <div className="flex items-center border border-gray-300 rounded-xl px-4 py-2 shadow-sm bg-white">
              <FaSearchLocation className="text-gray-500 mr-3" />
              <input
                type="text"
                placeholder="Where are you going?"
                className="w-full outline-none placeholder:text-gray-500"
              />
            </div>
          </div>
        </motion.div>
        {showWelcome && session?.user?.name && (
          <WelcomeToast userName={session.user.name} />
        )}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative rounded-3xl overflow-hidden shadow-[0_0_10px_rgba(34,197,94,0.5)] max-w-lg mx-auto   "
        >
          <Slider {...sliderSettings}>
            {images.map((image, index) => (
              <div key={index}>
                <img
                  src={image}
                  alt={`Slide ${index}`}
                  className="w-full h-full md:h-[400px] object-cover rounded-2xl"
                />
              </div>
            ))}
          </Slider>
        </motion.div>
      </div>
    </section>
  );
};
export default HeroSection;
