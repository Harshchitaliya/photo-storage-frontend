import { useState, useEffect } from 'react';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { useAuth } from "../../context/auth/AuthContext";
import { FaFolder, FaFolderOpen, FaArrowLeft } from 'react-icons/fa';
import { storage, firestore } from "../../context/auth/connection/connection";

function Catalog() {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [photos, setPhotos] = useState([]);
  const { currentUseruid } = useAuth();

  // Step 1: Load all batches
  useEffect(() => {
    const loadBatches = async () => {
      try {
        const batchesRef = ref(storage, `users/${currentUseruid}/batches`);
        const result = await listAll(batchesRef);
        setBatches(result.prefixes.map(prefix => prefix.name));
      } catch (error) {
        console.error("Error loading batches:", error);
      }
    };
    
    if (currentUseruid) {
      loadBatches();
    }
  }, [currentUseruid, storage]);

  // Step 2: Load folders when a batch is selected
  const handleBatchClick = async (batchName) => {
    setSelectedBatch(batchName);
    try {
      const foldersRef = ref(storage, `users/${currentUseruid}/batches/${batchName}`);
      const result = await listAll(foldersRef);
      setFolders(result.prefixes.map(prefix => prefix.name));
      setSelectedFolder(null); // Reset selected folder
      setPhotos([]); // Reset photos
    } catch (error) {
      console.error("Error loading folders:", error);
    }
  };

  // Step 3: Load photos when a folder is selected
  const handleFolderClick = async (folderName) => {
    setSelectedFolder(folderName);
    try {
      const photosRef = ref(storage, `users/${currentUseruid}/batches/${selectedBatch}/${folderName}`);
      const result = await listAll(photosRef);
      const urls = await Promise.all(
        result.items.map(async (item) => {
          const url = await getDownloadURL(item);
          return { name: item.name, url };
        })
      );
      setPhotos(urls);
    } catch (error) {
      console.error("Error loading photos:", error);
    }
  };

  // Add function to handle going back
  const handleBack = () => {
    if (selectedFolder) {
      setSelectedFolder(null);
      setPhotos([]);
    } else if (selectedBatch) {
      setSelectedBatch(null);
      setFolders([]);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-80 bg-white dark:bg-gray-800 p-4 shadow-lg overflow-y-auto">
        {/* Back Button and Title */}
        <div className="flex items-center gap-4 mb-6">
          {(selectedBatch || selectedFolder) && (
            <button
              onClick={handleBack}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
              aria-label="Go back"
            >
              <FaArrowLeft className="text-xl" />
            </button>
          )}
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {selectedFolder 
              ? selectedFolder
              : selectedBatch 
                ? selectedBatch 
                : 'Batches'}
          </h2>
        </div>

        {/* Navigation Breadcrumbs */}
        <div className="flex items-center gap-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
          <span 
            className={`hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer ${
              !selectedBatch && 'text-blue-600 dark:text-blue-400'
            }`}
            onClick={() => handleBack()}
          >
            Batches
          </span>
          {selectedBatch && (
            <>
              <span>/</span>
              <span 
                className={`hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer ${
                  !selectedFolder && 'text-blue-600 dark:text-blue-400'
                }`}
                onClick={() => setSelectedFolder(null)}
              >
                {selectedBatch}
              </span>
            </>
          )}
          {selectedFolder && (
            <>
              <span>/</span>
              <span className="text-blue-600 dark:text-blue-400">
                {selectedFolder}
              </span>
            </>
          )}
        </div>

        {/* Rest of the sidebar content */}
        {!selectedFolder && !selectedBatch && (
          <div className="space-y-2">
            {batches.map((batch) => (
              <div
                key={batch}
                onClick={() => handleBatchClick(batch)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors
                  ${selectedBatch === batch 
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              >
                {selectedBatch === batch ? (
                  <FaFolderOpen className="text-blue-600 dark:text-blue-400 text-xl" />
                ) : (
                  <FaFolder className="text-blue-600 dark:text-blue-400 text-xl" />
                )}
                <span className="truncate dark:text-gray-200">{batch}</span>
              </div>
            ))}
          </div>
        )}

        {selectedBatch && !selectedFolder && (
          <div className="space-y-2">
            {folders.map((folder) => (
              <div
                key={folder}
                onClick={() => handleFolderClick(folder)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors
                  ${selectedFolder === folder 
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              >
                {selectedFolder === folder ? (
                  <FaFolderOpen className="text-blue-600 dark:text-blue-400 text-xl" />
                ) : (
                  <FaFolder className="text-blue-600 dark:text-blue-400 text-xl" />
                )}
                <span className="truncate dark:text-gray-200">{folder}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {selectedFolder ? (
          <div>
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={handleBack}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 lg:hidden"
                aria-label="Go back"
              >
                <FaArrowLeft className="text-xl" />
              </button>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                Photos in {selectedFolder}
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {photos.map((photo) => (
                <div
                  key={photo.name}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="aspect-square relative">
                    <img
                      src={photo.url}
                      alt={photo.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate text-center">
                      {photo.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <FaFolder className="text-6xl mb-4" />
            <p className="text-xl">
              {selectedBatch 
                ? "Select a folder to view photos"
                : "Select a batch to view folders"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Catalog;
