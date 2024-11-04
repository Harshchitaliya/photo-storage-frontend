import React, { useState, useEffect } from "react";
import { storage, firestore } from "../../context/auth/connection/connection";
import { useAuth } from "../../context/auth/AuthContext";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import ProductCard from "../../components/ProductCard";
import { DeleteIcon, DownloadIcon, ShareIcon } from "../../components/Icons";
import { Button, Checkbox, Toast } from "flowbite-react";
import Loader from "../../components/Loader";
import DrawerComponent from "./drawer";
import SearchInput from "../../components/SearchInput";
import { setAllPhoto, deletePhoto } from "../../server";

const Gallery = () => {
    const [photo, setPhoto] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [filteredPhoto, setFilteredPhoto] = useState([]);
    const [type, setType] = useState("all");
    const { currentUseruid } = useAuth();
    useEffect(() => {
        let filtered = photo;
        if (search) {
            filtered = photo.filter((item) => item.allSearch.includes(search));
        }
        if (type !== "all") {
            filtered = filtered.filter((item) =>
                type === "image"
                    ? !item.isVideo
                    : type === "video"
                        ? item.isVideo
                        : true
            );
        }
        setFilteredPhoto(filtered);
    }, [search, photo, type]);

    useEffect(() => {
        if (drawerOpen) {
            setSelectedItems([]);
        }
    }, [drawerOpen]);

    useEffect(() => {
        handleShowPhoto();
    }, []);

    const handleShowPhoto = async () => {
        if(photo.length < 0){
            setLoading(true);
        }

        try {
            const allphotos = await setAllPhoto({
                currentUseruid,
                firestore,
                storage,
            });
            setPhoto(allphotos);
        } catch (error) {
            console.error("Error fetching photos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "a") {
                e.preventDefault();
                handleSelectAll();
            }

            if (e.keyCode === 27) {
                e.preventDefault();
                setSelectedItems([]);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [photo]);

    const handleSelectAll = (e) => {
        if (e?.target?.type === "checkbox") {
            if (e.target.checked) {
                setSelectedItems(photo.map((item) => item.url));
            } else {
                setSelectedItems([]);
            }
        } else {
            if (selectedItems.length === photo.length) {
                setSelectedItems([]);
            } else {
                setSelectedItems(photo.map((item) => item.url));
            }
        }
    };

    const handleDelete = async (urls) => {
        try{
            await deletePhoto({ urls, currentUseruid, firestore, handleShowPhoto, setSelectedItems })
            handleShowPhoto();
        } catch(error){
            console.log(error)
        }
    }

    const handleFavorite = async (urls) => {

        if (!urls || urls.length === 0) return;

        const userDocRef = doc(firestore, "Users", currentUseruid);
        try {
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const updatedSkus = userData.skus.map((sku) => ({
                    ...sku,
                    photos: sku.photos.map((photo) => ({
                        ...photo,
                        isFavorite: urls.includes(photo.url) ? !photo.isFavorite : photo.isFavorite,
                    })),
                }));

                await updateDoc(userDocRef, {
                    skus: updatedSkus,
                }).then(() => {
                    handleShowPhoto();
                });
            }
        } catch (error) {
            console.error("Error favorite photos:", error);
        }
    }

    const handleDownload = async (url) => {
        console.log(url);
    }

    const handleShare = async (url) => {
        console.log(url);
    }


        return (
            <div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center p-2">
                        <Checkbox
                            checked={selectedItems.length === filteredPhoto.length && filteredPhoto.length > 0}
                            onChange={handleSelectAll}
                        />
                        <label className="ml-2 text-sm text-gray-500">Select All</label>
                    </div>
                    <Button.Group className="flex items-center">
                        <Button
                            className={`rounded-r-none ${type === "all" ? "bg-gray-800" : ""
                                }`}
                            onClick={() => setType("all")}
                        >
                            All
                        </Button>
                        <Button
                            className={`rounded-l-none ${type === "image" ? "bg-gray-800" : ""
                                }`}
                            onClick={() => setType("image")}
                        >
                            Image
                        </Button>
                        <Button
                            className={`${type === "video" ? "bg-gray-800" : ""}`}
                            onClick={() => setType("video")}
                        >
                            Video
                        </Button>
                    </Button.Group>
                    <SearchInput onSearch={setSearch} />
                </div>


                <div
                    className="flex flex-wrap justify-center items-center gap-6 mt-3 overflow-y-auto"
                    style={{ height: "calc(100vh - 120px)" }}
                >
                    {loading ? (
                        <div className="flex justify-center items-center h-screen">
                            <Loader />
                        </div>
                    ) : null}
                    {filteredPhoto.map((photoUrl, index) => (
                        <ProductCard
                            photoUrl={photoUrl}
                            key={index}
                            checkboxClick={setSelectedItems}
                            checked={selectedItems}
                            handleDownload={handleDownload}
                            handleDelete={handleDelete}
                            handleShare={handleShare}
                            setDrawerOpen={setDrawerOpen}
                            handleFavorite={handleFavorite}
                        />
                    ))}
                </div>

                {selectedItems.length > 0 && (
                    <div className="fixed bottom-4 right-4">
                        <Toast>
                            <div className="flex items-center gap-4">
                                <span>{selectedItems.length} selected</span>
                                <Button onClick={() => handleDownload(selectedItems)}>
                                    <DownloadIcon />
                                </Button>
                                <Button onClick={() => handleDelete(selectedItems)}>
                                    <DeleteIcon />
                                </Button>
                                <Button onClick={() => handleShare(selectedItems)}>
                                    <ShareIcon />
                                </Button>
                            </div>
                        </Toast>
                    </div>
                )}
                {drawerOpen && (
                    <DrawerComponent
                        drawerOpen={drawerOpen}
                        setDrawerOpen={setDrawerOpen}
                        handleDownload={handleDownload}
                        handleDelete={handleDelete}
                        handleShare={handleShare}
                    />
                )}
            </div>
        );
    };
    export default Gallery;
