import React, { useState } from "react";
import moment from "moment";
import {
  VideoIcon,
  ImageIcon,
  MoreoptionsIcon,
  DeleteIcon,
  ShareIcon,
  DownloadIcon,
  FavoriteIcon,
  RecycleIcon,
} from "../Icons";
import { Card, Checkbox, Dropdown } from "flowbite-react";

const ProductCard = (pages) => {
  const {
    photoUrl,
    checkboxClick,
    checked,
    handleDownload,
    handleDelete,
    handleShare,
    handleFavorite,
    setDrawerOpen,
    handleRecycle,
  } = pages;

  const buttonList = [
    {
      handler: handleDownload,
      icon: <DownloadIcon />,
      text: "Download",
      onClick: () => handleDownload(photoUrl.downloadUrl),
    },
    {
      handler: handleDelete,
      icon: <DeleteIcon />,
      text: "Delete",
      onClick: () => handleDelete(photoUrl.url),
    },
    {
      handler: handleShare,
      icon: <ShareIcon />,
      text: "Share",
      onClick: () => handleShare(photoUrl.url),
    },
    {
      handler: handleFavorite,
      icon: <FavoriteIcon />,
      text: "Favorite",
      onClick: () => handleFavorite(photoUrl.url),
    },
    {
      handler: handleRecycle,
      icon: <RecycleIcon />,
      text: "Recycle",
      onClick: () => handleRecycle(photoUrl.url),
    },
  ];
  
  const handleCheckboxClick = (url) => {
    if (checked.includes(url)) {
      checkboxClick((prev) => prev.filter((item) => item !== url));
    } else {
      checkboxClick((prev) => [...prev, url]);
    }
  };

  return (
    <Card className="max-w-sm dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Checkbox
            className="cursor-pointer"
            checked={checked.includes(photoUrl.url)}
            onChange={() => handleCheckboxClick(photoUrl.url)}
          />
          <span className="text-white">{photoUrl.sku}</span>
        </div>
        {(handleDownload ||
          handleDelete ||
          handleShare ||
          handleFavorite ||
          handleRecycle) && (
          <Dropdown
            label=""
            inline
            className="border-0 cursor-pointer"
            renderTrigger={() => (
              <span className="cursor-pointer">
                <MoreoptionsIcon />
              </span>
            )}
          >
            {buttonList.map(
              ({ handler, icon, text, onClick }) =>
                handler && (
                  <Dropdown.Item
                    key={text}
                    className="w-40 gap-2 text-white"
                    onClick={onClick}
                  >
                    {icon} {text}
                  </Dropdown.Item>
                )
            )}
          </Dropdown>
        )}
      </div>
      <div
        className="bg-bg rounded-lg w-52 h-48 flex justify-center items-center relative cursor-pointer transition-transform duration-300 hover:scale-100 hover:shadow-lg"
        onClick={() => setDrawerOpen?.(photoUrl)}
      >
        {photoUrl.isVideo ? (
          <div className="relative w-full h-full">
            <video
              src={photoUrl.photos?.[0]?.downloadUrl || photoUrl.downloadUrl}
              className="w-full h-full object-cover rounded-lg transition-opacity duration-300 hover:opacity-80"
              controls={false}
              preload="metadata"
              playsInline
            >
              Your browser does not support the video tag.
            </video>
          </div>
        ) : (
          <img
            src={photoUrl.photos?.[0]?.downloadUrl ||photoUrl.downloadUrl}
            alt="Preview"
            className="w-full h-full object-cover rounded-lg transition-opacity duration-300 hover:opacity-80"
          />
        )}
      </div>
      <div className="text-gray-400 text-sm flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {photoUrl.isVideo ? <VideoIcon /> : <ImageIcon />}•{" "}
          {moment(photoUrl.date).format("MMM DD, YYYY")}
          <span className="text-white">{photoUrl.type}</span>
        </div>
        {photoUrl.isFavorite && <FavoriteIcon />}
      </div>
    </Card>
  );
};

export default ProductCard;
