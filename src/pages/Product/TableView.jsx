import { Checkbox, Table, Button } from "flowbite-react";
import Loader from "../../components/Loader";

import {
  ShareIcon,
  DownloadIcon,
  DeleteIcon,
  SortDefaultIcon,
  SortAscIcon,
  SortDescIcon,
} from "../../components/Icon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const TableView = (props) => {
  const {
    filteredPhoto,
    selectedItems,
    handleSelectAll,
    handleDelete,
    loading,
    setSelectedItems,
  } = props;

  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const navigate = useNavigate();

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortedData = () => {
    if (!sortField) return filteredPhoto;

    return [...filteredPhoto].sort((a, b) => {
      if (sortField === "quantity" || sortField === "price") {
        const aValue = parseFloat(a[sortField]) || 0;
        const bValue = parseFloat(b[sortField]) || 0;

        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      const aValue = (a[sortField] || "").toString().toLowerCase();
      const bValue = (b[sortField] || "").toString().toLowerCase();

      if (sortDirection === "asc") {
        if (aValue < bValue) return -1;
        if (aValue > bValue) return 1;
        return 0;
      }
      
      if (aValue > bValue) return -1;
      if (aValue < bValue) return 1;
      return 0;
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
      <Table className="static rounded-b-lg">
        <Table.Head>
          <Table.HeadCell className="w-16">
            <Checkbox
              checked={
                selectedItems.length === filteredPhoto.length &&
                filteredPhoto.length > 0
              }
              onChange={handleSelectAll}
            />
          </Table.HeadCell>
          <Table.HeadCell>Media</Table.HeadCell>
          <Table.HeadCell
            className="cursor-pointer hover:bg-gray-700"
            onClick={() => handleSort("sku")}
          >
            <div className="flex items-center">
              SKU
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
          <Table.HeadCell
            className="cursor-pointer hover:bg-gray-700"
            onClick={() => handleSort("type")}
          >
            <div className="flex items-center">
              Product Type
              <SortIcon field="type" />
            </div>
          </Table.HeadCell>
          <Table.HeadCell
            className="cursor-pointer hover:bg-gray-700"
            onClick={() => handleSort("quantity")}
          >
            <div className="flex items-center">
              Quantity
              <SortIcon field="quantity" />
            </div>
          </Table.HeadCell>
          <Table.HeadCell
            className="cursor-pointer hover:bg-gray-700"
            onClick={() => handleSort("price")}
          >
            <div className="flex items-center">
              Price
              <SortIcon field="price" />
            </div>
          </Table.HeadCell>
          <Table.HeadCell>Actions</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {loading ? (
            <Table.Row>
              <Table.Cell colSpan={8} className="text-center">
                <Loader />
              </Table.Cell>
            </Table.Row>
          ) : (
            getSortedData().map((item, index) => (
              <Table.Row key={index} className="hover:bg-gray-800">
                <Table.Cell>
                  <Checkbox
                    checked={selectedItems.includes(item.sku)}
                    onChange={() => {
                      if (selectedItems.includes(item.sku)) {
                        setSelectedItems(
                          selectedItems.filter(
                            (url) => url !== item.sku
                          )
                        );
                      } else {
                        setSelectedItems([...selectedItems, item.sku]);
                      }
                    }}
                  />
                </Table.Cell>
                <Table.Cell className="cursor-pointer" onClick={() => navigate(`/products/${item.sku}/edit`)}>
                  {item.isVideo ? (
                    <video src={item.photos?.[0]?.downloadUrl} className="w-16 h-16 object-cover rounded" />
                  ) : (
                    <img
                      src={item.photos?.[0]?.downloadUrl}
                      alt="product"
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                </Table.Cell>
                <Table.Cell>{item.sku || "-"}</Table.Cell>
                <Table.Cell>{item.title || "-"}</Table.Cell>
                <Table.Cell>{item.description || "-"}</Table.Cell>
                <Table.Cell>{item.type || "-"}</Table.Cell>
                <Table.Cell>{item.quantity || "0"}</Table.Cell>
                <Table.Cell>{item.price || 0}</Table.Cell>
                <Table.Cell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      color="failure"
                      onClick={() => handleDelete(item.photos[0].url)}
                    >
                      <DeleteIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table>
    </div>
  );
};

export default TableView;
