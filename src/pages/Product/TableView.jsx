import { Checkbox, Table, Button } from "flowbite-react";
import Loader from "../../components/Loader";
import {
  ShareIcon,
  DownloadIcon,
  DeleteIcon,
  SortDefaultIcon,
  SortAscIcon,
  SortDescIcon,
} from "../../components/Icons";
import { useState } from "react";

const TableView = (props) => {
  const {
    filteredPhoto,
    selectedItems,
    handleSelectAll,
    handleShare,
    handleDownload,
    handleDelete,
    loading,
    setSelectedItems,
  } = props;

  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

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
        const aValue = Number(a[sortField] || 0);
        const bValue = Number(b[sortField] || 0);

        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      const aValue = a[sortField] || "";
      const bValue = b[sortField] || "";

      return sortDirection === "asc"
        ? aValue.toString().localeCompare(bValue.toString())
        : bValue.toString().localeCompare(aValue.toString());
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
                    checked={selectedItems.includes(item.downloadUrl)}
                    onChange={() => {
                      if (selectedItems.includes(item.downloadUrl)) {
                        setSelectedItems(
                          selectedItems.filter(
                            (url) => url !== item.downloadUrl
                          )
                        );
                      } else {
                        setSelectedItems([...selectedItems, item.downloadUrl]);
                      }
                    }}
                  />
                </Table.Cell>
                <Table.Cell>
                  <img
                    src={item.photos?.[0]?.downloadUrl}
                    alt="product"
                    className="w-16 h-16 object-cover rounded"
                  />
                </Table.Cell>
                <Table.Cell>{item.sku || "-"}</Table.Cell>
                <Table.Cell>{item.description || "-"}</Table.Cell>
                <Table.Cell>{item.type || "-"}</Table.Cell>
                <Table.Cell>{item.quantity || "0"}</Table.Cell>
                <Table.Cell>{item.price || 0}</Table.Cell>
                <Table.Cell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleShare(item.downloadUrl)}
                    >
                      <ShareIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleDownload(item.downloadUrl)}
                    >
                      <DownloadIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      color="failure"
                      onClick={() => handleDelete([item.downloadUrl])}
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
