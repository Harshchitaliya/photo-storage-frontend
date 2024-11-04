import React, { useState, useEffect, useCallback } from "react";
import { storage, firestore } from "../../context/auth/connection/connection";
import { ref, getDownloadURL } from "firebase/storage";
import { useAuth } from "../../context/auth/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { isVideo } from "../../utils";
import Card from "./Card";
import Loader from "../../components/Loader";
import { Button, Checkbox, Spinner, Toast } from 'flowbite-react';

const Gallery = () => {
    const [photo, setPhoto] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const { currentUseruid } = useAuth();
    useEffect(() => {
        handleShowPhoto();
    }, []);

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

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
                e.preventDefault();
                handleSelectAll();
            }
            
            if (e.keyCode === 27) {
                e.preventDefault();
                setSelectedItems([]);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [photo]);

    const handleSelectAll = (e) => {
        if (e?.target?.type === 'checkbox') {
            if (e.target.checked) {
                setSelectedItems(photo.map(item => item.downloadUrl));
            } else {
                setSelectedItems([]);
            }
        } else {
            if (selectedItems.length === photo.length) {
                setSelectedItems([]);
            } else {
                setSelectedItems(photo.map(item => item.downloadUrl));
            }
        }
    };

    const handleDelete = async (urls) => {
        if (!urls || urls.length === 0) return;

        const userDocRef = doc(firestore, "Users", currentUseruid);
        try {
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const updatedSkus = userData.skus.map(sku => ({
                    ...sku,
                    photos: sku.photos.map(photo => ({
                        ...photo,
                        isDeleted: urls.includes(photo.url) ? true : photo.isDeleted
                    }))
                }));

                // Update the document with the modified skus
                await updateDoc(userDocRef, {
                    skus: updatedSkus
                }).then(() => {
                    handleShowPhoto();
                    setSelectedItems([]);
                    alert("Photos deleted successfully");
                });


            }
        } catch (error) {
            console.error("Error deleting photos:", error);
        }
    };

    return (
        <div>
            

<div class="text-center">
   <button class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" type="button" data-drawer-target="drawer-right-example" data-drawer-show="drawer-right-example" data-drawer-placement="right" aria-controls="drawer-right-example">
   Show right drawer
   </button>
</div>

<div id="drawer-right-example" class="fixed top-0 right-0 z-40 h-screen p-4 overflow-y-auto transition-transform translate-x-full bg-white w-80 dark:bg-gray-800" tabindex="-1" aria-labelledby="drawer-right-label">
    <h5 id="drawer-right-label" class="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400"><svg class="w-4 h-4 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
  </svg>Right drawer</h5>
   <button type="button" data-drawer-hide="drawer-right-example" aria-controls="drawer-right-example" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white" >
      <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
         <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
      </svg>
      <span class="sr-only">Close menu</span>
   </button>
   <p class="mb-6 text-sm text-gray-500 dark:text-gray-400">Supercharge your hiring by taking advantage of our <a href="#" class="text-blue-600 underline font-medium dark:text-blue-500 hover:no-underline">limited-time sale</a> for Flowbite Docs + Job Board. Unlimited access to over 190K top-ranked candidates and the #1 design job board.</p>
   <div class="grid grid-cols-2 gap-4">
      <a href="#" class="px-4 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Learn more</a>
      <a href="#" class="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Get access <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
  </svg></a>
   </div>
</div>

            {photo.length ? (
                <div className="flex items-center p-4">
                    <Checkbox 
                        checked={selectedItems.length === photo.length}
                        onChange={handleSelectAll}
                    />
                    <label className="ml-2 text-sm text-gray-500">
                        Select All (Ctrl+A) • Press Esc to deselect
                    </label>
                </div>
            ) : null}

            <div className="flex flex-wrap justify-center items-center gap-6 mt-8">
                {loading ? (
                    <div className="flex justify-center items-center h-screen">
                        <Spinner size="xl" />
                    </div>
                ) : null}
                {photo.map((photoUrl, index) => (
                    <Card
                        photoUrl={photoUrl}
                        key={index}
                        checkboxClick={setSelectedItems}
                        checked={selectedItems}
                    />
                ))}
            </div>

            {selectedItems.length > 0 && (
                <div className="fixed bottom-4 right-4">
                    <Toast>
                        <div className="flex items-center gap-4">
                            <span>{selectedItems.length} items selected</span>
                            <Button 
                                size="sm" 
                                color="failure"
                                onClick={() => setSelectedItems([])}
                            >
                                Clear Selection
                            </Button>
                        </div>
                    </Toast>
                </div>
            )}
        </div>
    );
};

export default Gallery;
