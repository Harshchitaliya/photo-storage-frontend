import { useState, useEffect } from "react";
import { DeleteIcon, DownloadIcon } from "../../components/Icon";
import { storage } from "../../context/auth/connection/connection";
import { downloadFiles } from "../../server/photo";
import Loader from "../../components/Loader";

const ImageGallery = ({
  allPhotos,
  setFormData,
  selectedImageIndex,
  setSelectedImageIndex,
}) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  console.log(allPhotos)

  useEffect(() => {
    const activePhotos = allPhotos?.filter(photo => !photo.isDeleted) || [];
    setPhotos(activePhotos);
  }, [allPhotos]);
  console.log(photos)

  const handleDownload = async (url) => {
    try {
      setLoading(true);
      await downloadFiles({ urls: [url], storage });
    } catch (error) {
      console.error("Error downloading file:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (imageToDelete, index) => {
    setFormData(prev => {
      console.log('Previous photos:', prev.photos);
      
      const photoIndex = prev.photos.findIndex(photo => photo.url === imageToDelete.url);
      
      if (photoIndex === -1) {
        console.error('Photo not found:', imageToDelete);
        return prev;
      }

      const updatedPhotos = [...prev.photos];
      updatedPhotos[photoIndex] = {
        ...updatedPhotos[photoIndex],
        isDeleted: true
      };

      console.log('Updated photos:', updatedPhotos);

      return {
        ...prev,
        photos: updatedPhotos
      };
    });

    if (index <= selectedImageIndex && photos.length > 1) {
      setSelectedImageIndex(Math.max(0, selectedImageIndex - 1));
    }
  };

  return (
    <div className="w-full">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <Loader />
        </div>
      )}
      <div className="w-full h-[500px] bg-white dark:bg-gray-800 rounded-lg shadow mb-4 p-4">
        {photos.length > 0 && (
          <button 
            onClick={() => handleDownload(photos[selectedImageIndex].url)}
            className="mb-2"
          >
            <DownloadIcon />
          </button>
        )}
        {photos.length > 0 ? (
          photos[selectedImageIndex]?.isVideo ? (
            <video
              src={photos[selectedImageIndex].downloadUrl}
              className="w-full h-full object-cover"
              controls
              playsInline
            />
          ) : (
            <img
              src={photos[selectedImageIndex].downloadUrl}
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
              ${selectedImageIndex === index ? "border-gray-500" : "border-gray-200"}`}
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
                handleDelete(image.url, index);
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
