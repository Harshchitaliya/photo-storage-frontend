import { ref, getDownloadURL, deleteObject } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { isVideo } from "../utils";

export const productData = async (props) => {
  const { currentUseruid, firestore, storage, productId } = props;
  const userDocRef = doc(firestore, "Users", currentUseruid);
  const userDoc = await getDoc(userDocRef);
  if (userDoc.exists()) {
    const userData = userDoc.data();
    const product = userData.skus[productId];
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
    const updatedSkus = { ...userData.skus };
    
    const newPhotos = productData.photos.map((photo) => {
      const { downloadUrl, isVideo, ...rest } = photo;
      return rest;
    });
    
    updatedSkus[productId] = {
      ...productData,
      photos: newPhotos
    };

    await updateDoc(userDocRef, {
      skus: updatedSkus,
    });
  }
};

export const updateImageData = async (props) => {
  const { currentUseruid, firestore, productId, imageId, imageData } = props;
  const userDocRef = doc(firestore, "Users", currentUseruid);
  const userDoc = await getDoc(userDocRef);
  if (userDoc.exists()) {
    const userData = userDoc.data();
    const updatedSkus = { ...userData.skus };
    
    const sku = updatedSkus[productId];
    const newPhotos = sku.photos.map((photo) => 
      photo.url === imageData.url ? imageData : photo
    );
    
    updatedSkus[productId] = {
      ...sku,
      photos: newPhotos
    };

    await updateDoc(userDocRef, {
      skus: updatedSkus,
    });
  }
};

export const getImageData = async (props) => {
  const { currentUseruid, firestore, productId, imageIndex, storage } = props;
  const userDocRef = doc(firestore, "Users", currentUseruid);
  const userDoc = await getDoc(userDocRef);
  if (userDoc.exists()) {
    const userData = userDoc.data();
    const product = userData.skus[productId];
    const img = product.photos.filter((photo) => !photo.isDeleted)[imageIndex];
    const photoRef = ref(storage, img.url);
    const downloadUrl = await getDownloadURL(photoRef);
    return { 
      isVideo: isVideo(downloadUrl), 
      img: { 
        ...img,
        URL: img.url, 
        url: downloadUrl 
      } 
    };
  }
};
