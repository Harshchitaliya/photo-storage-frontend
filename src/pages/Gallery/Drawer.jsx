import { Button, Drawer } from "flowbite-react";
import moment from "moment";
import { DownloadIcon, ShareIcon, DeleteIcon } from "../../components/Icon";
import { useState, useRef } from "react";

const DrawerComponent = (props) => {
  const { drawerOpen, setDrawerOpen, handleDownload, handleShare, handleDelete } = props;
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);


  const handleClose = () => setDrawerOpen(false);

  const handleVideoPlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <Drawer open={drawerOpen} onClose={()=>handleClose(true)}  position="right" className="sm:w-2/4 w-full">
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
            <div className="h-80 flex justify-center">
              {drawerOpen?.isVideo ? (
                <div className="relative w-full h-full flex justify-center items-center">
                  <video
                    ref={videoRef}
                    id="mediaPlayer"
                    src={drawerOpen?.downloadUrl}
                    className="rounded-lg max-h-full"
                    controls={false}
                    
                  />
                  
                  <button
                    onClick={handleVideoPlayPause}
                    className="absolute inset-0 flex items-center justify-center  bg-opacity-30 hover:bg-opacity-40 transition-opacity"
                  >
                    {!isPlaying && (
                      <svg
                        className="w-20 h-20 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              ) : (
                <img 
                  src={drawerOpen?.downloadUrl} 
                  alt="Selected image" 
                  className="rounded-lg"
                />
              )}
            </div>
            <div className="flex gap-2 mt-4 justify-end">
              <Button onClick={() => handleDownload(drawerOpen?.url)}>
                <DownloadIcon />
            </Button>
            <Button onClick={() => handleShare(drawerOpen?.url)}   >
                <ShareIcon />
            </Button>
            <Button onClick={() => handleDelete(drawerOpen?.url)}   >
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