"use client";

import { motion } from "framer-motion";
import RetreatCard from "../../components/Card";
import { useEffect, useState } from "react";

// Define the shape of your data for better type safety
// interface Destination {
//   id: number;
//   title: string;
//   description: string;
//   image: string;
//   location: string;
//   pricePerNight: number;
//   rating: number;
//   reviewCount: number;
// }

interface Stay {
  id: number;
  title: string;
  description: string;
  image: string;
  location: string;
  pricePerNight: number;
}
const PopularDestinations = () => {
  // const [destinations, setDestinations] = useState<Destination[]>([]);
  const [stays, setStays] = useState<Stay[]>([]);
  const [loading, setLoading] = useState(true);
  // useEffect(() => {
  //   const fetchDestinations = async () => {
  //     try {
  //       const res = await fetch("/api/destinations");
  //       const data = await res.json();
  //       setDestinations(data);
  //     } catch (error) {
  //       console.error("Failed to fetch destinations", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchDestinations();
  // }, []);
  useEffect(() => {
    const fetchStays = async () => {
      try {
        const res = await fetch("/api/public/stays");
        const data = await res.json();
        setStays(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStays();
  }, []);
  if (loading) {
    return (
      <section className="py-20 text-center text-gray-500">
        Loading stays...
      </section>
    );
  }

  // const destinations: Destination[] = [
  //   {
  //     id: 1,
  //     name: "Yankari Game Reserve",
  //     image:
  //       "https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=600",
  //     location: "Bauchi, Nigeria",
  //     description:
  //       "Authentic safari experience with wildlife viewing and warm springs.",
  //     price: "₦45,000/night",
  //     rating: 4.8,
  //   },
  //   {
  //     id: 2,
  //     name: "Modern Loft in Lekki",
  //     image:
  //       "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=600&auto=format&fit=crop&q=60",
  //     location: "Lekki, Lagos",
  //     description: "Stylish modern apartment perfect for business travelers.",
  //     price: "₦25,000/night",
  //     rating: 4.6,
  //   },
  //   {
  //     id: 3,
  //     name: "Heritage Home",
  //     image:
  //       "https://images.unsplash.com/photo-1649068431121-72182cd8ca27?w=600&auto=format&fit=crop&q=60",
  //     location: "GRA, Calabar",
  //     description: "Traditional accommodation with modern comfort.",
  //     price: "₦28,000/night",
  //     rating: 4.7,
  //   },
  //   {
  //     id: 4,
  //     name: "Executive Suite",
  //     image:
  //       "https://images.unsplash.com/photo-1558442074-3c19857bc1dc?w=600&auto=format&fit=crop&q=60",
  //     location: "Wuse, Abuja",
  //     description: "Luxury accommodation in the heart of the capital.",
  //     price: "₦35,000/night",
  //     rating: 4.9,
  //   },
  // ];

  // Animation variants for cleaner code
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Stagger effect for items appearing one by one
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="py-20 bg-gray-50 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-[#1c1c1c] mb-4">
            Popular Places to Stay
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            From luxury city apartments to serene nature reserves, discover the
            best rated locations by travelers like you.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {/* {destinations.map((d) => (
            <motion.div
              key={d.id}
              variants={itemVariants}
              whileHover={{ y: -10 }} // Negative Y lifts the card UP
              className="h-full"
            >
              <RetreatCard
                imageUrl={d.image}
                title={d.title}
                location={d.location}
                price={`₦${d.pricePerNight.toLocaleString()}/night`}
                rating={d.rating}
                reviewCount={d.reviewCount}
                description={d.description}
              />
            </motion.div>
          ))} */}
          {stays.map((stay) => (
            <motion.div
              key={stay.id}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="h-full"
            >
              <RetreatCard
                imageUrl={stay.image}
                title={stay.title}
                location={stay.location}
                price={`₦${stay.pricePerNight.toLocaleString()}/night`}
                description={stay.description}
                link={`/booking/stayflow/${stay.id}`}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PopularDestinations;
