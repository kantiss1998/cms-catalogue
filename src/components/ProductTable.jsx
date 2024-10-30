import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaPlus, FaTimes, FaUpload } from "react-icons/fa";
import { toast } from "react-hot-toast";
import API from "../utils/api";
import Modal from "./re-usable-components/Modal";
import { Link, useLocation } from "react-router-dom";

const ProductTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    subName: "",
    categoryId: 0,
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  let dataFilter = {};
  if (location.state !== null) {
    dataFilter = { categoryId: location.state };
  }

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const data = await API.fetchProducts(dataFilter);
      setProducts(data);
      setFilteredProducts(data);
      const data2 = await API.fetchCategory();
      setCategories(data2);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 4) {
    toast.error("Maximum 4 files allowed");
    e.target.value = null; // Reset input
    return;
  }
  const files = Array.from(e.target.files);
  setSelectedFiles(files);
  };

  const uploadImage = (item) => {
    setSelectedProduct(item);
    setIsUploadModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    
    if (selectedFiles.length === 0) {
      toast.error("Please select files to upload");
      return;
    }

    if (selectedFiles.length > 4) {
      toast.error("Maximum 4 files allowed");
      return;
    }

    try {
      setUploadLoading(true);
      
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append('photos', file);
      });

      await API.updateProductImages(selectedProduct.id, selectedFiles);
      
      setIsUploadModalOpen(false);
      setSelectedFiles([]);
      toast.success("Images uploaded successfully");
      await fetchProducts(dataFilter);
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error(error.response?.data?.message || "Failed to upload images");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = products.filter(
      (item) =>
        item.name.toLowerCase().includes(term) ||
        item.subName.toLowerCase().includes(term)
    );
    setFilteredProducts(filtered);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await API.createProduct(formData);
      await fetchProducts(dataFilter);
      setIsAddModalOpen(false);
      setFormData({
        name: "",
        subName: "",
        categoryId: 0,
        description: "",
      });
      toast.success("Product added successfully");
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await API.updateProduct(selectedProduct.categoryId, formData);
      await fetchProducts(dataFilter);
      setIsEditModalOpen(false);
      setFormData({
        name: "",
        subName: "",
        categoryId: 0,
        description: "",
      });
      toast.success("Product updated successfully");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await API.deleteProduct(selectedProduct.id);
      await fetchProducts(dataFilter);
      setIsDeleteModalOpen(false);
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    } finally {
      setIsLoading(false);
    }
  };

  const openEditModal = (item) => {
    setSelectedProduct(item);
    setFormData(item);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (item) => {
    setSelectedProduct(item);
    setIsDeleteModalOpen(true);
  };

  useEffect(() => {
    fetchProducts(dataFilter);
  }, []);

  return (
    <>
      <motion.div
        className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-100">Products</h2>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              disabled={isLoading}
            >
              <FaPlus size={14} />
              Add Product
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={handleSearch}
            />
            <FaSearch
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="text-center py-4 text-gray-400">Loading...</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Id
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    SubName
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Colors
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-700">
                {filteredProducts &&
                  filteredProducts.map((item) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                        <td className="px-6 py-4 whitespace-nowrap text-gray-100">
                      <Link to="/colors" state={item.id}>
                          {item.id}
                      </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      <Link to="/colors" state={item.id}>
                          {item.Category.name}
                      </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      <Link to="/colors" state={item.id}>
                          {item.name}
                      </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      <Link to="/colors" state={item.id}>
                          {item.subName}
                      </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      <Link to="/colors" state={item.id}>
                          {item.Colors.length}
                      </Link>
                        </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <button
                          onClick={() => openEditModal(item)}
                          className="text-indigo-400 hover:text-indigo-300 mr-4"
                          disabled={isLoading}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => uploadImage(item)}
                          className="text-orange-600 mr-4 hover:text-orange-500"
                        >
                          Upload
                        </button>
                        <button
                          onClick={() => openDeleteModal(item)}
                          className="text-red-400 hover:text-red-300"
                          disabled={isLoading}
                        >
                          Delete
                        </button>
                      </td>
                    </motion.tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>

      {/* Add Product Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Product"
      >
        <form onSubmit={handleAdd}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Product Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2"
              required
              disabled={isLoading}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">SubName</label>
            <input
              type="text"
              value={formData.subName}
              onChange={(e) =>
                setFormData({ ...formData, subName: e.target.value })
              }
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2"
              disabled={isLoading}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2"
              disabled={isLoading}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Select Category</label>
            <select
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2"
              disabled={isLoading}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-gray-400 hover:text-gray-200 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Product"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Upload Product Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          setSelectedFiles([]);
        }}
        title="Upload Product Images"
      >
        <form onSubmit={handleImageUpload}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">
              Select Images (up to 4 files)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2"
              disabled={uploadLoading}
              max="4"
            />
            <p className="text-sm text-gray-400 mt-2">
              Selected files: {selectedFiles.length}
            </p>
          </div>

          {selectedFiles.length > 0 && (
            <div className="mb-4">
              <p className="text-gray-300 mb-2">Selected Files:</p>
              <div className="grid grid-cols-2 gap-2">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="bg-gray-700 p-2 rounded-lg text-gray-300 text-sm truncate"
                  >
                    {file.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => {
                setIsUploadModalOpen(false);
                setSelectedFiles([]);
              }}
              className="px-4 py-2 text-gray-400 hover:text-gray-200 transition-colors"
              disabled={uploadLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              disabled={uploadLoading || selectedFiles.length === 0}
            >
              {uploadLoading ? (
                <>
                  <FaUpload size={14} className="animate-bounce" />
                  Uploading...
                </>
              ) : (
                <>
                  <FaUpload size={14} />
                  Upload Images
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Product"
      >
        <form onSubmit={handleEdit}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Product Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2"
              required
              disabled={isLoading}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">SubName</label>
            <input
              type="text"
              value={formData.subName}
              onChange={(e) =>
                setFormData({ ...formData, subName: e.target.value })
              }
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2"
              disabled={isLoading}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2"
              disabled={isLoading}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Select Category</label>
            <select
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2"
              disabled={isLoading}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 text-gray-400 hover:text-gray-200 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Product Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Product"
      >
        <div className="mb-4">
          <p className="text-gray-300">
            Are you sure you want to delete product "{selectedProduct?.name}"?
          </p>
        </div>
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="px-4 py-2 text-gray-400 hover:text-gray-200 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default ProductTable;
