import { ref, getDownloadURL, deleteObject } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { isVideo } from "../utils";
import JSZip from 'jszip';



export const setAllPhoto = async (props) => {
  const { currentUseruid, firestore, storage, galleryphoto } = props;
  const userDocRef = doc(firestore, "Users", currentUseruid);
  const userDoc = await getDoc(userDocRef);
  if (userDoc.exists()) {
    const userData = userDoc.data();
    const photoData = userData.skus
      .flatMap((sku) =>
        sku.photos.map((photo) => {
          if (galleryphoto) {
            if (photo.isDeleted) {
              return null;
            }
          } else {
            if (!photo.isDeleted) {
              return null;
            }
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
  const { urls, currentUseruid, firestore, isrecycle } = props;
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
          isDeleted: isrecycle ? (urls.includes(photo.url) ? false : photo.isDeleted) : (urls.includes(photo.url) ? true : photo.isDeleted)
        })),
      }));
      await updateDoc(userDocRef, {
        skus: updatedSkus,
      })
    }
  } catch (error) {
    console.error("Error deleting photos:", error);
  }
};

export const setFavorite = async (props) => {
  const { urls, currentUseruid, firestore, handleShowPhoto } = props;

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
          isFavorite: urls.includes(photo.url) ? !photo.isFavorite : photo.isFavorite,
        })),
      }));

      await updateDoc(userDocRef, {
        skus: updatedSkus,
      }).then(() => {
        handleShowPhoto();
      });
    }
  } catch (error) {
    console.error("Error favorite photos:", error);
  }
}





export const showsku = async (props) => {
  const { currentUseruid, firestore, storage } = props;
  const userDocRef = doc(firestore, "Users", currentUseruid);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    const userData = userDoc.data();
    const skus = userData.skus;
    const photos = await Promise.all(skus.map(async (sku) => {
      const activePhotos = await Promise.all(
        sku.photos
          .filter(photo => !photo.isDeleted)
          .map(async (photo) => {
            const photoRef = ref(storage, photo.url);
            const downloadUrl = await getDownloadURL(photoRef);
            return {
              ...photo,
              downloadUrl
            };
          })
      );
      return {
        ...sku,
        photos: activePhotos,
        isVideo: isVideo(activePhotos?.[0]?.url || ""),
        allSearch: `${sku.sku} ${sku.title}`.toLowerCase(),
      };
    }));
    return photos.filter(photo => photo.photos.length > 0);
  }
  return [];
}


export const usedata = async (props) => {
  const { currentUseruid, firestore } = props;
  const userDocRef = doc(firestore, "Users", currentUseruid);
  const userDoc = await getDoc(userDocRef);
  if (userDoc.exists()) {
    const userData = userDoc.data();
    delete userData.skus;
    return userData;
  }
  return null;
};

export const downloadFiles = async ({ urls, storage, proxyUrl = 'http://localhost:5001/fetch-image' }) => {
  urls = Array.isArray(urls) ? urls : [urls];

  // Helper function to get file blob
  const getFileBlob = async (url) => {
    const storageRef = ref(storage, url);
    const downloadUrl = await getDownloadURL(storageRef);
    const response = await fetch(`${proxyUrl}?url=${encodeURIComponent(downloadUrl)}`);
    return response.blob();
  };

  // Helper function to download single file
  const downloadSingleFile = async (url) => {
    const blob = await getFileBlob(url);
    const filename = url.split('/').pop() || 'file.jpg';

    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(downloadUrl);
  };

  // Helper function to download multiple files
  const downloadMultipleFiles = async (fileUrls) => {
    const zip = new JSZip();

    const filePromises = fileUrls.map(async (fileUrl) => {
      const blob = await getFileBlob(fileUrl);
      const filename = fileUrl.split('/').pop() || 'file.jpg';
      return { blob, filename };
    });

    const files = await Promise.all(filePromises);

    files.forEach(({ blob, filename }) => {
      zip.file(filename, blob);
    });

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const zipUrl = URL.createObjectURL(zipBlob);

    const a = document.createElement('a');
    a.href = zipUrl;
    a.download = 'files.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(zipUrl);
  };

  try {
    if (urls.length === 1) {
      await downloadSingleFile(urls[0]);
    } else {
      await downloadMultipleFiles(urls);
    }
  } catch (error) {
    console.error('Error downloading files:', error);
    throw error;
  }
};