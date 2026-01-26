"use client";
import { motion } from "framer-motion";
import RetreatCard from "../../components/Card";

const PopularDestinations = () => {
  const destinations = [
    {
      name: "Savannah Retreat",
      image:
        "https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG91c2UlMjBpbnRlcmlvcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600",
      location: "Maasai Mara, Kenya",
      description:
        "Authentic safari experience with wildlife viewing and cultural immersion.",
      price: "₦45,000/night",
      rating: 4.8,
    },
    {
      name: "Modern Loft in Lekki",
      image:
        "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=600&auto=format&fit=crop&q=60",
      location: "Lekki, Lagos",
      description: "Stylish modern apartment perfect for business travelers.",
      price: "₦25,000/night",
      rating: 4.6,
    },
    {
      name: "Heritage Home",
      image:
        "https://images.unsplash.com/photo-1649068431121-72182cd8ca27?w=600&auto=format&fit=crop&q=60",
      location: "GRA, Calabar",
      description: "Traditional accommodation with modern comfort.",
      price: "₦28,000/night",
      rating: 4.7,
    },
    {
      name: "Executive Suite",
      image:
        "https://images.unsplash.com/photo-1558442074-3c19857bc1dc?w=600&auto=format&fit=crop&q=60",
      location: "Wuse, Abuja",
      description: "Luxury accommodation in the heart of the capital.",
      price: "₦35,000/night",
      rating: 4.9,
    },
  ];

  return (
    <section className="py-16 bg-gray-50 px-6 md:px-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-800">
        Popular Places to Stay
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {destinations.map((d, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: 10 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <RetreatCard
              imageUrl={d.image}
              title={d.name}
              location={d.location}
              price={d.price}
              rating={d.rating}
              description={d.description}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default PopularDestinations;
