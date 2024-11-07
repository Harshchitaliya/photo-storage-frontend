import React from "react";
import { Button, Toast, Tooltip } from "flowbite-react";
import { DownloadIcon, ShareIcon, DeleteIcon, CancelIcon, RecycleIcon } from "../Icon";

const Selectaction = (props) => {
  const {
    selectedItems,
    handleDelete,
    handleShare,
    handleDownload,
    handleRecycle,
    handleCancel,
  } = props;
  const actionList = 
    [
      {
        handler: handleDownload,
        key: "Download",
        onClick: () => handleDownload(selectedItems),
        icon: <DownloadIcon />,
    
      },
      {
        handler: handleShare,
        key: "Share",
        onClick: () => handleShare(selectedItems),
        icon: <ShareIcon />,
      },
      {
        handler: handleDelete,
        key: "Delete",
        onClick: () => handleDelete(selectedItems),
        icon: <DeleteIcon />,
        color: "failure",
      },
     
      {
        handler: handleRecycle,
        key: "Recycle",
        onClick: () => handleRecycle(selectedItems),
        icon: <RecycleIcon />,
      },
      {
        handler: handleCancel,
        key: "Cancel",
        onClick: () => handleCancel(),
        icon: <CancelIcon />,
      },
    ,
  ].filter((item) => item.handler);
 
  
  return (
    selectedItems.length > 0 && (
      <div className="fixed bottom-4 right-4">
        <Toast>
          <div className="flex flex-wrap items-center gap-4">
            <span>{selectedItems.length} selected</span>
            <div className="flex flex-wrap items-center gap-2">      
            {actionList.map(({ onClick, icon, color, key }, index) => (
              <Tooltip content={key} arrow={false} key={index}>
                <Button 
                  size="sm" 
                  color={color} 
                  onClick={onClick}
                >
                  {icon}
                </Button>
              </Tooltip>
            ))}
            </div>
          </div>
        </Toast>
      </div>
    )
  );
};

export default Selectaction;
