import React from 'react'
import moment from 'moment';
import { VideoIcon, ImageIcon, MoreoptionsIcon } from '../../components/icons';

const Card = ({ photoUrl }) => {
  return (
    <div className="max-w-sm bg-gray-800 rounded-lg p-4 text-white">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <input id="inline-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"></input>
          <span className="text-white">{photoUrl.sku}</span>
        </div>
        <button id="dropdownMenuIconButton" data-dropdown-toggle="dropdownDots" type="button" className="text-gray-400 hover:text-white">
          <MoreoptionsIcon />
        </button>
      </div>
      <div className="bg-bg rounded-lg mb-4 w-52 h-48  flex justify-center items-center">
        <img
          src={photoUrl.downloadUrl}
          alt="Preview"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      <div className="text-gray-400 text-sm flex items-center gap-2">
        {photoUrl.isVideo ? <VideoIcon /> : <ImageIcon />}
        • {moment(photoUrl.date).format("MMM DD, YYYY")}
        <span className="text-white">{photoUrl.type}</span>
      </div>
    </div>
  )
}

export default Card;
