import { storage, firestore } from "../../context/auth/connection/connection";
import { useAuth } from "../../context/auth/AuthContext";
import { useState, useEffect } from "react";
import TableView from "./TableView";
import { Select, Button } from "flowbite-react";
import { HiSearch, HiFilter } from "react-icons/hi";
import { deleteCatalog, getCatalog } from "../../server";
import SearchInput from "../../components/SearchInput";
import { useNavigate } from "react-router-dom";

const Catalog = () => {
  const { currentUseruid } = useAuth();
  const navigate = useNavigate()
  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCatalogs = async () => {
    try {
      setLoading(true);
      const catalog = await getCatalog({ currentUseruid, firestore });
      setCatalogs(catalog);
    } catch (error) {
      console.error("Error fetching catalogs:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCatalogs();
  }, [currentUseruid]);

  const filteredCatalogs = catalogs.filter((item) => {
    const searchLower = searchTerm.toLowerCase().trim();

    if (!searchLower) return true;

    item?.title?.toLowerCase().includes(searchLower) ||
      item?.description?.toLowerCase().includes(searchLower);
  });

  const deleteCatalogHandler = async (ids) => {
    try {
      await deleteCatalog({ currentUseruid, firestore, ids });
      fetchCatalogs();
    } catch (error) {
      console.error("Error deleting catalog:", error);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between">
        <div>
          <Button onClick={() => navigate("/catalog/create")}>
            Create Catalog
          </Button>
        </div>
        <SearchInput  onSearch={setSearchTerm} />
      </div>
      <TableView
        catalogs={filteredCatalogs}
        loading={loading}
        deleteCatalog={deleteCatalogHandler}
      />
    </div>
  );
};

export default Catalog;
