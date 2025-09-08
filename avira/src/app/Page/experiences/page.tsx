/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import { Clock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import NavBar from "../../components/NavBar";
import { useRouter } from "next/navigation";
import { useBookingStore } from "@/Store/useBookingStore";
const Experience = () => {
  const experiences = [
    {
      id: 1,
      title: "National Museum Lagos",
      location: "Lagos Island, Lagos",
      image: "photo-1493962853295-0fd70327578a",
      category: "Museum",
      description:
        "Explore Nigeria's rich cultural heritage and ancient artifacts spanning centuries of history",
      price: "₦2,500",
      duration: "2-3 hours",
      rating: 4.8,
      reviews: 324,
      highlights: [
        "Ancient Benin Bronzes",
        "Nok Terracotta",
        "Traditional Artifacts",
      ],
    },
    {
      id: 2,
      title: "Wonderland Amusement Park",
      location: "Abuja",
      image: "photo-1472396961693-142e6e269027",
      category: "Amusement Park",
      description:
        "Family-friendly rides and entertainment for all ages in Nigeria's capital city",
      price: "₦5,000",
      duration: "Full day",
      rating: 4.6,
      reviews: 189,
      highlights: ["Roller Coaster", "Water Rides", "Kids Zone"],
    },
    {
      id: 3,
      title: "Lagos Food & Culture Tour",
      location: "Victoria Island, Lagos",
      image: "photo-1466442929976-97f336a657be",
      category: "Food Tour",
      description:
        "Taste authentic Nigerian cuisine and local delicacies while learning about Lagos culture",
      price: "₦8,000",
      duration: "4-5 hours",
      rating: 4.9,
      reviews: 256,
      highlights: ["Street Food", "Local Markets", "Traditional Cooking"],
    },
    {
      id: 4,
      title: "Kano Ancient City Walk",
      location: "Old City, Kano",
      image: "photo-1466721591366-2d5fba72006d",
      category: "Cultural Walk",
      description:
        "Discover centuries-old architecture and traditional crafts in historic Kano",
      price: "₦3,500",
      duration: "3-4 hours",
      rating: 4.7,
      reviews: 142,
      highlights: [
        "Ancient City Walls",
        "Traditional Dyeing Pits",
        "Kurmi Market",
      ],
    },
    {
      id: 5,
      title: "Obudu Mountain Resort",
      location: "Cross River State",
      image: "photo-1500673922987-e212871fec22",
      category: "Mountain Resort",
      description:
        "Cable car rides and stunning mountain views at Nigeria's premier mountain resort",
      price: "₦12,000",
      duration: "Full day",
      rating: 4.8,
      reviews: 298,
      highlights: ["Cable Car", "Mountain Views", "Cool Climate"],
    },
    {
      id: 6,
      title: "Yankari Game Reserve Safari",
      location: "Bauchi State",
      image: "photo-1469041797191-50ace28483c3",
      category: "Wildlife Safari",
      description:
        "Wildlife viewing and natural hot springs in Nigeria's most popular game reserve",
      price: "₦15,000",
      duration: "2 days",
      rating: 4.5,
      reviews: 167,
      highlights: ["Wildlife Viewing", "Hot Springs", "Game Drives"],
    },
    {
      id: 7,
      title: "Olumo Rock Climbing",
      location: "Abeokuta, Ogun State",
      image: "photo-1605810230434-7631ac76ec81",
      category: "Adventure",
      description:
        "Historic rock formation with panoramic views and cultural significance",
      price: "₦4,000",
      duration: "2-3 hours",
      rating: 4.6,
      reviews: 203,
      highlights: ["Rock Climbing", "City Views", "Historical Sites"],
    },
    {
      id: 8,
      title: "Nike Art Gallery Tour",
      location: "Lekki, Lagos",
      image: "photo-1465146344425-f00d5f5c8f07",
      category: "Art Gallery",
      description:
        "Largest art gallery in West Africa showcasing contemporary African art",
      price: "₦3,000",
      duration: "1-2 hours",
      rating: 4.7,
      reviews: 156,
      highlights: ["Contemporary Art", "Traditional Crafts", "Art Workshops"],
    },
  ];
  const [search, setSearch] = useState("");
  const router = useRouter();
  const setBooking = useBookingStore((state) => state.setBooking);
  const filteredExperiences = experiences.filter(
    (event) =>
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.location.toLowerCase().includes(search.toLowerCase())
  );
  const handleBookExperience = (experience: any) => {
    setBooking({
      type: "experience",
      item: {
        id: experience.id.toString(),
        title: experience.title,
        location: experience.location,
      },
      schedule: { date: "" },
      tickets: 1,
      cost: {
        subtotal: 0,
        service: 0,
        total: 0,
      },
      reservationId: "",
      createdAt: new Date().toISOString(),
    });
    router.push("/booking/experienceflow");
  };
  return (
    <main className="min-h-screen bg-background">
      <NavBar />
      <div className="bg-gradient-to-r from-green-300 to-green-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-2">
            Local Experiences
          </h1>
          <p className="text-center text-lg opacity-90 max-w-2xl mx-auto">
            Discover amazing activities, attractions, and cultural experiences
            across Nigeria
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 -mt-8 relative z-10">
        <div className="shadow-lg bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6">
          <div className="p-3">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                placeholder="Search experiences by activity or location..."
                className="flex-1 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="text-white bg-[#00b894] hover:bg-[#019074] h-10 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5">
                Search Events
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Popular Experiences</h2>
          <p className="text-muted-foreground">
            {experiences.length} experiences found
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperiences.map((experience) => (
            <div
              key={experience.id}
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
                  {experience.location}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {experience.description}
                </p>
                <div className="flex items-center text-gray-600 text-sm mt-3">
                  <Clock size={16} className="text-gray-500 mr-1" />
                  <span>{experience.duration}</span>
                </div>
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {experience.highlights
                      .slice(0, 2)
                      .map((highlight, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                        >
                          {highlight}
                        </span>
                      ))}
                    {experience.highlights.length > 2 && (
                      <span className="text-xs text-gray-400">
                        +{experience.highlights.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => handleBookExperience(experience)}
                    className="mt-4 w-full bg-[#00b894] text-white text-sm font-medium py-2 rounded-md hover:bg-[#019174] transition"
                  >
                    Book experience
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};
export default Experience;
