"use client";

import { Clock, MapPin, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import NavBar from "../../components/Home/NavBar";
import { useRouter } from "next/navigation";
import { useBookingStore } from "@/Store/useBookingStore";
import { getExperience } from "@/app/actions/getExperience";
import { useSession } from "next-auth/react";

// 1. Define the Interface for Type Safety
interface ExperienceItem {
  id: string | number;
  title: string;
  location: string;
  duration: string;
  price: number;
  image: string;
  category: string;
  description: string;
  highlights: string[];
}

const Experience = () => {
  const [experiences, setExperience] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const [search, setSearch] = useState("");
  const { data: session } = useSession();

  const router = useRouter();
  const setBooking = useBookingStore((state) => state.setBooking);

  useEffect(() => {
    async function fetchExperience() {
      try {
        const data = await getExperience();
        // Ensure data is an array before setting
        if (Array.isArray(data)) {
          setExperience(data);
        }
      } catch (error) {
        console.error("Failed to fetch experiences:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchExperience();
  }, []);

  const filteredExperiences = experiences.filter(
    (event) =>
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.location.toLowerCase().includes(search.toLowerCase()),
  );

  const handleBookExperience = (experience: ExperienceItem) => {
    if (!session?.user?.id) {
      alert("You must be logged in to book");
      return;
    }
    setBooking({
      userId: session?.user?.id,
      type: "experience",
      experience: {
        id: experience.id.toString(),
        title: experience.title,
        location: experience.location,
        duration: experience.duration,
        price: experience.price,
        image: experience.image,
      },
      item: {
        id: experience.id.toString(),
        title: experience.title,
        location: experience.location,
        price: experience.price,
      },
      schedule: {
        date: new Date().toISOString(),
      },
      tickets: 1,
      cost: {
        subtotal: experience.price,
        service: 0,
        total: experience.price,
      },
      reservationId: "",
      createdAt: new Date().toISOString(),
    });

    router.push(`/booking/experienceflow/${experience.id}`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50">
      <NavBar />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-500 via-white to-orange-500 text-[#00b894] py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-2 drop-shadow-sm">
            Local Experiences
          </h1>
          <p className="text-center text-lg font-medium opacity-90 max-w-2xl mx-auto">
            Discover amazing activities, attractions, and cultural experiences
            across Nigeria
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="container mx-auto px-4 -mt-8 relative z-10">
        <div className="shadow-xl bg-white flex flex-col gap-6 rounded-xl border border-gray-100 py-6">
          <div className="p-3">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  placeholder="Search experiences by activity or location..."
                  className="w-full pl-10 focus:ring-2 focus:ring-[#00b894]/50 border-gray-200 h-10 rounded-md border bg-transparent text-base outline-none transition-all"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button className="text-white bg-[#00b894] hover:bg-[#019074] h-10 rounded-md px-6 font-medium transition-colors w-full md:w-auto">
                Search Events
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Popular Experiences
          </h2>
          <p className="text-gray-500">
            {filteredExperiences.length} experiences found
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-96 bg-gray-200 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          /* Experience Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperiences.map((experience) => (
              <div
                key={experience.id}
                className="group flex flex-col h-full bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-gray-100"
              >
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={`https://images.unsplash.com/${experience.image}?auto=format&fit=crop&w=400&q=80`}
                    alt={experience.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-[#00b894]/90 text-white text-xs font-bold uppercase tracking-wider rounded-full backdrop-blur-sm shadow-sm">
                      {experience.category}
                    </span>
                  </div>

                  <div className="absolute bottom-4 right-4">
                    <span className="px-3 py-1 bg-white/90 text-[#00b894] text-sm font-bold rounded-full backdrop-blur-sm shadow-sm">
                      ₦{experience.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                  <Link href={`/stays?city=${experience.location}`}>
                    <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-[#00b894] transition-colors line-clamp-1">
                      {experience.title}
                    </h3>
                  </Link>

                  <div className="flex items-center text-[#00b894] font-medium mb-3 text-sm">
                    <MapPin size={14} className="mr-1" />
                    {experience.location}
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4">
                    {experience.description}
                  </p>

                  {/* Highlights and Duration */}
                  <div className="mt-auto">
                    <div className="flex items-center text-gray-500 text-xs mb-3 font-medium">
                      <Clock size={14} className="mr-1.5" />
                      <span>{experience.duration}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {experience.highlights
                        .slice(0, 2)
                        .map((highlight, index) => (
                          <span
                            key={index}
                            className="text-[10px] uppercase tracking-wide bg-gray-100 text-gray-600 px-2 py-1 rounded-md border border-gray-200"
                          >
                            {highlight}
                          </span>
                        ))}
                      {experience.highlights.length > 2 && (
                        <span className="text-[10px] text-gray-400 py-1">
                          +{experience.highlights.length - 2} more
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleBookExperience(experience)}
                      className="w-full bg-[#00b894] hover:bg-[#019174] text-white text-sm font-medium py-2.5 rounded-lg transition-colors shadow-sm hover:shadow-md active:scale-[0.98] transform"
                    >
                      Book Experience
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredExperiences.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg">
              No experiences found matching &quot;{search}&quot;
            </p>
            <button
              onClick={() => setSearch("")}
              className="text-[#00b894] mt-2 hover:underline"
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default Experience;
