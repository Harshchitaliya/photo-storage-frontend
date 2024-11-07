import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth/AuthContext";
import { showsku } from "../../server/photo";
import ProductCard from "../../components/ProductCard";
import { Button } from "flowbite-react";
import { storage, firestore } from "../../context/auth/connection/connection";
import { createNewCatalog } from "../../server";

const EditCatalog = () => {
  const [filteredPhoto, setFilteredPhoto] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const { currentUseruid } = useAuth();
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const getSku = async () => {
    const allphotos = await showsku({
      currentUseruid,
      firestore,
      storage,
    });

    setFilteredPhoto(allphotos);
  };
const handleSave=async()=>{
    try{
        await createNewCatalog({currentUseruid,firestore,storage,catalog:{...formData,skus:selectedItems}});
        window.history.back();
    }catch(error){
        console.log(error);
    }
}
  useEffect(() => {
    getSku();
  }, [filteredPhoto]);
  return (
    <div>
      <div className="flex justify-end gap-4">
        <Button onClick={() => window.history.back()}>Back</Button>
        <Button disabled={selectedItems.length === 0} onClick={handleSave}>Save</Button>
      </div>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <div className="w-full sm:w-1/3">
          <div className="mb-6">
            <label className="block text-gray-700 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg bg-gray-700"
              placeholder="A captivating title attracts attention!"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg bg-gray-700 min-h-[150px]"
              placeholder="Enter Catalog Description"
            />
          </div>
        </div>
        <div
          className="w-full sm:w-2/3 "
          style={{ maxHeight: "90vh", overflowY: "auto" }}
        >
          <span className="text-white">Select Sku</span>
          <div className="flex flex-wrap gap-4 justify-center">
            {filteredPhoto.map((photoUrl, index) => (
              <ProductCard
                photoUrl={photoUrl}
                key={index}
                checkboxClick={setSelectedItems}
                checked={selectedItems}
                type={"product"}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCatalog;
