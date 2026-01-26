import React from "react";
const PhotoGrid = ({ photos }: { photos: string[] }) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      {photos.map((photo, index) => (
        <img
          key={index}
          src={photo}
          alt={`Photo ${index + 1}`}
          className="w-full h-32 object-cover rounded-lg"
        />
      ))}
    </div>
  );
};
export default PhotoGrid;
