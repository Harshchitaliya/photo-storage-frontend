import React, { useState, useEffect, useCallback } from "react";
import { storage, firestore } from "../../context/auth/connection/connection";
import { ref, getDownloadURL } from "firebase/storage";
import { useAuth } from "../../context/auth/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { isVideo } from "../../utils";
import Card from "./Card";
import { DeleteIcon, DownloadIcon, ShareIcon } from "../../components/Icons";
import { Button, Checkbox, Toast } from "flowbite-react";
import Loader from "../../components/Loader";
import DrawerComponent from "./drawer";

const Gallery = () => {
  const [photo, setPhoto] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { currentUseruid } = useAuth();
  useEffect(() => {
    if (drawerOpen) {
      setSelectedItems([]);
    }
  }, [drawerOpen]);
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
        const photoData = userData.skus
          .flatMap((sku) =>
            sku.photos.map((photo) => {
              if (photo.isDeleted) {
                return null;
              }
              return {
                url: photo.url,
                date: photo.date,
                sku: sku.sku,
                title: sku.title,
                description: sku.description,
                quantity: sku.quantity,
                price: sku.price,
                type: sku.type,
                isVideo: isVideo(photo.url),
              };
            })
          )
          .filter((photo) => photo !== null);

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
        setSelectedItems(photo.map((item) => item.downloadUrl));
      } else {
        setSelectedItems([]);
      }
    } else {
      if (selectedItems.length === photo.length) {
        setSelectedItems([]);
      } else {
        setSelectedItems(photo.map((item) => item.downloadUrl));
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
        const updatedSkus = userData.skus.map((sku) => ({
          ...sku,
          photos: sku.photos.map((photo) => ({
            ...photo,
            isDeleted: urls.includes(photo.url) ? true : photo.isDeleted,
          })),
        }));

        // Update the document with the modified skus
        await updateDoc(userDocRef, {
          skus: updatedSkus,
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

  const handleShare = (url) => {
    console.log(url);
  };
  const handleDownload = (url) => {
    console.log(url);
  };

  return (
    <div>
      {photo.length ? (
        <div className="flex items-center p-4">
          <Checkbox
            checked={selectedItems.length === photo.length}
            onChange={handleSelectAll}
          />
          <label className="ml-2 text-sm text-gray-500">Select All</label>
        </div>
      ) : null}

      <div className="flex flex-wrap justify-center items-center gap-6 mt-8">
        {loading ? (
          <div className="flex justify-center items-center h-screen">
            <Loader />
          </div>
        ) : null}
        {photo.map((photoUrl, index) => (
          <Card
            photoUrl={photoUrl}
            key={index}
            checkboxClick={setSelectedItems}
            checked={selectedItems}
            handleDownload={handleDownload}
            handleDelete={handleDelete}
            handleShare={handleShare}
            setDrawerOpen={setDrawerOpen}
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
