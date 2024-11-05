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
            checked={checked.includes(photoUrl.url)}
            onChange={() => handleCheckboxClick(photoUrl.url)}
          />
          <span className="text-white">{photoUrl.sku}</span>
        </div>
        {(handleDownload || handleDelete || handleShare || handleFavorite || handleRecycle) && (
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
            {handleDownload && (
              <Dropdown.Item
                className="w-40 gap-2 text-white"
                onClick={() => handleDownload(photoUrl.downloadUrl)}
              >
                <DownloadIcon /> Download
              </Dropdown.Item>
            )}
            {handleDelete && (
              <Dropdown.Item
                className="w-40 gap-2 text-white"
                onClick={() => handleDelete(photoUrl.url)}
              >
                <DeleteIcon /> Delete
              </Dropdown.Item>
            )}
            {handleShare && (
              <Dropdown.Item
                className="w-40 gap-2 text-white "
                onClick={() => handleShare(photoUrl.url)}
              >
                <ShareIcon /> Share
              </Dropdown.Item>
            )}
            {handleFavorite && (
              <Dropdown.Item
                className="w-40 gap-2 text-white "
                onClick={() => handleFavorite(photoUrl.url)}
              >
                <FavoriteIcon /> Favorite
              </Dropdown.Item>
            )}
            {handleRecycle && (
              <Dropdown.Item
                className="w-40 gap-2 text-white "
                onClick={() => handleRecycle(photoUrl.url)}
              >
                <RecycleIcon /> Recycle
              </Dropdown.Item>
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
              src={photoUrl.downloadUrl}
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
            src={photoUrl.downloadUrl}
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
