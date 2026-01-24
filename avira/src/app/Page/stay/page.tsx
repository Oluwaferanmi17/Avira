/* eslint-disable @next/next/no-img-element */
import { MapPin } from "lucide-react";
import AnimatedSearchBar from "../../components/AnimatedSearchBar";
import Link from "next/link";
// import Image from "next/image"; // Import Next Image
import NavBar from "../../components/Home/NavBar";
import getStay from "../../actions/getStays";
import HeartButton from "../../components/Heart";

interface Stay {
  id: string;
  title: string;
  photos: string[];
  amenities: string[];
  address?: {
    city: string;
    country: string;
  };
  pricing?: {
    basePrice: number;
  };
}

const Stay = async () => {
  const stays = await getStay();

  // 1. Safety check for empty data
  if (!stays || stays.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-gray-700">No stays found</h2>
          <p>Try adjusting your search criteria.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50">
      <NavBar />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-50 via-white to-orange-50 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-2 text-[#00b894]">
            Find Your Perfect Stay
          </h1>
          <p className="text-center text-gray-600 opacity-75">
            We help you find the perfect stay for your next trip.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="container mx-auto px-4 -mt-10 relative z-50">
        <AnimatedSearchBar />
      </div>

      {/* Grid Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Available Stays</h2>
          <p className="text-muted-foreground">
            {stays.length} Properties Found
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stays.map((stay) => (
            <div
              key={stay.id}
              className="relative bg-white hover:shadow-lg transition-shadow duration-300 rounded-lg shadow-md group"
            >
              {/* 2. Fix: HeartButton is technically outside the Link 
                to prevent DOM nesting errors, but visually positioned absolute.
              */}
              <div className="absolute top-3 right-3 z-20">
                <HeartButton itemId={stay.id} type="stay" />
              </div>

              <Link
                href={`/booking/stayflow/${stay.id}`}
                className="block h-full"
              >
                <div className="p-4 h-full flex flex-col">
                  {/* Image Container */}
                  <div className="aspect-video bg-muted rounded-t-lg overflow-hidden relative mb-4">
                    {/* 3. Optimization: Using Next/Image */}
                    <img
                      src={stay.photos?.[0] || "/placeholder.svg"}
                      alt={stay.title}
                      // fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>

                  <div className="grow">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold line-clamp-1">
                        {stay.title}
                      </h3>
                      <div className="flex items-center gap-1 text-sm">
                        <span>⭐</span>
                        {/* <span>{stay.rating?.toFixed(1)}</span> */}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 mt-2">
                      <MapPin className="h-3 w-3 text-gray-500" />
                      <p className="text-gray-600 text-sm">
                        {stay.address?.city}, {stay.address?.country}
                      </p>
                    </div>

                    {/* Amenities */}
                    <div className="mt-3 flex flex-wrap gap-1 mb-3">
                      {stay.amenities.slice(0, 3).map((amenity, index) => (
                        <span
                          key={`${stay.id}-${amenity}-${index}`} // Unique key fix
                          className="text-xs bg-secondary text-gray-600 bg-gray-100 px-2 py-1 rounded"
                        >
                          {amenity}
                        </span>
                      ))}
                      {stay.amenities.length > 3 && (
                        <span className="text-xs text-muted-foreground pt-1 pl-1">
                          +{stay.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 4. Added Price Display (Bottom of card) */}
                  {stay.pricing && (
                    <div className="mt-auto pt-3 border-t flex justify-end items-center">
                      <span className="font-bold text-lg text-[#00b894]">
                        ₦{stay.pricing.basePrice}
                      </span>
                      <span className="text-gray-500 text-sm ml-1">
                        / night
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stay;
