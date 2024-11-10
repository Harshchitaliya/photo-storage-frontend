import { doc, getDoc, updateDoc } from "firebase/firestore";

export const Deletesku = async (props) => {
    const { urls, currentUseruid, firestore } = props
    if (urls.length === 0) return;
    const userDocRef = doc(firestore, "Users", currentUseruid);
    try {
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const updatedSkus = {};

            // Convert object entries and update each SKU
            Object.entries(userData.skus).forEach(([skuId, skuData]) => {
                if (urls.includes(skuId)) {
                    updatedSkus[skuId] = {
                        ...skuData,
                        photos: skuData.photos.map((photo) => ({
                            ...photo,
                            isDeleted: true,
                        })),
                    };
                } else {
                    updatedSkus[skuId] = skuData;
                }
            });

            await updateDoc(userDocRef, {
                skus: updatedSkus,
            })  
        }
    } catch (error) {
        console.error("Error deleting photos:", error);
    }
};