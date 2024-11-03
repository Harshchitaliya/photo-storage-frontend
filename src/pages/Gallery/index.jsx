import React, { useState } from 'react'
import { storage, firestore } from '../../context/auth/connection/connection'
import { ref, uploadBytesResumable } from 'firebase/storage'
import { useAuth } from '../../context/auth/AuthContext'
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore'
import { getDownloadURL } from 'firebase/storage'
import { useEffect } from 'react'       
const Gallery = () => {




    const [files, setFiles] = useState([])
    const [metadata, setMetadata] = useState({
        sku: '',
        title: '',
        description: '',
        quantity: '',
        price: ''
    })
    const [photo,setPhoto] = useState([])
    const { currentUseruid } = useAuth()

    useEffect(() => {
        if (currentUseruid) {
            handleShowPhoto();
        }
    }, [currentUseruid]); 

    
    const handleFileChange = (e) => {
        const file = e.target.files[0]
        setFiles([...files, file])
    }

    const uploadPhoto = (files, metadata, currentUseruid) => {
        const photopath =  `users/${currentUseruid}/${metadata.sku}/${files[0].name}`
        const storageRef = ref(storage, `users/${currentUseruid}/${metadata.sku}/${files[0].name}`)
        uploadBytesResumable(storageRef, files[0]).then((snapshot) => {
            console.log("sucessfully uploaded")
        })

        return photopath
    }

    const saveProductMetadata = async (metadata, photoURL, currentUseruid) => {
        const userDocRef = doc(firestore, 'Users', currentUseruid);
        const date = new Date().toISOString();
    
        const photoData = {
            url: photoURL,  // Use the URL here
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
                    const updatedSkus = JSON.parse(JSON.stringify(existingSkus)); // Deep clone
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
    
                    existingSkus.push(newSkuData); // Add the new SKU to the array
    
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
    };
    
const handleShowPhoto = async () => {

    if (!currentUseruid) {
        console.log("No user ID found");
        return;
    }

    const userDocRef = doc(firestore, 'Users', currentUseruid);
    try {
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const photo = userData.skus.map(p => p.photos.map(p => p.url)).flat();
            console.log(photo)

            
            const photoUrls = await Promise.all(
                photo.map(async (path) => {
                    const storageRef =  ref(storage, path);
                    return await getDownloadURL(storageRef);
                })
            );

            setPhoto(photoUrls);

        }
        else{
            console.log('no photo')
        }
    } catch (error) {
        console.error("Error fetching photo:", error);
    }
}
    
 

    const handleUpload = async (files,metadata,currentUseruid) => {
        try {
          // Step 1: Upload photo to Firebase Storage
          const photoPath = await uploadPhoto(files, metadata,currentUseruid);
      
          // Step 2: Save metadata to Firestore
          await saveProductMetadata(metadata,photoPath,currentUseruid);
      
          console.log("Photo and metadata saved successfully!");
        } catch (error) {
          console.error("Error handling upload:", error);
        }
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        
          await handleUpload(files, metadata,currentUseruid);

      };
    

    
        return (
            <div>
                Gallery
                <label>
                    <input type="file" onChange={handleFileChange} />
                </label>

                <label name='sku' className='flex flex-col'  >sku</label>
                <input type="text" name='sku' onChange={(e) => { setMetadata({ ...metadata, sku: e.target.value }) }} />

                <label name='title' className='flex flex-col' >title</label>
                <input type="text" name='title' onChange={(e) => { setMetadata({ ...metadata, title: e.target.value }) }} />

                <label name='description' className='flex flex-col' >description</label>
                <input type="text" name='description' onChange={(e) => { setMetadata({ ...metadata, description: e.target.value }) }} />

                <label name='price' className='flex flex-col' >price</label>
                <input type="number" name='price' onChange={(e) => { setMetadata({ ...metadata, price: e.target.value }) }} />

                <label name='quantity' className='flex flex-col' >quantity</label>
                <input type="number" name='quantity' onChange={(e) => { setMetadata({ ...metadata, quantity: e.target.value }) }} />

                <button onClick={handleSubmit}>Upload</button>
              
                <div className="grid grid-cols-3 gap-4 mt-4">
            {photo.map((photoUrl, index) => (
                <div key={index} className="aspect-square">
                    <img 
                        src={photoUrl} 
                        alt={`Photo ${index}`}
                        className="w-full h-full object-cover rounded-lg"
                    />
                </div>
            ))}
        </div>
            </div>
        )
}

export default Gallery;
