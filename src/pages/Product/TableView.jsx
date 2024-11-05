import { Checkbox, Table, Button } from "flowbite-react";
import Loader  from "../../components/Loader";
import { ShareIcon, DownloadIcon, DeleteIcon } from "../../components/Icons";

const TableView = (props) => {
  const { filteredPhoto, selectedItems, handleSelectAll, handleShare, handleDownload, handleDelete, loading } = props;
  return   <div className="overflow-x-auto">
  <Table className="static rounded-b-lg">
    <Table.Head>
      <Table.HeadCell className="w-16">
        <Checkbox
          checked={selectedItems.length === filteredPhoto.length && filteredPhoto.length > 0}
          onChange={handleSelectAll}
        />
      </Table.HeadCell>
      <Table.HeadCell>Media</Table.HeadCell>
      <Table.HeadCell>SKU</Table.HeadCell>
      <Table.HeadCell>Description</Table.HeadCell>
      <Table.HeadCell>Product Type</Table.HeadCell>
      <Table.HeadCell>Quantity</Table.HeadCell>
      <Table.HeadCell>Views</Table.HeadCell>
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
        filteredPhoto.map((item, index) => (
          <Table.Row key={index} className="hover:bg-gray-800">
            <Table.Cell>
              <Checkbox
                checked={selectedItems.includes(item.downloadUrl)}
                onChange={() => {
                  if (selectedItems.includes(item.downloadUrl)) {
                    setSelectedItems(selectedItems.filter(url => url !== item.downloadUrl));
                  } else {
                    setSelectedItems([...selectedItems, item.downloadUrl]);
                  }
                }}
              />
            </Table.Cell>
            <Table.Cell>
              <img 
                src={item.downloadUrl} 
                alt="product" 
                className="w-16 h-16 object-cover rounded"
              />
            </Table.Cell>
            <Table.Cell>{item.sku || "-"}</Table.Cell>
            <Table.Cell>{item.description || "-"}</Table.Cell>
            <Table.Cell>{item.type || "-"}</Table.Cell>
            <Table.Cell>{item.quantity || "0"}</Table.Cell>
            <Table.Cell>{item.views || 0}</Table.Cell>
            <Table.Cell>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleShare(item.downloadUrl)}>
                  <ShareIcon className="w-4 h-4" />
                </Button>
                <Button size="sm" onClick={() => handleDownload(item.downloadUrl)}>
                  <DownloadIcon className="w-4 h-4" />
                </Button>
                <Button size="sm" color="failure" onClick={() => handleDelete([item.downloadUrl])}>
                  <DeleteIcon className="w-4 h-4" />
                </Button>
              </div>
            </Table.Cell>
          </Table.Row>
        ))
      )}
    </Table.Body>
  </Table>
</div>;
};

export default TableView;
