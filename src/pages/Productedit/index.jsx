import React from 'react';
import { Button, Input, Select, Textarea } from 'flowbite-react';

function EditProductForm() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="container mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Edit Product</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Side: Image Preview */}
          <div className="flex justify-center items-center border rounded-md bg-white p-4">
            <img
              src="your-image-url.jpg" // Replace with your image URL
              alt="Product"
              className="max-h-96 object-contain"
            />
          </div>

          {/* Right Side: Form */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <form className="space-y-4">
              {/* SKU Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  SKU*
                </label>
                <Input type="text" placeholder="Enter SKU" />
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <Input type="text" placeholder="Enter Title" />
              </div>

              {/* Price Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <Input type="number" placeholder="Enter Price" />
              </div>

              {/* Product Type Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Product Type
                </label>
                <Select>
                  <option>Select Product Type</option>
                  {/* Add more options as needed */}
                </Select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <Textarea rows="3" placeholder="Enter Description" />
                <div className="mt-2 flex items-center space-x-2">
                  <Button size="xs" color="success">
                    Create Description using AI
                  </Button>
                  <Button size="xs" color="gray">
                    Enter Manually
                  </Button>
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <Input type="number" placeholder="Enter Quantity" />
              </div>

              {/* Save and Cancel Buttons */}
              <div className="flex justify-end space-x-2">
                <Button color="gray">Cancel</Button>
                <Button color="primary">Save</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProductForm;
