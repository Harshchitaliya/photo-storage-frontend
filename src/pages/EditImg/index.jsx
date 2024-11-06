import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useAuth } from "../../context/auth/AuthContext";
import { getImageData } from "../../server";
import { firestore, storage } from "../../context/auth/connection/connection";
import ImageEditor from "./ImageEditor";
const EditImg = () => {
  const { id, imgId } = useParams();
  const [imageData, setImageData] = useState(null);
  const { currentUseruid } = useAuth();

  const getImage = async () => {
    try {
      const data = await getImageData({currentUseruid, firestore, productId: id, imageIndex: imgId ,storage});
      setImageData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getImage();
  }, []);

  const handleSave = async (editedImage) => {
    // TODO: Implement save functionality
    console.log('Saving edited image:', editedImage);
  };


  return (
    <div>
      {imageData && (
        <ImageEditor
          imageUrl={imageData.img.url}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default EditImg;
