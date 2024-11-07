import { ref, getDownloadURL, deleteObject } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export const createNewCatalog = async(props)=>{
    const { currentUseruid, firestore, storage } = props;
    const userDocRef = doc(firestore, "Users", currentUseruid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      if(!userData.catalogs){
        userData.catalogs=[];
      }
      const updatedSkus = userData.catalogs.push(catalog);
      await updateDoc(userDocRef, {
        catalogs: updatedSkus,
      });
    }
}