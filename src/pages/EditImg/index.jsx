import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useAuth } from "../../context/auth/AuthContext";
import { getImageData } from "../../server";
import { firestore, storage } from "../../context/auth/connection/connection";
import ImageEditor from "./ImageEditor";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, getDoc, updateDoc, } from "firebase/firestore";



const EditImg = () => {
  const { id, imgId } = useParams();
  const [imageData, setImageData] = useState(null);
  const { currentUseruid } = useAuth();

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
    try {
      console.log("Starting save process...");
      

      // Convert base64 image to blob
      const response = await fetch(editedImage);
      const blob = await response.blob();

      // Create storage reference
      const fileName = `${imageData.img.URL.split(".")[0]}_edited_${new Date().getTime()}`; // Create unique filename
      const userFolder = `users/${currentUseruid}/${id}/${fileName}.png`;
      const storageRef = ref(storage, userFolder);

      // Upload to Storage
      const uploadTask = await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(uploadTask.ref);

      console.log("Successfully uploaded to Storage:", downloadURL);

      // Update Firestore using new syntax
      const userRef = doc(firestore, "Users", currentUseruid);

      // Get the current user document
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();

      // Create new photo object
      const newPhoto = {
        url: userFolder,
        date: new Date().toISOString(),
        isDeleted: false,
        isFavorite: false,
        isVideo: false,
      };

      console.log("New photo object:", newPhoto);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const updatedSkus = userData.skus.map((sku) => {
          if (sku.sku === id) {
            return {
              ...sku,
              photos: [...sku.photos, newPhoto],
            };
          }
          return sku;
        });

        await updateDoc(userRef, {
          skus: updatedSkus,
        }).then(() => {
          // handleShowPhoto();
        });
      }

      console.log("Successfully saved image to Storage and Firestore");
    } catch (error) {
      console.error("Error in handleSave:", error);
      throw error;
    }
  };


  return (
    <div>
      {imageData && (
        <ImageEditor
          imageUrl={imageData.img.url}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default EditImg;
