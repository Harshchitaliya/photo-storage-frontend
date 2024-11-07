import React, { useState, useEffect } from "react";
import { storage, firestore } from "../../context/auth/connection/connection";
import { useAuth } from "../../context/auth/AuthContext";
import ProductCard from "../../components/ProductCard";
import { Button, Checkbox } from "flowbite-react";
import Loader from "../../components/Loader";
import DrawerComponent from "./Drawer";
import SearchInput from "../../components/SearchInput";
import { setAllPhoto, deletePhoto, setFavorite } from "../../server";
import { ref, getDownloadURL } from "firebase/storage";
import Selectaction from "../../components/Selectaction";
import { downloadFiles } from "../../server/photo";

const buttonList = [
    { type: "all", label: "All" },
    { type: "image", label: "Image" },
    { type: "video", label: "Video" },
    { type: "favorite", label: "Favorite" },
];

const Gallery = () => {
    const [photo, setPhoto] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [filteredPhoto, setFilteredPhoto] = useState([]);
    const [type, setType] = useState("all");
    const { currentUseruid } = useAuth();
    const galleryphoto = true;
    const isrecycle = false;

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
                        : item.isFavorite
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
        setLoading(true)

        try {
            const allphotos = await setAllPhoto({
                currentUseruid,
                firestore,
                storage,
                galleryphoto,
            });
            setPhoto(allphotos);
        } catch (error) {
            console.error("Error fetching photos:", error);
        }
        finally {
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
        try {
            setLoading(true);
            await deletePhoto({ urls, currentUseruid, firestore, isrecycle });
            await handleShowPhoto();
            setSelectedItems([]);
            setDrawerOpen(false);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleFavorite = async (urls) => {
        try {
            setLoading(true);
            await setFavorite({
                urls,
                currentUseruid,
                firestore,
                handleShowPhoto,
                setSelectedItems,
            });
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (urls) => {
        setLoading(true);
        try {
            await downloadFiles({ urls, storage });
        } catch (error) {
            console.error('Error downloading:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleShare = async (imageRefs) => {
        setLoading(true);
        try {
            // Convert single imageRef to array if needed
            const refs = Array.isArray(imageRefs) ? imageRefs : [imageRefs];

            // Get all files
            const files = await Promise.all(
                refs.map(async (imageRef) => {
                    const storageRef = ref(storage, imageRef);
                    const downloadUrl = await getDownloadURL(storageRef);
                    const response = await fetch(downloadUrl);
                    const blob = await response.blob();
                    return new File(
                        [blob],
                        imageRef.split('/').pop() || 'image.jpg',
                        {
                            type: 'image/jpeg',
                            lastModified: new Date().getTime()
                        }
                    );
                })
            );

            // Check if sharing is supported
            if (!navigator.canShare || !navigator.canShare({ files })) {
                throw new Error('Your browser does not support sharing these files');
            }

            // Share the files
            await navigator.share({
                files,
                title: files.length === 1 ? 'Share Image' : 'Share Images',
                text: files.length === 1 ? 'Check out this image!' : 'Check out these images!'
            });

        } catch (error) {
            console.error('Error sharing:', error);
            // Provide user feedback
            alert(error.message || 'Failed to share images. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
                    <Loader />
                </div>
            )}

            <div className="flex flex-wrap items-center sm:justify-between  gap-2">
                <div className="flex items-center p-2">
                    <Checkbox
                        className="cursor-pointer"
                        checked={
                            selectedItems.length === filteredPhoto.length &&
                            filteredPhoto.length > 0
                        }
                        onChange={handleSelectAll}
                    />
                    <label
                        className="ml-2 text-sm text-gray-500 cursor-pointer sm:text-base hidden sm:block"
                        onClick={handleSelectAll}
                    >
                        Select All
                    </label>
                </div>
                <Button.Group className="flex items-center">
                    {buttonList.map(({ type: buttonType, label, className }) => (
                        <Button
                            key={buttonType}

                            className={` ${type === buttonType ? "dark:bg-gray-700" : ""
                                }`}
                            onClick={() => setType(buttonType)}
                        >
                            {label}
                        </Button>
                    ))}
                </Button.Group>
                <SearchInput onSearch={setSearch} />
            </div>

            <div
                className="flex flex-wrap justify-center items-center gap-6 mt-3 overflow-y-auto"
                style={{ height: "calc(100vh - 120px)" }}
            >
                {filteredPhoto.length > 0 ? (
                    filteredPhoto.map((photoUrl, index) => (
                        <ProductCard
                            photoUrl={photoUrl}
                            key={index}
                            checkboxClick={setSelectedItems}
                            checked={selectedItems}
                            handleDelete={handleDelete}
                            handleShare={handleShare}
                            setDrawerOpen={setDrawerOpen}
                            handleFavorite={handleFavorite}
                            handleDownload={handleDownload}
                        />
                    ))
                ) : !loading && (
                    (<p className="text-center text-gray-500 text-sm">No photos found</p>)
                )}
            </div>

            <Selectaction
                selectedItems={selectedItems}
                handleCancel={() => setSelectedItems([])}
                handleDelete={handleDelete}
                handleShare={handleShare}
                handleDownload={handleDownload}
            />

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
