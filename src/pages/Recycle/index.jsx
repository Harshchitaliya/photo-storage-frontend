import React, { useState, useEffect } from "react";
import { storage, firestore } from "../../context/auth/connection/connection";
import { useAuth } from "../../context/auth/AuthContext";
import ProductCard from "../../components/ProductCard";
import { Button, Checkbox, Toast } from "flowbite-react";
import Loader from "../../components/Loader";
import SearchInput from "../../components/SearchInput";
import { setAllPhoto, deletePhoto, permentDelete } from "../../server";
import Selectaction from "../../components/Selectaction";

const buttonList = [
  { type: "all", label: "All" },
  { type: "image", label: "Image" },
  { type: "video", label: "Video" },
  { type: "favorite", label: "Favorite" },
];

const Recycle = () => {
  const [photo, setPhoto] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredPhoto, setFilteredPhoto] = useState([]);
  const [type, setType] = useState("all");
  const { currentUseruid } = useAuth();
  const galleryphoto = false;
  const isrecycle = true;

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
    handleShowPhoto();
  }, []);

  const handleShowPhoto = async () => {
    if (photo.length < 0) {
      setLoading(true);
    }

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
    try {
      setLoading(true);
      await permentDelete({ urls, currentUseruid, firestore, storage });
      handleShowPhoto();
      setSelectedItems([]);
    } catch (error) {
      console.error("Error deleting photos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecycle = async (urls) => {
    try {
      setLoading(true);
      await deletePhoto({ urls, currentUseruid, firestore, isrecycle });
      handleShowPhoto();
      setSelectedItems([]);
    } catch (error) {
      console.log(error);
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
              className={`${type === buttonType ? "dark:bg-gray-700" : ""}`}
              size="sm"
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
              key={index}
              photoUrl={photoUrl}
              checked={selectedItems}
              checkboxClick={setSelectedItems}
              handleDelete={() => handleDelete([photoUrl.url])}
              handleRecycle={() => handleRecycle([photoUrl.url])}
            />
          ))
        ) :!loading && (
          (<p className="text-center text-gray-500 text-sm">No photos found</p>)
      )}
      </div>

      <Selectaction
        selectedItems={selectedItems}
        handleCancel={() => setSelectedItems([])}
        handleDelete={handleDelete}
        handleRecycle={handleRecycle}
      />
    </div>
  );
};
export default Recycle;
