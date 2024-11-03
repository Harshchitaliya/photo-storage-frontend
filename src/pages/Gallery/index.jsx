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
                        return ({
                            url: photo.url,
                            isFavorite: photo.isFavorite || false,
                            isDelete: photo.isDelete || false,
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
                );

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

    return (

        <div className="flex flex-wrap justify-center items-center gap-6 mt-8">
            {loading ? (
                <div className="flex justify-center items-center h-screen">
                    <Loader />
                </div>
            ) : (
                <></>
            )}
            {photo.map((photoUrl, index) => (
                <Card photoUrl={photoUrl} key={index} />
            ))}
        </div>

    );
};

export default Gallery;
