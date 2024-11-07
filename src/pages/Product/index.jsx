import { useAuth } from "../../context/auth/AuthContext";
import { useState, useEffect, useCallback } from "react";
import { storage, firestore } from "../../context/auth/connection/connection";
import ProductCard from "../../components/ProductCard";
import { TableIcon, GridIcon } from "../../components/Icon";
import { Button, Checkbox } from "flowbite-react";
import FilterModal from "./FilterModal";
import SearchInput from "../../components/SearchInput";
import { showsku } from "../../server/photo";
import TableView from "./TableView";
import moment from "moment";
import Selectaction from "../../components/Selectaction";
import { Deletesku } from "../../server/product";
import Loader from "../../components/Loader";
import { useNavigate } from "react-router-dom";

const buttonList = [
  { type: "table", icon: <TableIcon /> },
  { type: "grid", icon: <GridIcon /> },
];
const Product = () => {
  const [photo, setPhoto] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [allFilter, setAllFilter] = useState({});
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filteredPhoto, setFilteredPhoto] = useState([]);
  const [viewType, setViewType] = useState("grid");
  const navigate = useNavigate();

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
  }, []);

  const handleSelectAll = (e) => {
    if (e?.target?.type === "checkbox") {
      if (e.target.checked) {
        setSelectedItems(filteredPhoto.map((item) => item.sku));
      } else {
        setSelectedItems([]);
      }
    } else {
      if (selectedItems.length === filteredPhoto.length) {
        setSelectedItems([]);
      } else {
        setSelectedItems(filteredPhoto.map((item) => item.sku));
      }
    }
  };

  const handleDelete = async (urls) => {
    try {
      setLoading(true);
      await Deletesku({
        urls,
        currentUseruid,
        firestore,
      });

      handleShowPhoto();
      setSelectedItems([]);

    } catch (error) {
      console.error("Error deleting photos:", error);
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


  const handleShare = (url) => {
    console.log(url);
  };

  const handleDownload = (url) => {
    console.log(url);
  };

  return (
    <div>
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <Loader />
        </div>
      )}
      <div className="flex flex-wrap items-center sm:justify-between  gap-2">
        <div className="flex items-center">
          <Checkbox
            className="cursor-pointer"
            checked={
              selectedItems.length === filteredPhoto.length &&
              filteredPhoto.length > 0
            }
            onChange={handleSelectAll}
          />
          <label className="ml-2 text-sm text-gray-500 sm:text-base hidden sm:block cursor-pointer" onClick={handleSelectAll}>
            Select All
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button.Group>
            {buttonList.map(({ type, icon }) => (
              <Button
                size="sm"
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

      <div
        className="flex flex-wrap justify-center items-center gap-6 mt-3 overflow-y-auto"
        style={{ height: "calc(100vh - 120px)" }}
      >
        {filteredPhoto.length > 0 ? (viewType === "table" && (
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
        )) : !loading && (
          (<p className="text-center text-gray-500 text-sm">No photos found</p>)
        )}

        {viewType === "grid" &&
          filteredPhoto.map((photoUrl, index) => (
            <ProductCard
              photoUrl={photoUrl}
              key={index}
              checkboxClick={setSelectedItems}
              checked={selectedItems}
              handleDownload={() => handleDownload(photoUrl.downloadUrl)}
              handleDelete={() => handleDelete([photoUrl.sku])}
              handleShare={() => handleShare(photoUrl.url)}
              setDrawerOpen={()=>navigate(`/products/${photoUrl?.sku}/edit`)}
              type={"product"}
            />
          ))}
      </div>
      <Selectaction
        selectedItems={selectedItems}
        handleCancel={() => setSelectedItems([])}
        handleDelete={() => handleDelete(selectedItems)}
        handleShare={handleShare}
        handleDownload={handleDownload}
      />

      <FilterModal
        isOpen={filterModalOpen}
        setIsOpen={setFilterModalOpen}
        onApply={setAllFilter}
        defaultFilters={allFilter}
      />
    </div>
  );
};

export default Product;
