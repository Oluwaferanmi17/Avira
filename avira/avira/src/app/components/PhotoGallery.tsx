import { useState } from "react";
import Image from "next/image";
type PhotoGalleryProps = {
  photos: string[];
  onViewAll?: () => void;
};
export default function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [showAll, setShowAll] = useState(false);

  if (!photos || photos.length < 3) {
    return <p className="text-gray-500">At least 3 photos are required.</p>;
  }
  return (
    <>
      {/* Main Grid */}
      <div className="relative grid grid-cols-3 gap-2 h-[400px]">
        {/* Left: Big photo */}
        <div className="col-span-2 row-span-2 relative">
          <Image
            src={photos[0]}
            alt="Main stay photo"
            fill
            className="object-cover rounded-lg"
          />
        </div>

        {/* Right: two stacked photos */}
        <div className="flex flex-col gap-2">
          <div className="relative h-[198px]">
            <Image
              src={photos[1]}
              alt="Stay photo 2"
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div className="relative h-[198px]">
            <Image
              src={photos[2]}
              alt="Stay photo 3"
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>

        {/* "View all photos" button */}
        {photos.length > 3 && (
          <button
            onClick={() => setShowAll(true)}
            className="absolute top-3 right-3 bg-white/90 hover:bg-white text-sm font-medium px-3 py-1.5 rounded-md shadow"
          >
            View all photos
          </button>
        )}
      </div>

      {/* Modal to show all photos */}
      {showAll && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col">
          <button
            onClick={() => setShowAll(false)}
            className="self-end m-4 bg-white text-black px-4 py-2 rounded-lg shadow"
          >
            Close
          </button>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-6 overflow-y-auto">
            {photos.map((photo, idx) => (
              <div key={idx} className="relative w-full h-64">
                <Image
                  src={photo}
                  alt={`Stay photo ${idx + 1}`}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
