import React, { useState, useEffect, useCallback } from 'react';
import { storage, firestore } from '../../context/auth/connection/connection';
import { ref, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../../context/auth/AuthContext';
import { doc, getDoc } from 'firebase/firestore';

const Gallery = () => {
    const [photos, setPhotos] = useState([]);
    const { currentUseruid } = useAuth();

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
                const photoData = userData.skus.flatMap(sku => 
                    sku.photos.map(photo => ({
                        url: photo.url,
                        isFavorite: photo.isFavorite || false,
                        isDelete: photo.isDelete || false,
                        date: photo.date,
                        sku: sku.sku,
                        title: sku.title,
                        description: sku.description,
                        quantity: sku.quantity,
                        price: sku.price
                    }))
                );

                const photosWithUrls = await Promise.all(
                    photoData.map(async (photo) => {
                        const storageRef = ref(storage, photo.url);
                        const downloadUrl = await getDownloadURL(storageRef);
                        return {
                            ...photo,
                            downloadUrl
                        };
                    })
                );

                setPhotos(photosWithUrls);
            }
        } catch (error) {
            console.error("Error fetching photos:", error);
        }
    }, [currentUseruid]);

    useEffect(() => {
        if (currentUseruid) {
            handleShowPhoto();
        }
    }, [currentUseruid, handleShowPhoto]);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Product Gallery</h1>

            <div className="grid grid-cols-3 gap-4 mt-8">
                {photos.map((photo, index) => (
                    <div 
                        key={index} 
                        className="aspect-square group relative overflow-hidden rounded-lg shadow-md"
                    >
                        <img 
                            src={photo.downloadUrl} 
                            alt={photo.title || `Photo ${index}`}
                            className="w-full h-full object-cover transition-transform duration-200 
                                     group-hover:scale-110"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 
                                      transition-opacity duration-200">
                            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                <p className="font-bold">{photo.title}</p>
                                <p>SKU: {photo.sku}</p>
                                <p>Price: ${photo.price}</p>
                                <p>modify Date: {photo.date}</p>
                                {photo.isFavorite && <span>⭐ Favorite</span>}
                                {photo.isDelete && <span>🗑️ Marked for deletion</span>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Gallery;
