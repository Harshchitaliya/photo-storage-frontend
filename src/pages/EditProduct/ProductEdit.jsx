import { TextInput, Label } from "flowbite-react";

const ProductEdit = ({setFormData, formData}) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      };
  return  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 w-full">
  <form className="space-y-6">
    <div>
      <div className="mb-2 flex justify-between items-center">
        <div>
          <Label htmlFor="sku" value="SKU*" />
          <span className="text-sm text-gray-500 ml-2">
            SKU is your jewelry's ID!
          </span>
        </div>
        <span className="text-purple-600">*required fields</span>
      </div>
      <TextInput
        id="sku"
        name="sku"
        value={formData.sku}
        onChange={handleChange}
        required
        className="relative"
      />
      <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
        <svg className="w-5 h-5 text-green-500" />
      </div>
    </div>

    <div>
      <div className="mb-2 block">
        <Label htmlFor="title" value="Title" />
        <span className="text-sm text-gray-500 ml-2">
          A captivating title attracts attention!
        </span>
      </div>
      <TextInput
        id="title"
        name="title"
        value={formData.title}
        onChange={handleChange}
      />
    </div>

    <div>
      <div className="mb-2 block">
        <Label htmlFor="price" value="Price" />
        <span className="text-sm text-gray-500 ml-2">
          How much does this jewelry item cost?
        </span>
      </div>
      <TextInput
        id="price"
        name="price"
        type="number"
        value={formData.price}
        onChange={handleChange}
      />
    </div>

    <div>
      <div className="mb-2 block">
        <Label htmlFor="type" value="Type" />
        <span className="text-sm text-gray-500 ml-2">
          Assign the jewelry item a category for easier filtration
        </span>
      </div>
      <TextInput
        id="type"
        name="type"
        value={formData.typesdhfjvdhsjfhj}
        onChange={handleChange}
      />
    </div>

    <div>
      <div className="mb-2 block">
        <Label htmlFor="description" value="Description" />
      </div>
      <textarea
        id="description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        rows={4}
      />
    </div>
  </form>
</div>
};

export default ProductEdit;
