import { Checkbox, Table, Button } from "flowbite-react";
import Loader from "../../components/Loader";

import {
  SortDefaultIcon,
  SortAscIcon,
  SortDescIcon,
} from "../../components/Icon";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DeleteIcon } from "../../components/Icon";
import Selectaction from "../../components/Selectaction";
import { EditIcon } from "../../components/Icon";
const TableView = (props) => {
  const {
    catalogs = [],
    loading = false,
    deleteCatalog,
  } = props;

  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedIds, setSelectedIds] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "a") {
        e.preventDefault();
        setSelectedIds(catalogs.map(item=>item.id))
      }

      if (e.keyCode === 27) {
        e.preventDefault();
        setSelectedIds([]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortedData = () => {
    if (!sortField) return catalogs;

    return [...catalogs].sort((a, b) => {
      if (sortField === "quantity" || sortField === "price") {
        const aValue = Number(a[sortField] || 0);
        const bValue = Number(b[sortField] || 0);

        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      const aValue = (a[sortField] || "").toString().toLowerCase();
      const bValue = (b[sortField] || "").toString().toLowerCase();

      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) {
      return <SortDefaultIcon />;
    }
    return sortDirection === "asc" ? <SortAscIcon /> : <SortDescIcon />;
  };

  return (
    <div className="overflow-x-auto my-4 sm:w-full w-11/12">
      {catalogs.length === 0 && !loading && (
        <div className="text-center text-gray-500 my-4">
          No items found. Try adjusting your search criteria.
        </div>
      )}

      <Table className="static rounded-b-lg">
        <Table.Head>
          <Table.HeadCell className="w-16">
            <div className="flex items-center">
              <Checkbox checked={selectedIds.length===catalogs.length} onChange={()=>setSelectedIds(catalogs.map(item=>item.id))} />
            </div>
          </Table.HeadCell>

          <Table.HeadCell
            className="cursor-pointer hover:bg-gray-700"
            onClick={() => handleSort("sku")}
          >
            <div className="flex items-center">
              SKUS
              <SortIcon field="sku" />
            </div>
          </Table.HeadCell>
          <Table.HeadCell
            className="cursor-pointer hover:bg-gray-700"
            onClick={() => handleSort("title")}
          >
            <div className="flex items-center">
              Title
              <SortIcon field="title" />
            </div>
          </Table.HeadCell>
          <Table.HeadCell
            className="cursor-pointer hover:bg-gray-700"
            onClick={() => handleSort("description")}
          >
            <div className="flex items-center">
              Description
              <SortIcon field="description" />
            </div>
          </Table.HeadCell>
          <Table.HeadCell className="cursor-pointer hover:bg-gray-700">
            <div className="flex items-center">Actions</div>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {loading ? (
            <Table.Row>
              <Table.Cell colSpan={8} className="text-center">
                <Loader />
              </Table.Cell>
            </Table.Row>
          ) : (
            getSortedData().map((item, index) => {
              console.log("Rendering row for item:", item);
              return (
                <Table.Row key={item.id || index} className="hover:bg-gray-800">
                  <Table.Cell>
                    <Checkbox
                      checked={selectedIds.includes(item.id)}
                      onChange={() =>
                        setSelectedIds(prev=>prev.includes(item.id)?prev.filter(id=>id!==item.id):[...prev,item.id])
                      }
                    />
                  </Table.Cell>
                  <Table.Cell>{item?.skus?.length || "-"}</Table.Cell>
                  <Table.Cell>{item?.title || "-"}</Table.Cell>
                  <Table.Cell>{item?.description || "-"}</Table.Cell>
                  <Table.Cell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      color="failure"
                      onClick={() => deleteCatalog([item.id])}
                    >
                      <DeleteIcon className="w-4 h-4" />
                    </Button>
                    <Button size="sm" color="gray" onClick={()=>navigate(`/catalog/${item.id}/edit`)}>
                      <EditIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              );
            })
          )}
        </Table.Body>
      </Table>
      <Selectaction
        selectedItems={selectedIds}
        handleCancel={() => setSelectedIds([])}
        handleDelete={() => deleteCatalog(selectedIds)}
      />
    </div>
  );
};

export default TableView;
