import Link from "next/link";
import { MapPin } from "lucide-react";
import HeartButton from "../../components/Heart";

interface SearchPageProps {
  searchParams: Promise<{
    destination?: string;
    checkIn?: string;
    checkOut?: string;
  }>;
}

interface Stay {
  id: number;
  title: string;
  photos: string[];
  amenities: string[];
  address?: {
    city?: string;
    state?: string;
    country?: string;
  };
  pricing?: {
    basePrice: number;
  };
}

async function getListings(destination?: string): Promise<Stay[]> {
  if (!destination) return [];

  const cleanedDestination = destination
    .split(",")
    .map((d) => d.trim())
    .filter(Boolean)[0]; // always take the city first

  const params = new URLSearchParams({
    destination: cleanedDestination,
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/search?${params.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) return [];

  return res.json();
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { destination, checkIn, checkOut } = await searchParams;

  const listings = await getListings(destination);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">
          Stays{destination ? ` in ${destination}` : ""}
        </h1>
        <p className="text-sm text-gray-500">{listings.length} stays found</p>
      </div>

      {/* Results */}
      {listings.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          No listings found for this location.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((stay) => (
            <Link key={stay.id} href={`/booking/stayflow/${stay.id}`}>
              <div className="relative bg-white hover:shadow-lg transition-shadow rounded-lg shadow-md p-4 cursor-pointer">
                <HeartButton
                  itemId={stay.id}
                  type="stay"
                  className="absolute top-3 right-3 z-20"
                />

                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                  <img
                    src={stay.photos?.[0] || "/placeholder.svg"}
                    alt={stay.title}
                    className="w-full h-40 object-cover hover:scale-105 transition-transform"
                  />
                </div>

                <div className="mt-3">
                  <h3 className="text-lg font-semibold line-clamp-1">
                    {stay.title}
                  </h3>

                  <div className="flex items-center gap-1 mt-2 text-sm text-gray-600">
                    <MapPin className="h-3 w-3" />
                    {stay.address?.city}, {stay.address?.country}
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1">
                  {stay.amenities.slice(0, 3).map((amenity) => (
                    <span
                      key={amenity}
                      className="text-xs bg-secondary px-2 py-1 rounded"
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
              {stay.pricing && (
                <div className="mt-auto pt-3 border-t flex justify-end items-center">
                  <span className="font-bold text-lg text-[#00b894]">
                    ₦{stay.pricing.basePrice}
                  </span>
                  <span className="text-gray-500 text-sm ml-1">/ night</span>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
