import { useAuth } from "../../context/auth/AuthContext";
import { useState, useEffect, useCallback } from "react";
import { storage, firestore } from "../../context/auth/connection/connection";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import ProductCard from "../../components/ProductCard";
import { TableIcon, GridIcon } from "../../components/Icons";
import { Button, Checkbox } from "flowbite-react";
import FilterModal from "./FilterModal";
import SearchInput from "../../components/SearchInput";
import { showsku } from "../../server/photo";
import TableView from "./TableView";
import moment from "moment";
import Selectaction from "../../components/Selectaction";
const buttonList = [
  { type: "table", icon: <TableIcon /> },
  { type: "grid", icon: <GridIcon /> },
];
const Product = () => {
  const [photo, setPhoto] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [allFilter, setAllFilter] = useState({});
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filteredPhoto, setFilteredPhoto] = useState([]);
  const [viewType, setViewType] = useState("grid");
  useEffect(() => {
    let filtered = photo;
    if (allFilter.search) {
      filtered = photo.filter((item) =>
        item.allSearch.includes(allFilter.search)
      );
    }
    if (allFilter.type) {
      filtered = filtered.filter((item) => item.type === allFilter.type);
    }
    if (allFilter.price) {
      filtered = filtered.filter((item) => item.price <= allFilter.price);
    }
    if (allFilter.quantity) {
      filtered = filtered.filter((item) => item.quantity <= allFilter.quantity);
    }
    if (allFilter.date) {
      filtered = filtered.filter((item) =>
        moment(item.date).isSame(allFilter.date, "day")
      );
    }
    setFilteredPhoto(filtered);
    setSelectedItems([]);
  }, [allFilter, photo]);

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
      const allphotos = await showsku({
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
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Checkbox
            checked={
              selectedItems.length === filteredPhoto.length &&
              filteredPhoto.length > 0
            }
            onChange={handleSelectAll}
          />
          <label className="ml-2 text-sm text-gray-500">Select All</label>
        </div>
        <div className="flex items-center">
          <Button.Group>
            {buttonList.map(({ type, icon }) => (
              <Button
                key={type}
                onClick={() => setViewType(type)}
                className={`${viewType === type ? "dark:bg-gray-700" : ""}`}
              >
                {icon}
              </Button>
            ))}
          </Button.Group>
          <SearchInput
            onSearch={(e) => setAllFilter({ ...allFilter, search: e })}
            filter={() => setFilterModalOpen(true)}
          />
        </div>
      </div>
      {viewType === "table" && (
        <TableView
          filteredPhoto={filteredPhoto}
          selectedItems={selectedItems}
          handleSelectAll={handleSelectAll}
          handleShare={handleShare}
          handleDownload={handleDownload}
          handleDelete={handleDelete}
          loading={loading}
          setSelectedItems={setSelectedItems}
        />
      )}

      {viewType === "grid" && (
        <div
          className="flex flex-wrap justify-center items-center gap-6 mt-3 overflow-y-auto"
          style={{ height: "calc(100vh - 120px)" }}
        >
          {filteredPhoto.map((photoUrl, index) => (
            <ProductCard
              photoUrl={photoUrl}
              key={index}
              checkboxClick={setSelectedItems}
              checked={selectedItems}
              handleDownload={() => handleDownload(photoUrl.downloadUrl)}
              handleDelete={() => handleDelete(photoUrl.url)}
              handleShare={() => handleShare(photoUrl.url)}
              setDrawerOpen={setDrawerOpen}
            />
          ))}
        </div>
      )}
      <Selectaction
        selectedItems={selectedItems}
        handleCancel={() => setSelectedItems([])}
        handleDelete={handleDelete}
        handleShare={handleShare}
        handleDownload={handleDownload}
      />

      <FilterModal
        isOpen={filterModalOpen}
        setIsOpen={setFilterModalOpen}
        onApply={setAllFilter}
      />
    </div>
  );
};

export default Product;
