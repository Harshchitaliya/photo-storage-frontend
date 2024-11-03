import React, { useState, useEffect, useCallback } from 'react';
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
    }, [currentUseruid]);


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




    return (
        <div className="">
            
            <div className="grid grid-cols-3 gap-4 mt-8">
                {photo.map((photoUrl, index) => (
                    <div className="max-w-sm bg-[#1e1e1e] rounded-lg p-4 text-white" key={index}>
                    {/* Header with icon and filename */}
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                        <div className="bg-[#90c397] w-6 h-6 flex items-center justify-center rounded">
                            <span className="text-black text-sm font-medium">X</span>
                        </div>
                        <span className="text-white">7075831.xlsx</span>
                        </div>
                        <button className="text-gray-400 hover:text-white">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                        </svg>
                        </button>
                    </div>
        
                    {/* Preview area */}
                    <div className="bg-white rounded-lg mb-4 h-48">
                        {/* You can add a preview image or placeholder here */}
                    </div>
        
                    {/* Footer with user info and timestamp */}
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full overflow-hidden">
                        <img 
                            src="/path-to-user-avatar.jpg" 
                            alt="User avatar"
                            className="w-full h-full object-cover"
                        />
                        </div>
                        <span className="text-gray-400 text-sm">You opened • Oct 22, 2024</span>
                    </div>
                    </div>
                    // <div
                    //     key={index}
                    //     className="aspect-square group relative overflow-hidden rounded-lg shadow-md"
                    // >
                    //     <img
                    //         src={photoUrl}
                    //         alt={`Photo ${index}`}
                    //         className="w-full h-full object-cover transition-transform duration-200 
                    //                  group-hover:scale-110"
                    //         loading="lazy"
                    //     />
                    //     <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-200" />
                    // </div>
                    
                ))}
            </div>
        </div>
    );
};

export default Gallery;
