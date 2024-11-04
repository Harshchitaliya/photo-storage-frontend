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

