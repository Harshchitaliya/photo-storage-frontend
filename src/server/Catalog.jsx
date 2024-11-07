import { ref, getDownloadURL, deleteObject } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export const createNewCatalog = async(props)=>{
    const { currentUseruid, firestore, catalog } = props;
    const userDocRef = doc(firestore, "Users", currentUseruid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      if(!userData.catalogs){
        userData.catalogs=[];
      }
      catalog.id =  Date.now().toString() + Math.random().toString(36).substring(2, 15);
      const updatedSkus = [...userData.catalogs,catalog];
      await updateDoc(userDocRef, {
        catalogs: updatedSkus,
      });
    }
}

export const editCatalog = async(props)=>{
    const { currentUseruid, firestore, catalog } = props;
    const userDocRef = doc(firestore, "Users", currentUseruid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      if(!userData.catalogs){
        userData.catalogs=[];
      }
      const updatedSkus = userData.catalogs.map(item=>item.id===catalog.id?catalog:item);
      await updateDoc(userDocRef, {
        catalogs: updatedSkus,
      });
    }
}

export const getCatalog = async ({ currentUseruid, firestore }) => {
  const userDoc = await getDoc(doc(firestore, "Users", currentUseruid));
  if (!userDoc.exists()) return [];

  const userData = userDoc.data();
  const catalogs = userData.catalogs ?? [];
  const userSkus = userData.skus ?? [];
  
  return catalogs.map(catalog => ({
    ...catalog,
    skus: (catalog.skus ?? [])
      .reduce((acc, skuId) => {
        const sku = userSkus.find(s => s.sku === skuId);
        if (sku) {
          const validPhotos = sku.photos.filter(photo => !photo.isDeleted);
          if (validPhotos.length > 0) {
            acc.push({ ...sku, photos: validPhotos });
          }
        }
        return acc;
      }, [])
  }));
};

export const deleteCatalog = async(props)=>{
  const { currentUseruid, firestore, ids } = props;
  const userDocRef = doc(firestore, "Users", currentUseruid);
  const userDoc = await getDoc(userDocRef);
  if(userDoc.exists()){
    const catalogs = userDoc.data().catalogs;
    const updatedCatalogs = catalogs.filter(item=>!ids.includes(item.id));
    await updateDoc(userDocRef, { catalogs: updatedCatalogs });
  }
}