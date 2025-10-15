/* eslint-disable @next/next/no-img-element */
import { MapPin } from "lucide-react";
import AnimatedSearchBar from "../../components/AnimatedSearchBar";
import Link from "next/link";
import NavBar from "../../components/NavBar";
import getStay from "../../actions/getStays";
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
import HeartButton from "../../components/Heart";
const Stay = async () => {
  const stays = await getStay();
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <NavBar />
      <div className="bg-[#e8efec] text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-2 text-[#00b894]">
            Find Your Perfect Stay
          </h1>
          <p className="text-center text-gray-600 opacity-75">
            We help you find the perfect stay for your next trip.
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 -mt-10 relative z-10">
        <AnimatedSearchBar />
      </div>
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Available Stays</h2>
          <p className="text-muted-foreground">
            {stays.length} Properties Found
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stays.map((stay) => (
            <Link key={stay.id} href={`/booking/stayflow/${stay.id}`}>
              <div className="relative bg-white hover:shadow-lg transition-shadow duration-300 rounded-lg shadow-md p-4 cursor-pointer">
                <HeartButton
                  itemId={stay.id}
                  type="stay"
                  className="absolute top-3 right-3 z-20"
                />
                <div className="aspect-video bg-muted rounded-t-lg overflow-hidden relative z-10">
                  <img
                    src={stay.photos?.[0] || "/placeholder.svg"}
                    alt={stay.title}
                    className="w-full h-40 object-cover rounded-md mb-4 hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="pb-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold line-clamp-1">
                      {stay.title}
                    </h3>
                    <div className="flex items-center gap-1 text-sm">
                      <span>⭐</span>
                      {/* <span>{stay.rating}</span> */}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mt-2">
                    <MapPin className="h-3 w-3 text-gray-500" />
                    <p className="text-gray-600 text-sm">
                      {stay.address?.city}, {stay.address?.country}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1 mb-3">
                  {stay.amenities.slice(0, 3).map((amenity) => (
                    <span
                      key={amenity}
                      className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded"
                    >
                      {amenity}
                    </span>
                  ))}
                  {stay.amenities.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{stay.amenities.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Stay;
