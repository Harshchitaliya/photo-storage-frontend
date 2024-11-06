import React, { useState } from "react";
import { Button, TextInput, Label } from "flowbite-react";
import ImageGallery from "./ImageGallery";
import { productData, updateProductData } from "../../server";
import { useAuth } from "../../context/auth/AuthContext";
import { BackIcon } from "../../components/Icons";
import { firestore, storage } from "../../context/auth/connection/connection";
import ProductEdit from "./ProductEdit";

const EditProduct = () => {
  const [formData, setFormData] = useState({});
  const { id } = useParams();
  const { currentUseruid } = useAuth();
  const getproductData = async () => {
    try {
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
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="text-gray-600 hover:text-gray-800 dark:text-white"
          >
            <BackIcon />
          </button>
          <h1 className="text-2xl font-semibold dark:text-white">
            Edit Product
          </h1>
        </div>
        <div className="flex gap-3">
          <Button color="light" onClick={() => window.history.back()}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!formData.sku}>
            Save
          </Button>
        </div>
      </div>
      <div >
        <div
          className="flex  justify-center items-center gap-3 mt-3 overflow-auto"
          style={{ height: "calc(100vh - 120px)" }}
        >
          <ImageGallery
            allPhotos={formData?.photos || []}
            setFormData={setFormData}
            id={id}
          />
          <ProductEdit setFormData={setFormData} formData={formData} />
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
