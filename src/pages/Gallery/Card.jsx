import React, { useState } from "react";
import moment from "moment";
import {
  VideoIcon,
  ImageIcon,
  MoreoptionsIcon,
  DeleteIcon,
  ShareIcon,
  DownloadIcon,
} from "../../components/Icons";
import { Card as FlowbiteCard, Checkbox, Dropdown } from "flowbite-react";

const Card = (pages) => {
  const {
    photoUrl,
    checkboxClick,
    checked,
    handleDownload,
    handleDelete,
    handleShare,
    setDrawerOpen,
  } = pages;
  const handleCheckboxClick = (url) => {
    if (checked.includes(url)) {
      checkboxClick((prev) => prev.filter((item) => item !== url));
    } else {
      checkboxClick((prev) => [...prev, url]);
    }
  };

  return (
    <FlowbiteCard className="max-w-sm dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={checked.includes(photoUrl.downloadUrl)}
            onChange={() => handleCheckboxClick(photoUrl.downloadUrl)}
          />
          <span className="text-white">{photoUrl.sku}</span>
        </div>
        {(handleDownload || handleDelete || handleShare) && (
          <Dropdown
            label=""
            inline
            className="border-0"
            renderTrigger={() => (
              <span>
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
                onClick={() => handleShare(photoUrl.downloadUrl)}
              >
                <ShareIcon /> Share
              </Dropdown.Item>
            )}
          </Dropdown>
        )}
      </div>
      <div className="bg-bg rounded-lg w-52 h-48 flex justify-center items-center relative cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-lg" onClick={() => setDrawerOpen(photoUrl)}>
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
      <div className="text-gray-400 text-sm flex items-center gap-2">
        {photoUrl.isVideo ? <VideoIcon /> : <ImageIcon />}•{" "}
        {moment(photoUrl.date).format("MMM DD, YYYY")}
        <span className="text-white">{photoUrl.type}</span>
      </div>
    </FlowbiteCard>
  );
};

export default Card;
