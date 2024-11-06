import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/auth/AuthContext";
import { getImageData } from "../../server";
import { firestore } from "../../context/auth/connection/connection";

const EditImg = () => {
  const { id, imgId } = useParams();
  const [imageData, setImageData] = useState(null);
  const { currentUseruid } = useAuth();
  const getImage = async () => {
    try {
      const data = await getImageData({currentUseruid, firestore, productId: id, imageIndex: imgId});
      setImageData(data);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(imageData);
  useEffect(() => {
    getImage();
  }, []);
  return (
    <>
      <h1>EditImg</h1>
    </>
  );
};

export default EditImg;
