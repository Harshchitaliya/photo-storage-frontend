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