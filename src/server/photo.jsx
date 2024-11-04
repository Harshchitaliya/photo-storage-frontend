import { ref, getDownloadURL } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";


import { isVideo } from "../utils";

export const setAllPhoto = async (props) => {
  const { currentUseruid, firestore, storage } = props;
  const userDocRef = doc(firestore, "Users", currentUseruid);
  const userDoc = await getDoc(userDocRef);
  if (userDoc.exists()) {
    const userData = userDoc.data();
    const photoData = userData.skus
      .flatMap((sku) =>
        sku.photos.map((photo) => {
          if (photo.isDeleted) {
            return null;
          }
          return {
            url: photo.url,
            date: photo.date,
            sku: sku.sku,
            title: sku.title,
            description: sku.description,
            quantity: sku.quantity,
            price: sku.price,
            type: sku.type,
            isVideo: isVideo(photo.url),
            isFavorite: photo.isFavorite,
            allSearch: `${sku.sku} ${photo.title}`.toLowerCase(),
          };
        })
      )
      .filter((photo) => photo !== null);

    const photosWithUrls = await Promise.all(
      photoData.map(async (photo) => {
        const storageRef = ref(storage, photo.url);
        const downloadUrl = await getDownloadURL(storageRef);
        return {
          ...photo,
          downloadUrl,
        };
      })
    );

    return photosWithUrls;
  }
};

export const deletePhoto = async (props) => {
  const { urls, currentUseruid, firestore, handleShowPhoto, setSelectedItems } = props;
  if (!urls || urls.length === 0) return;

  const userDocRef = doc(firestore, "Users", currentUseruid);
  try {
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const updatedSkus = userData.skus.map((sku) => ({
        ...sku,
        photos: sku.photos.map((photo) => ({
          ...photo,
          isDeleted: urls.includes(photo.url) ? true : photo.isDeleted,
        })),
      }));

      // Update the document with the modified skus
      await updateDoc(userDocRef, {
        skus: updatedSkus,
      }).then(() => {
        handleShowPhoto();
        setSelectedItems([]);
        alert("Photos deleted successfully");
      });
    }
  } catch (error) {
    console.error("Error deleting photos:", error);
  }
};

