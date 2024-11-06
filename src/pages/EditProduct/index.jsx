import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ImageGallery from "./ImageGallery";
import { productData, updateProductData } from "../../server";
import { useAuth } from "../../context/auth/AuthContext";
import { firestore, storage } from "../../context/auth/connection/connection";
import ProductEdit from "./ProductEdit";
import Loader from "../../components/Loader";

const EditProduct = () => {
  const [formData, setFormData] = useState({});
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { currentUseruid } = useAuth();
  const getproductData = async () => {
    try {
      setIsLoading(true);
      const product = await productData({
        currentUseruid,
        storage,
        firestore,
        productId: id,
      });
      setFormData(product);
    } catch (error) {
      window.history.back();
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getproductData();
  }, []);

  const handleSubmit = async (e) => {
    if (!formData.sku) {
      return;
    }
    e.preventDefault();
    try {
      await updateProductData({
        currentUseruid,
        firestore,
        storage,
        productId: id,
        productData: formData,
      });
      window.history.back();
    } catch (error) {
      console.log(error);
    }
  };
  return isLoading ? (
    <div className="flex justify-center items-center h-screen">
      <Loader size="xl" />
    </div>
  ) : (
    <div className="flex justify-center gap-3 mt-3 ">
      <ImageGallery
        allPhotos={formData?.photos || []}
        setFormData={setFormData}
        selectedImageIndex={selectedImageIndex}
        setSelectedImageIndex={setSelectedImageIndex}
      />
      <ProductEdit
        setFormData={setFormData}
        formData={formData}
        selectedImageIndex={selectedImageIndex}
        handleSubmit={handleSubmit}
        photos={formData?.photos || []}
        id={id}
      />
    </div>
  );
};

export default EditProduct;
