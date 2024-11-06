import { doc, getDoc, updateDoc } from "firebase/firestore";

export const Deletesku = async (props) => {
    const { urls, currentUseruid, firestore } = props
    if (urls.length === 0) return;
    const userDocRef = doc(firestore, "Users", currentUseruid);
    try {
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const updatedSkus = userData.skus.map((sku) => {

                if (urls.includes(sku.sku)) {
                    return ({
                        ...sku,
                        photos: sku.photos.map((photo) => ({
                            ...photo,
                            isDeleted: true,
                        })),
                    })
                }
                return sku
            })

            await updateDoc(userDocRef, {
                skus: updatedSkus,
            })  
        }
    } catch (error) {
        console.error("Error deleting photos:", error);
    }
};