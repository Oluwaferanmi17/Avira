"use client";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import Link from "next/link";
const PopularDestinations = () => {
  const destinations = [
    {
      name: "Modern Loft in Lekki",
      image: "photo-1649972904349-6e44c42644a7",
      location: "Lekki, Lagos",
      tag: "Popular for TechFest",
      description: "Stylish modern apartment perfect for business travelers",
      price: "₦25,000/night",
      city: "Lagos",
    },
    {
      name: "Cozy Living Space",
      image: "photo-1721322800607-8c38375eef04",
      location: "Victoria Island, Lagos",
      tag: "Near Afrobeat Districts",
      description: "Comfortable living room with premium amenities",
      price: "₦18,000/night",
      city: "Lagos",
    },
    {
      name: "Heritage Home",
      image:
        "https://images.unsplash.com/photo-1649068431121-72182cd8ca27?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bmlnZXJpYSUyMHdlbGwlMjBmdXJuaXNoZWQlMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D",
      location: "GRA, Calabar",
      tag: " Popular for Calabar Carnival",
      description: "Traditional accommodation with modern comfort",
      price: "₦28,000/night",
      city: "Calabar",
    },
    {
      name: "Executive Suite",
      image:
        "https://images.unsplash.com/photo-1558442074-3c19857bc1dc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bmlnZXJpYSUyMHdlbGwlMjBmdXJuaXNoZWQlMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D",
      location: "Wuse, Abuja",
      tag: "Near National Museum",
      description: "Luxury accommodation in the heart of the capital",
      price: "₦35,000/night",
      city: "Abuja",
    },
  ];
  return (
    <section className="py-16 bg-gray-50 px-6 md:px-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-800">
        Popular Places to Stay
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {destinations.map((destination, index) => (
          <Card
            key={index}
            className="group cursor-pointer p-0 border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden bg-white/90 backdrop-blur-sm"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="relative h-48 overflow-hidden p-0 m-0"
            >
              <img
                src={`https://images.unsplash.com/${destination.image}?auto=format&fit=crop&w=400&q=80`}
                alt={destination.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="inline-block px-3 py-1  bg-[#00b894]/90 text-white text-sm rounded-full backdrop-blur-sm">
                  {destination.tag}
                </span>
              </div>
              <div className="absolute bottom-4 right-4">
                <span className="inline-block px-3 py-1 bg-[#00b894]/90 text-white text-sm font-semibold rounded-full backdrop-blur-sm">
                  {destination.price}
                </span>
              </div>
            </motion.div>
            <CardContent className="p-6">
              <Link href={`/stays?city=${destination.location}`}>
                <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-[#00b894] transition-colors">
                  {destination.name}
                </h3>
              </Link>
              <p className="text-sm text-[#00b894] font-medium mb-2">
                📍 {destination.location}
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                {destination.description}
              </p>
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Link
                  href={`/stays?city=${destination.location}`}
                  className="text-sm font-medium text-[#00b894]"
                >
                  View details →
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
export default PopularDestinations;
