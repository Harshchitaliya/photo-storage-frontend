import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DeleteIcon } from "../../components/Icons";

const ImageGallery = ({
  allPhotos,
  setFormData,
  selectedImageIndex,
  setSelectedImageIndex,
}) => {
  const [photos, setPhotos] = useState(
    allPhotos?.filter((photo) => !photo.isDeleted) || []
  );
  useEffect(() => {
    setPhotos(allPhotos?.filter((photo) => !photo.isDeleted) || []);
  }, [allPhotos]);

  return (
    <div className="w-full">
      <div className="w-full h-[500px] bg-white dark:bg-gray-800 rounded-lg shadow mb-4 p-4">
        {photos.length > 0 ? (
          photos?.[selectedImageIndex]?.isVideo ? (
            <video
              src={photos?.[selectedImageIndex]?.downloadUrl}
              className="w-full h-full object-cover"
              controls
              playsInline
            />
          ) : (
            <img
              src={photos?.[selectedImageIndex]?.downloadUrl}
              alt="Selected preview"
              className="w-full h-full object-contain rounded-lg"
            />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">Upload images to preview</p>
          </div>
        )}
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {photos.map((image, index) => (
          <div
            key={index}
            className={`relative min-w-[120px] h-[120px] rounded-lg overflow-hidden cursor-pointer border-2 group
        ${
          selectedImageIndex === index ? "border-gray-500" : "border-gray-200"
        }`}
            onClick={() => setSelectedImageIndex(index)}
          >
            {image.isVideo ? (
              <video
                src={image.downloadUrl}
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={image.downloadUrl}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            )}
            <button
              className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
              onClick={(e) => {
                e.stopPropagation();
                setFormData((prev) => ({
                  ...prev,
                  photos: prev.photos.map((photo) =>
                    photo.downloadUrl === image.downloadUrl
                      ? { ...photo, isDeleted: true }
                      : photo
                  ),
                }));
              }}
            >
              <DeleteIcon />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
