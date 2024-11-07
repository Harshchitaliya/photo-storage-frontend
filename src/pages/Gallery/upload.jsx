import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { storage, firestore } from '../../context/auth/connection/connection';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../../context/auth/AuthContext';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const Gallery = () => {
    const [files, setFiles] = useState([]);
    const [metadata, setMetadata] = useState({
        sku: '',
        title: '',
        description: '',
        quantity: '',
        price: ''
    });
    const [photo, setPhoto] = useState([]);
    const [isDragging, setIsDragging] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const { currentUseruid } = useAuth();

    const handleMetadataChange = (field) => (e) => {
        setMetadata(prev => ({
            ...prev,
            [field]: e.target.value
        }))
    }


    useEffect(() => {
        if (currentUseruid) {
            handleShowPhoto();
        }
    }, [currentUseruid,photo]);

    const handleFileChange = useCallback((e) => {
        const selectedFiles = e.type === "drop" ? Array.from(e.dataTransfer.files) : Array.from(e.target.files);
        const allowedFiles = selectedFiles.filter(file => {
            const fileType = file.type.toLowerCase();
            return fileType.startsWith('image/') || 
                   fileType.startsWith('video/mp4') ||
                   fileType.startsWith('video/quicktime') || // For .mov files
                   fileType.startsWith('video/x-msvideo') || // For .avi files
                   fileType.startsWith('video/webm') || 
                   fileType.startsWith('video/MOV');

        });
        
        if (allowedFiles.length > 0) {
            setFiles(prevFiles => [...prevFiles, ...allowedFiles]);
        }
    }, []);


    const handleDrag = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragging(true)
        } else if (e.type === "dragleave") {
            setIsDragging(false)
        }
    }, [])


    const uploadPhoto = useCallback((files, metadata, currentUseruid) => {
        const photopath = `users/${currentUseruid}/${metadata.sku}/${files[0].name}`;
        const storageRef = ref(storage, photopath);

        uploadBytesResumable(storageRef, files[0]).then(() => {
            console.log("Successfully uploaded");
        });

        return photopath;
    }, []);

    const saveProductMetadata = useCallback(async (metadata, photoURL, currentUseruid) => {
        const userDocRef = doc(firestore, 'Users', currentUseruid);
        const date = new Date().toISOString();

        const photoData = {
            url: photoURL,
            date,
            isDeleted: false,
            isFavorite: false
        };

        try {
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                const existingSkus = userData.skus || [];
                const existingSkuIndex = existingSkus.findIndex(item => item.sku === metadata.sku);

                if (existingSkuIndex !== -1) {
                    // SKU exists, add new photo to the existing SKU
                    const updatedSkus = JSON.parse(JSON.stringify(existingSkus));
                    if (!updatedSkus[existingSkuIndex].photos) {
                        updatedSkus[existingSkuIndex].photos = [];
                    }
                    updatedSkus[existingSkuIndex].photos.push(photoData);

                    await updateDoc(userDocRef, { skus: updatedSkus });
                    console.log("Added new photo to existing SKU");
                } else {
                    // SKU doesn't exist, add a new SKU object
                    const newSkuData = {
                        ...metadata,
                        photos: [photoData]
                    };

                    existingSkus.push(newSkuData);
                    await updateDoc(userDocRef, { skus: existingSkus });
                    console.log("Added new SKU with photo");
                }
            } else {
                // User document doesn't exist, create it with the first SKU
                await setDoc(userDocRef, {
                    skus: [{
                        ...metadata,
                        photos: [photoData]
                    }]
                });
                console.log("Created new user document with first SKU");
            }
        } catch (error) {
            console.error("Error saving data:", error);
            throw error;
        }
    }, []);

    const handleShowPhoto = useCallback(async () => {
        if (!currentUseruid) {
            console.log("No user ID found");
            return;
        }

        const userDocRef = doc(firestore, 'Users', currentUseruid);
        try {
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const photoPaths = userData.skus.flatMap(sku => sku.photos.map(photo => photo.url));

                const photoUrls = await Promise.all(
                    photoPaths.map(async (path) => {
                        const storageRef = ref(storage, path);
                        return await getDownloadURL(storageRef);
                    })
                );

                setPhoto(photoUrls);
            } else {
                console.log('No photos found');
            }
        } catch (error) {
            console.error("Error fetching photo:", error);
        }
    }, [currentUseruid]);

    const handleUpload = async (files, metadata, currentUseruid) => {
        // Call MPN 10 times
        for (let i = 0; i < 10; i++) {
            const mpn = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
            console.log(`Generated MPN ${i + 1}: ${mpn}`);
            try {
                // Upload each file with the same MPN
                for (const file of files) {
                    console.log(file);
                    // Update file metadata
                    const updatedFile = new File([file], file.name, {
                        type: file.type,
                        lastModified: Date.now()
                    });
                    console.log("Updated file metadata:", {
                        name: updatedFile.name,
                        lastModified: updatedFile.lastModified,
                        lastModifiedDate: new Date(updatedFile.lastModified),
                        size: updatedFile.size,
                        type: updatedFile.type
                    });
                    const photoPath = await uploadPhoto([ {
                        name: (mpn+updatedFile.name),
                        lastModified: updatedFile.lastModified,
                        lastModifiedDate: new Date(updatedFile.lastModified),
                        size: updatedFile.size,
                        type: updatedFile.type
                    }], metadata, currentUseruid);
                    await saveProductMetadata({...metadata, sku: mpn}, photoPath, currentUseruid);
                }
                console.log("Photos and metadata saved successfully!");
                
                // Fetch updated photos after each batch upload
                await handleShowPhoto();
            } catch (error) {
                console.error("Error handling upload:", error);
            }
        }
        
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleUpload(files, metadata, currentUseruid);
    };

  

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Product Gallery</h1>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl shadow-lg p-6">
                {/* File Upload Section */}
                <div 
                    className={`relative border-2 border-dashed rounded-lg p-8 text-center
                        ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
                        hover:border-blue-500 transition-colors duration-200`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={(e) => {
                        handleDrag(e)
                        handleFileChange(e)
                    }}
                >
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept="*/*"
                    />
                    <div className="space-y-2">
                        <svg 
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor" 
                            fill="none" 
                            viewBox="0 0 48 48"
                        >
                            <path 
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <div className="text-gray-600">
                            <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                </div>

                {/* Progress Bar - Show when uploading */}
                {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                        ></div>
                    </div>
                )}

                {/* Add this new section after the file upload area */}
                {files.length > 0 && (
                    <div className="mt-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Files:</h3>
                        <div className="grid grid-cols-4 gap-4">
                            {files.map((file, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={`Preview ${index}`}
                                        className="w-full h-24 object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setFiles(files.filter((_, i) => i !== index))}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 
                                                 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Form Fields */}
                <div className="grid grid-cols-2 gap-6">
                    {[
                        { name: 'sku', type: 'text', label: 'SKU', placeholder: 'Enter product SKU' },
                        { name: 'title', type: 'text', label: 'Title', placeholder: 'Enter product title' },
                        { name: 'price', type: 'number', label: 'Price', placeholder: 'Enter price' },
                        { name: 'quantity', type: 'number', label: 'Quantity', placeholder: 'Enter quantity' }
                    ].map(field => (
                        <div key={field.name} className="space-y-1">
                            <label 
                                htmlFor={field.name}
                                className="block text-sm font-medium text-gray-700"
                            >
                                {field.label}
                            </label>
                            <input
                                type={field.type}
                                id={field.name}
                                name={field.name}
                                placeholder={field.placeholder}
                                onChange={handleMetadataChange(field.name)}
                                className="block w-full px-4 py-2 mt-1 text-gray-900 border border-gray-300 
                                         rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    ))}
                </div>

                {/* Description Field - Full Width */}
                <div className="space-y-1">
                    <label 
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        rows="3"
                        placeholder="Enter product description"
                        onChange={handleMetadataChange('description')}
                        className="block w-full px-4 py-2 mt-1 text-gray-900 border border-gray-300 
                                 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 
                             rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 
                             focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                
                >
                    Upload Product
                </button>
            </form>

            {/* Gallery Grid */}
            <div className="grid grid-cols-3 gap-4 mt-8">
                {photo.map((photoUrl, index) => (
                    <div 
                        key={index} 
                        className="aspect-square group relative overflow-hidden rounded-lg shadow-md"
                    >
                        <img 
                            src={photoUrl} 
                            alt={`Photo ${index}`}
                            className="w-full h-full object-cover transition-transform duration-200 
                                     group-hover:scale-110"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 
                                      transition-opacity duration-200" />
                    </div>
                ))}
            </div>

        </div>
    )
};

export default Gallery;
