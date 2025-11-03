// import { motion } from "framer-motion";
import { Mountain, Umbrella, Eye, Utensils, Camera, Heart } from "lucide-react";
import { TrendingUp } from "lucide-react";
const categories = [
  {
    title: "Adventure",
    description: "Thrilling outdoor activities and exploration in nature",
    count: "150+ experiences",
    color: "from-green-400 to-blue-500",
    icon: <Mountain className="w-8 h-8 text-white" />,
  },
  {
    title: "Relaxation",
    description: "Peaceful retreats and wellness activities for rejuvenation",
    count: "90+ experiences",
    color: "from-purple-400 to-indigo-500",
    icon: <Umbrella className="w-8 h-8 text-white" />,
  },
  {
    title: "Sightseeing",
    description: "Guided tours to iconic landmarks and hidden gems",
    count: "200+ experiences",
    color: "from-orange-400 to-red-500",
    icon: <Eye className="w-8 h-8 text-white" />,
  },
  {
    title: "Culinary",
    description: "Local food tours, cooking classes, and dining experiences",
    count: "80+ experiences",
    color: "from-yellow-400 to-orange-500",
    icon: <Utensils className="w-8 h-8 text-white" />,
  },
  {
    title: "Photography",
    description: "Photo walks and workshops in picturesque locations",
    count: "45+ experiences",
    color: "from-pink-400 to-purple-500",
    icon: <Camera className="w-8 h-8 text-white" />,
  },
  {
    title: "Romantic",
    description: "Special experiences for couples and romantic getaways",
    count: "60+ experiences",
    color: "from-rose-400 to-pink-500",
    icon: <Heart className="w-8 h-8 text-white" />,
  },
];

export default function ExperienceCategories() {
  return (
    <section className="py-16 px-6 sm:px-12 lg:px-20">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-[#d0efe9] text-[#00b894] font-medium px-4 py-2 rounded-full shadow-sm mb-5">
          <TrendingUp className="w-4 h-4" />
          <span>Trending Categories</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          Find Your Perfect Experience
        </h2>
        <p className="text-gray-600 text-lg">
          Discover the perfect experience that suits your travel vibe
        </p>
      </div>

      <div
        // whileHover={{ y: -10 }}
        className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 hover:x"
      >
        {categories.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 hover:shadow-2xl hover:-translate-y-2 cursor-pointer"
          >
            {/* Gradient Top Bar */}
            <div
              className={`h-2 rounded-t-2xl bg-gradient-to-r ${item.color}`}
            ></div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-lg bg-gradient-to-r ${item.color} flex items-center justify-center`}
                >
                  {item.icon}
                </div>
                <span className="text-gray-500 text-sm font-medium">
                  {item.count}
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {item.description}
              </p>

              <button className="w-full bg-gray-50 hover:bg-gray-100 text-gray-900 font-semibold py-3 rounded-xl transition-colors hover:text-[#00b894] shadow-lg">
                Explore {item.title}
              </button>
            </div>
          </div>
        ))}
      </div>
      <section className="mt-10 bg-gradient-to-r from-green-600 to-yellow-600 text-white text-center rounded-2xl py-16 px-6 sm:px-12 lg:px-20 shadow-lg">
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-[#00b894]">
          Ready to Create Unforgettable Memories?
        </h2>
        <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
          Browse our complete collection of experiences and start planning your
          adventure
        </p>

        <button className="bg-white text-[#00b894] font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-blue-50 transition-all">
          View All Experiences
        </button>
      </section>
    </section>
  );
}
