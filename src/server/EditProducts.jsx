import { ref, getDownloadURL, deleteObject } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { isVideo } from "../utils";

export const productData = async (props) => {
  const { currentUseruid, firestore, storage, productId } = props;
  const userDocRef = doc(firestore, "Users", currentUseruid);
  const userDoc = await getDoc(userDocRef);
  if (userDoc.exists()) {
    const userData = userDoc.data();
    const product = userData.skus.find((sku) => sku.sku === productId);
    const activePhotos = await Promise.all(
      product.photos
        .filter((photo) => !photo.isDeleted)
        .map(async (photo) => {
          const photoRef = ref(storage, photo.url);
          const downloadUrl = await getDownloadURL(photoRef);
          return {
            ...photo,
            downloadUrl,
            isVideo: isVideo(downloadUrl),
          };
        })
    );
    return {
      ...product,
      photos: activePhotos,
    };
  }
};

export const updateProductData = async (props) => {
  const { currentUseruid, firestore, productId, productData } = props;
  const userDocRef = doc(firestore, "Users", currentUseruid);

  const userDoc = await getDoc(userDocRef);
  if (userDoc.exists()) {
    const userData = userDoc.data();
    const updatedSkus = userData.skus.map((sku) => {
      if (sku.sku === productId) {
        let newPhotos = productData.photos.map((photo) => {
          delete photo.downloadUrl;
          return photo;
        });
        let newSku = { ...productData, photos: newPhotos };
        return newSku;
      } else {
        return sku;
      }
    });
    await updateDoc(userDocRef, {
      skus: updatedSkus,
    });
  }
};