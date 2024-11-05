import React, { useState } from "react";
import moment from "moment";
import { VideoIcon, ImageIcon, MoreoptionsIcon } from "../../components/icons";
import { Card as FlowbiteCard, Checkbox } from 'flowbite-react';

const Card = ({ photoUrl, checkboxClick, checked }) => {
  
  const handleCheckboxClick = (url) => {
    if (checked.includes(url)) {
      checkboxClick((prev) => prev.filter((item) => item !== url));
    } else {
      checkboxClick((prev) => [...prev, url]);
    }

  };

  return (
    <FlowbiteCard className="max-w-sm bg-gray-800">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={checked.includes(photoUrl.downloadUrl)}
            onChange={() => handleCheckboxClick(photoUrl.downloadUrl)}
          />
          <span className="text-white">{photoUrl.sku}</span>
        </div>
        <button
          id="dropdownMenuIconButton"
          data-dropdown-toggle="dropdownDots"
          type="button"
          className="text-gray-400 hover:text-white"
        >
          <MoreoptionsIcon />
        </button>
      </div>
      <div className="bg-bg rounded-lg mb-4 w-52 h-48 flex justify-center items-center relative">
        {photoUrl.isVideo ? (
          <div className="relative w-full h-full">
            <video
              src={photoUrl.downloadUrl}
              className="w-full h-full object-cover rounded-lg"
              controls={false}
              preload="metadata"
              playsInline
            >
              Your browser does not support the video tag.
            </video>
            
            {/* {!isPlaying && (
              <div 
                className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black bg-opacity-30"
                // onClick={handleVideoClick}
              >
                <div className="w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            )} */}
          </div>
        ) : (
          <img
            src={photoUrl.downloadUrl}
            alt="Preview"
            className="w-full h-full object-cover rounded-lg"
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
