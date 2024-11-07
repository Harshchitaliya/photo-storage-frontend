import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth/AuthContext";
import { showsku } from "../../server/photo";
import ProductCard from "../../components/ProductCard";
import { Button } from "flowbite-react";
import { storage, firestore } from "../../context/auth/connection/connection";
import { createNewCatalog } from "../../server";
import Loader from "../../components/Loader";

const CreateCatalog = () => {
  const [filteredPhoto, setFilteredPhoto] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const { currentUseruid } = useAuth();
  const handleInputChange = (e) => {
    setLoading(true);
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setLoading(false);
  };

  const getSku = async () => {
    setLoading(true);
    try { 
     
      const allphotos = await showsku({
        currentUseruid,
        firestore,
        storage,
    });

      setFilteredPhoto(allphotos);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await createNewCatalog({
        currentUseruid,
        firestore,
        storage,
        catalog: { ...formData, skus: selectedItems },
      });
      window.history.back();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSku();
  }, []);

  return (
    <div className="p-2 md:p-6">
      {/* Enhanced Loader with fade animation */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center 
                      animate-fadeIn">
          <Loader />
        </div>
      )}

      {/* Header Section with slide-in animation */}
      <div className="mx-auto mb-4 md:mb-8 animate-slideDown">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 md:gap-4 
                      backdrop-blur-sm p-4 rounded-lg">
          <h1 className="text-xl md:text-3xl font-bold text-white text-center sm:text-left">
            Create New Catalog
          </h1>
          <div className="flex flex-col sm:flex-row gap-2 md:gap-3 w-full sm:w-auto">
            <Button
              onClick={() => window.history.back()}
              className="w-full sm:w-32 transition-all hover:scale-105"
              color="gray"
            >
              back
            </Button>
            <Button
              disabled={selectedItems.length === 0}
              onClick={handleSave}
              className={`w-full sm:w-32 transition-all ${
                selectedItems.length > 0 ? 'hover:scale-105 hover:shadow-blue-500/50 hover:shadow-lg' : ''
              }`}
            >
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content with fade-in animation */}
      <div className="animate-fadeIn">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-8">
          {/* Form Section */}
          <div className="w-full lg:w-1/3 space-y-4 md:space-y-6">
            <div className=" backdrop-blur-sm rounded-lg p-3 md:p-6 
                          hover:shadow-lg transition-all duration-300">
              <div className="space-y-3 md:space-y-4">
                <div>
                  <label className="block text-gray-200 text-sm font-medium mb-2">
                    Catalog Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white 
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             placeholder-gray-400 transition-all duration-300
                             hover:border-blue-400"
                    placeholder="Enter a captivating title..."
                  />
                </div>
                <div>
                  <label className="block text-gray-200 text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white 
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             placeholder-gray-400 min-h-[150px] md:min-h-[200px]
                             transition-all duration-300 hover:border-blue-400"
                    placeholder="Describe your catalog..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Product Selection Section */}
          <div className="w-full lg:w-2/3">
            <div className=" backdrop-blur-sm rounded-lg p-3 md:p-6 
                          hover:shadow-lg transition-all duration-300">
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl text-white font-medium">
                  Select Products
                </h2>
                <span className="text-xs md:text-sm bg-blue-500/20 text-blue-300 px-3 py-1 
                               rounded-full animate-pulse">
                  {selectedItems.length} items selected
                </span>
              </div>
              <div 
                className="overflow-y-auto custom-scrollbar px-1 md:px-2"
                style={{ maxHeight: 'calc(100vh - 250px)' }}
              >
                <div className="flex flex-wrap gap-1 md:gap-2 justify-center">
                  {filteredPhoto.map((photoUrl, index) => (
                    <div key={index} className="animate-fadeIn" style={{
                      animationDelay: `${index * 50}ms`
                    }}>
                      <ProductCard
                        photoUrl={photoUrl}
                        checkboxClick={setSelectedItems}
                        checked={selectedItems}
                        type="product"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCatalog;
