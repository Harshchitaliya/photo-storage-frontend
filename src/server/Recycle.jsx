import { ref, deleteObject } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export const permentDelete = async (props) => {
  const { urls, currentUseruid, firestore, storage } = props;
  if (!urls || urls.length === 0) return;

  // Delete all files from storage
  await Promise.all(
    urls.map(async (url) => {
      const storageref = ref(storage, url);
      try {
        await deleteObject(storageref);
      } catch (error) {
        console.error(`Error deleting file ${url}:`, error);
      }
    })
  );

  // Update Firestore document
  const userDocRef = doc(firestore, "Users", currentUseruid);
  const userDoc = await getDoc(userDocRef);
  if (userDoc.exists()) {
    const userData = userDoc.data();
    const updatedSkus = userData.skus
      .map((sku) => ({
        ...sku,
        photos: sku.photos.filter((photo) => !urls.includes(photo.url)),
      }))
      // Remove SKUs that have no photos
      .filter((sku) => sku.photos.length > 0);

    await updateDoc(userDocRef, {
      skus: updatedSkus,
    });
  }
}