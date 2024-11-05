import React, { useState, useEffect } from "react";
import { storage, firestore } from "../../context/auth/connection/connection";
import { useAuth } from "../../context/auth/AuthContext";
import ProductCard from "../../components/ProductCard";
import { DeleteIcon, RecycleIcon } from "../../components/Icons";
import { Button, Checkbox, Toast } from "flowbite-react";
import Loader from "../../components/Loader";
import SearchInput from "../../components/SearchInput";
import { showRecycle, permentDelete } from "../../server";

const Recycle = () => {
    const [photo, setPhoto] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [search, setSearch] = useState("");
    const [filteredPhoto, setFilteredPhoto] = useState([]);
    const { currentUseruid } = useAuth();
    useEffect(() => {
        let filtered = photo;
        if (search) {
            filtered = photo.filter((item) => item.allSearch.includes(search));
        }
      
        setFilteredPhoto(filtered);
    }, [search, photo]);

 

    useEffect(() => {
        handleShowPhoto();
    }, []);

    const handleShowPhoto = async () => {
        if(photo.length < 0){
            setLoading(true);
        }

        try {
            const allphotos = await showRecycle({
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

    const handleDelete = async (url) => {
        const urls = url;
        console.log(currentUseruid);
        try{
            await permentDelete({ urls, currentUseruid, firestore, storage })
            handleShowPhoto();
            setSelectedItems([]);
        }catch(error){
            console.error("Error deleting photos:", error);
        }

    }

    const handleRecycle = async (urls) => {
        
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
                        handleDelete={handleDelete}
                        handleRecycle={handleRecycle}
                    />
                ))}
            </div>

            {selectedItems.length > 0 && (
                <div className="fixed bottom-4 right-4">
                    <Toast>
                        <div className="flex items-center gap-4">
                            <span>{selectedItems.length} selected</span>
                          
                            <Button onClick={() => handleDelete(selectedItems)}>
                                <DeleteIcon />
                            </Button>
                            <Button onClick={() => handleRecycle(selectedItems)}>
                                <RecycleIcon />
                            </Button>

                        </div>
                    </Toast>
                </div>
            )}
            
        </div>
    );
};
export default Recycle;
