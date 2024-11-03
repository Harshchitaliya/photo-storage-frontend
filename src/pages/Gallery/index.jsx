import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { storage, firestore } from '../../context/auth/connection/connection';
import { ref, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../../context/auth/AuthContext';
import { doc, getDoc } from 'firebase/firestore';

const Gallery = () => {
    const [photo, setPhoto] = useState([]);
    const { currentUseruid } = useAuth();
    useEffect(() => {
        if (currentUseruid) {
            handleShowPhoto();
        }
    }, [currentUseruid, photo]);


    const handleShowPhoto = useCallback(async () => {
        if (!currentUseruid) {
            console.log("No user ID found");
            return;
        }

        const userDocRef = doc(firestore, 'Users', currentUseruid);
        try {
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const photoPaths = userData.skus.flatMap(sku => sku.photos.map(photo => photo.url));

                const photoUrls = await Promise.all(
                    photoPaths.map(async (path) => {
                        const storageRef = ref(storage, path);
                        return await getDownloadURL(storageRef);
                    })
                );

                setPhoto(photoUrls);
            } else {
                console.log('No photos found');
            }
        } catch (error) {
            console.error("Error fetching photo:", error);
        }
    }, [currentUseruid]);



    return (
        <div className="">
            <div className="grid grid-cols-3 gap-4 mt-8">
                {photo.map((photoUrl, index) => (
                    <div
                        key={index}
                        className="aspect-square group relative overflow-hidden rounded-lg shadow-md"
                    >
                        <img
                            src={photoUrl}
                            alt={`Photo ${index}`}
                            className="w-full h-full object-cover transition-transform duration-200 
                                     group-hover:scale-110"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-200" />
                    </div>
                ))}
            </div>

        </div>
    )
};

export default Gallery;
