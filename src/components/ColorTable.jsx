import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaPlus, FaTimes, FaUpload } from "react-icons/fa";
import { toast } from "react-hot-toast";
import API from "../utils/api";
import Modal from "./re-usable-components/Modal";
import { useLocation } from "react-router-dom";

const ColorTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [colors, setColors] = useState([]);
  const [filteredColors, setFilteredColors] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    hexCode: "",
    productId: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  let dataFilter = {};
  if (location.state !== null) {
    dataFilter = { productId: location.state };
  }
  const fetchColor = async () => {
    try {
      setIsLoading(true);
      const data = await API.fetchColor(dataFilter);
      setFormData({ ...formData, productId: data[0].productId });
      setColors(data);
      setFilteredColors(data);
    } catch (error) {
      console.error("Error fetching colors:", error);
      toast.error("Failed to load colors");
    } finally {
      setIsLoading(false);
    }
  };
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = colors.filter((color) =>
      color.name.toLowerCase().includes(term)
    );
    setFilteredColors(filtered);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await API.createColor(formData);
      await fetchColor(dataFilter);
      setIsAddModalOpen(false);
      setFormData({
        name: "",
        hexCode: "",
        productId: 0,
      });
      toast.success("Color added successfully");
    } catch (error) {
      console.error("Error adding color:", error);
      toast.error("Failed to add color");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await API.updateColor(selectedColor.id, formData);
      await fetchColor(dataFilter);
      setIsEditModalOpen(false);
      setFormData({
        name: "",
        hexCode: "",
        productId: 0,
      });
      toast.success("Color updated successfully");
    } catch (error) {
      console.error("Error updating color:", error);
      toast.error("Failed to update color");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await API.deleteColor(selectedColor.id);
      await fetchColor(dataFilter);
      setIsDeleteModalOpen(false);
      toast.success("Color deleted successfully");
    } catch (error) {
      console.error("Error deleting color:", error);
      toast.error("Failed to delete color");
    } finally {
      setIsLoading(false);
    }
  };

  const openEditModal = (color) => {
    setSelectedColor(color);
    setFormData(color);
    setIsEditModalOpen(true);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    console.log(e.target.files[0]);
  };

  const uploadImage = (color) => {
    setSelectedColor(color);
    setIsUploadModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error("Please select an image to upload");
      return;
    }

    try {
      setUploadLoading(true);
      await API.updateColorImage(selectedColor.id, selectedFile);
      toast.success("Image uploaded successfully");
      setIsUploadModalOpen(false);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploadLoading(false);
      setSelectedFile(null);
    }
  };

  const openDeleteModal = (color) => {
    setSelectedColor(color);
    setIsDeleteModalOpen(true);
  };

  useEffect(() => {
    fetchColor(dataFilter);
  }, []);

  return (
    <>
      <motion.div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-100">Colors</h2>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            disabled={isLoading}
          >
            <FaPlus size={14} />
            Add Color
          </button>
          <div className="relative">
            <input
              type="text"
              placeholder="Search colors..."
              className="bg-gray-700 text-white rounded-lg pl-10 pr-4 py-2"
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400">
                    Id
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400">
                    Hex Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-700">
                {filteredColors &&
                  filteredColors.map((color) => (
                    <motion.tr key={color.id}>
                      <td className="px-6 py-4 text-gray-100">{color.id}</td>
                      <td className="px-6 py-4 text-gray-300">
                        {color.Product.name} {color.Product.subName}
                      </td>
                      <td className="px-6 py-4 text-gray-300">{color.name}</td>
                      <td className="px-6 py-4 text-gray-300 flex items-center gap-2">
                        <span
                          style={{ backgroundColor: color.hexCode }}
                          className="w-4 h-4 rounded-full inline-block"
                        ></span>
                        {color.hexCode}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        <button
                          onClick={() => openEditModal(color)}
                          className="text-indigo-400 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => uploadImage(color)}
                          className="text-orange-600 mr-4"
                        >
                          Upload
                        </button>
                        <button
                          onClick={() => openDeleteModal(color)}
                          className="text-red-400"
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

      {/* Add Color Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Color"
      >
        <form onSubmit={handleAdd}>
          <input
            type="text"
            placeholder="Color Name"
            value={formData.name}
            className="text-black"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Hex Code"
            value={formData.hexCode}
            className="text-black"
            onChange={(e) =>
              setFormData({ ...formData, hexCode: e.target.value })
            }
            required
          />
          <button type="submit">{isLoading ? "Adding..." : "Add Color"}</button>
        </form>
      </Modal>

      {/* Upload Image Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          setSelectedFile(null);
        }}
        title="Upload Color Image"
      >
        <form onSubmit={handleImageUpload}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Select Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2"
              disabled={uploadLoading}
            />
          </div>

          {selectedFile && (
            <div className="mb-4">
              <p className="text-gray-300 mb-2">Selected File:</p>
              <div className="bg-gray-700 p-2 rounded-lg text-gray-300 text-sm truncate">
                {selectedFile.name}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => {
                setIsUploadModalOpen(false);
                setSelectedFile(null);
              }}
              className="px-4 py-2 text-gray-400 hover:text-gray-200 transition-colors"
              disabled={uploadLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              disabled={uploadLoading || !selectedFile}
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

      {/* Edit Color Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Color"
      >
        <form onSubmit={handleEdit}>
          <input
            type="text"
            placeholder="Color Name"
            value={formData.name}
            className="text-black"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Hex Code"
            className="text-black"
            value={formData.hexCode}
            onChange={(e) =>
              setFormData({ ...formData, hexCode: e.target.value })
            }
            required
          />
          <button type="submit">
            {isLoading ? "Updating..." : "Update Color"}
          </button>
        </form>
      </Modal>

      {/* Delete Color Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Color"
      >
        <p>Are you sure you want to delete color "{selectedColor?.name}"?</p>
        <button onClick={handleDelete}>
          {isLoading ? "Deleting..." : "Delete"}
        </button>
      </Modal>
    </>
  );
};

export default ColorTable;
