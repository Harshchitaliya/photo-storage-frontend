import { storage, firestore } from "../../context/auth/connection/connection";
import { useAuth } from "../../context/auth/AuthContext";
import { useState, useEffect } from "react";
import TableView from "./TableView";
import { Select, Button } from "flowbite-react";
import { HiSearch, HiFilter } from "react-icons/hi";
import { deleteCatalog, getCatalog } from "../../server";

const Catalog = () => {
  const { currentUseruid } = useAuth();
  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilter, setSearchFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

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

  // Filter data based on search term and filter type
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
        <div className="flex flex-col md:flex-row gap-3 ">
          <div className="relative">
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="Search catalogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <HiSearch className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </div>
          </div>
        </div>
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
