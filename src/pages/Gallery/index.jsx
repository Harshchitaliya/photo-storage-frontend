import React, { useState, useEffect, useCallback } from "react";
import { storage, firestore } from "../../context/auth/connection/connection";
import { ref, getDownloadURL } from "firebase/storage";
import { useAuth } from "../../context/auth/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { isVideo } from "../../utils";
import Card from "./Card";
import Loader from "../../components/Loader";

const Gallery = () => {
    const [photo, setPhoto] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const { currentUseruid } = useAuth();
    useEffect(() => {
        if (currentUseruid) {
            handleShowPhoto();
        }
    }, [currentUseruid]);

    const handleShowPhoto = useCallback(async () => {
        if (!currentUseruid) {
            console.log("No user ID found");
            return;
        }
        setLoading(true);

        const userDocRef = doc(firestore, "Users", currentUseruid);
        try {
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const photoData = userData.skus.flatMap((sku) =>
                    sku.photos.map((photo) => {
                        if (photo.isDeleted) {
                            return null;
                        }
                        return ({
                            url: photo.url,
                            date: photo.date,
                            sku: sku.sku,
                            title: sku.title,
                            description: sku.description,
                            quantity: sku.quantity,
                            price: sku.price,
                            type: sku.type,
                            isVideo: isVideo(photo.url)
                        })
                    })
                ).filter(photo => photo !== null);

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

                setPhoto(photosWithUrls);
            }
        } catch (error) {
            console.error("Error fetching photos:", error);
        } finally {
            setLoading(false);
        }
    }, [currentUseruid]);

    const handleSelectAll = () => {
        if (selectedItems.length === photo.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(photo.map((photo) => photo.downloadUrl));
        }
    }

    return (
        <div>
            <input type="checkbox" onChange={handleSelectAll} />
            <label >Select All</label>
            <div className="flex flex-wrap justify-center items-center gap-6 mt-8">
                {loading ? (
                    <div className="flex justify-center items-center h-screen">
                        <Loader />
                    </div>
                ) : (
                    <></>
                )}
                {photo.map((photoUrl, index) => (
                    <Card
                        photoUrl={photoUrl}
                        key={index}
                        checkboxClick={setSelectedItems}
                        checked={selectedItems}
                    />
                ))}
            </div>
        </div>


    );
};

export default Gallery;
