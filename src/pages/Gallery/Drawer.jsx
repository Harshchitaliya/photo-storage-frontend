import { Button, Drawer } from "flowbite-react";
import moment from "moment";
import { DownloadIcon, ShareIcon, DeleteIcon } from "../../components/Icons";

const DrawerComponent = (props) => {
  const { drawerOpen, setDrawerOpen, handleDownload, handleShare, handleDelete } = props;

  const handleClose = () => setDrawerOpen(false);
    console.log(drawerOpen);
  return (
    <Drawer open={drawerOpen} position="right" className="w-2/4">
      <Drawer.Items>
        <div className="flex justify-end p-4">
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4">
        <div className="text-lg font-medium mb-2">{drawerOpen.title}</div>
          <div className="mb-6">
            <div className=" h-80 flex  justify-center">
                <img 
                src={drawerOpen?.downloadUrl} 
                alt="Selected image" 
                className="rounded-lg"
                />
            </div>
            <div className="flex gap-2 mt-4 justify-end">
              <Button onClick={handleDownload}>
                <DownloadIcon />
            </Button>
            <Button onClick={handleShare}   >
                <ShareIcon />
            </Button>
            <Button onClick={handleDelete}   >
                <DeleteIcon />
            </Button>
            </div>  
          </div>
          <div className="space-y-4">
            {drawerOpen.date && <div>
              <div className="text-lg font-medium">Date captured</div>
              <div className="text-gray-600">{moment(drawerOpen.date).format("MMM DD, YYYY")}</div>
            </div>}
            {drawerOpen?.sku &&<div>
              <div className="text-lg font-medium">SKU</div>
              <div className="text-gray-600">{drawerOpen?.sku}</div>
            </div>}
            {drawerOpen?.description &&<div>
              <div className="text-lg font-medium">Description</div>
              <div className="text-gray-600">{drawerOpen?.description}</div>
            </div>}
          </div>
        </div>
      </Drawer.Items>
    </Drawer>
  );
}

export default DrawerComponent;