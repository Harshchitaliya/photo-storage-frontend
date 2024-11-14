import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useAuth } from "../../context/auth/AuthContext";
import { getImageData } from "../../server";
import { firestore, storage } from "../../context/auth/connection/connection";
import ImageEditor from "./ImageEditor";
import { ref, uploadBytes } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Loader from "../../components/Loader";

const EditImg = () => {
  const { id, imgId } = useParams();
  const [imageData, setImageData] = useState(null);
  const { currentUseruid } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const getImage = async () => {
    try {
      const data = await getImageData({
        currentUseruid,
        firestore,
        productId: id,
        imageIndex: imgId,
        storage,
      });
      setImageData(data);
    } catch (error) {
      window.history.back();
      console.log(error);
    }
  };

  useEffect(() => {
    getImage();
  }, []);

  const handleSave = async (editedImage) => {
    setIsLoading(true);
    try {
      const response = await fetch(editedImage);
      const blob = await response.blob();
      const originalPath = imageData.img.URL;
      const pathParts = originalPath.split('/');
      const originalFileName = pathParts.pop();
      const newFileName = `${originalFileName.split('.')[0]}_edited_${new Date().getTime()}.jpg`;
      pathParts.push(newFileName);
      const newPath = pathParts.join('/');

      const storageRef = ref(storage, newPath);

      await uploadBytes(storageRef, blob);

      const userRef = doc(firestore, "Users", currentUseruid);
      const userDoc = await getDoc(userRef);
      const newPhoto = {
        url: newPath,
        date: new Date().toISOString(),
        isDeleted: false,
        isFavorite: false,
        isVideo: false,
      };

      console.log("New photo object:", newPhoto);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const updatedSkus = { ...userData.skus };

        if (updatedSkus[id]) {
          updatedSkus[id] = {
            ...updatedSkus[id],
            photos: [...updatedSkus[id].photos, newPhoto],
          };

          await updateDoc(userRef, {
            skus: updatedSkus,
          });
        }
      }
      window.history.back();
    } catch (error) {
      console.error("Error in handleSave:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader size="xl" />
        </div>
      ) : (
        imageData && (
          <ImageEditor imageUrl={imageData.img.url} onSave={handleSave} />
        )
      )}
    </div>
  );
};

export default EditImg;
