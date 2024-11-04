
import { useAuth } from "../../context/auth/AuthContext";
import { useState, useEffect, useCallback } from "react";
import { storage, firestore } from "../../context/auth/connection/connection";
import { ref, getDownloadURL } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { isVideo } from "../../utils";
import ProductCard from "../../components/ProductCard";
import { DeleteIcon, DownloadIcon, ShareIcon } from "../../components/Icons";
import { Button, Checkbox, Toast } from "flowbite-react";
import Loader from "../../components/Loader";
// import DrawerComponent from "./drawer";
import FilterModal from "./FilterModal";
import SearchInput from "../../components/SearchInput";
import { setAllPhoto } from "../../server/photo";
const Product = () => {
  const [photo, setPhoto] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [allFilter, setAllFilter] = useState({});
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filteredPhoto, setFilteredPhoto] = useState([]);
  useEffect(() => {
    let filtered = photo;
    if (search) {
      filtered = photo.filter((item) => item.allSearch.includes(search));
    }
    setFilteredPhoto(filtered);
  }, [search, photo]);
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
    setLoading(true);
    try {
      const allphotos = await setAllPhoto({
        currentUseruid,
        firestore,
        storage,
      });
      setPhoto(allphotos);
    } catch (error) {
      console.log("Error fetching photos:", error);
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
      <div className="flex items-center justify-between">
        <div className="flex items-center p-2">
          <Checkbox
            checked={selectedItems.length === filteredPhoto.length && filteredPhoto.length > 0}
            onChange={handleSelectAll}
          />
          <label className="ml-2 text-sm text-gray-500">Select All</label>
        </div>
        <SearchInput onSearch={setSearch} filter={() => setFilterModalOpen(true)} />
      </div>
      <div className="flex flex-wrap justify-center items-center gap-6 mt-3 overflow-y-auto" style={{ height: "calc(100vh - 120px)" }}>
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
      {/* {drawerOpen && (
        <DrawerComponent
          drawerOpen={drawerOpen}
          setDrawerOpen={setDrawerOpen}
          handleDownload={handleDownload}
          handleDelete={handleDelete}
          handleShare={handleShare}
        />
      )} */}
      {filterModalOpen && <FilterModal isOpen={filterModalOpen} setIsOpen={setFilterModalOpen} />}
    </div>
  );
};

export default Product;
