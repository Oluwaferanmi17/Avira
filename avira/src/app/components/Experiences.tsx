import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const Experiences = () => {
  const experiences = [
    {
      title: "National Museum Lagos",
      location: "Lagos Island, Lagos",
      image: "photo-1493962853295-0fd70327578a",
      category: "🖼️ Museum",
      description:
        "Explore Nigeria's rich cultural heritage and ancient artifacts",
      price: "₦2,500/person",
      id: "national-museum-lagos",
    },
    {
      title: "Wonderland Amusement Park",
      location: "Abuja",
      image: "photo-1472396961693-142e6e269027",
      category: "🎢 Amusement Park",
      description: "Family-friendly rides and entertainment for all ages",
      price: "₦5,000/person",
      id: "wonderland-abuja",
    },
    {
      title: "Lagos Food & Culture Tour",
      location: "Victoria Island, Lagos",
      image: "photo-1466442929976-97f336a657be",
      category: "🍽️ Food Tour",
      description: "Taste authentic Nigerian cuisine and local delicacies",
      price: "₦8,000/person",
      id: "lagos-food-tour",
    },
    {
      title: "Kano Ancient City Walk",
      location: "Old City, Kano",
      image: "photo-1466721591366-2d5fba72006d",
      category: "🚶 Cultural Walk",
      description: "Discover centuries-old architecture and traditional crafts",
      price: "₦3,500/person",
      id: "kano-city-walk",
    },
  ];

  return (
    <section className="py-16 bg-gray-50 px-6 md:px-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-800">
        Discover Experiences Around Nigeria
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {experiences.map((experience, index) => (
          <div
            key={index}
            className="group cursor-pointer p-0 border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden bg-white/90 backdrop-blur-sm"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={`https://images.unsplash.com/${experience.image}?auto=format&fit=crop&w=400&q=80`}
                alt={experience.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="inline-block px-3 py-1 bg-[#00b894]/90 text-white text-sm rounded-full backdrop-blur-sm">
                  {experience.category}
                </span>
              </div>
              <div className="absolute bottom-4 right-4">
                <span className="inline-block px-3 py-1 bg-green-600/90 text-white text-sm font-semibold rounded-full backdrop-blur-sm">
                  {experience.price}
                </span>
              </div>
            </div>
            <div className="p-6">
              <Link href={`/stays?city=${experience.location}`}>
                <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-[#00b894] transition-colors">
                  {experience.title}
                </h3>
              </Link>
              <p className="text-sm text-[#00b894] font-medium mb-2">
                📍 {experience.location}
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                {experience.description}
              </p>
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Link
                  href={`/stays?city=${experience.location}`}
                  className="text-sm font-medium text-[#00b894]"
                >
                  Book experience →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
export default Experiences;
