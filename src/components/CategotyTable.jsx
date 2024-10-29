import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaPlus, FaTimes } from "react-icons/fa";
import { toast } from "react-hot-toast";
import API from "../utils/api";
import Modal from "./re-usable-components/Modal";
import { Link } from "react-router-dom";

const CategoryTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "" });
  const [isLoading, setIsLoading] = useState(false);

  const fetchAll = async () => {
    try {
      setIsLoading(true);
      const data = await API.fetchAll();
      setCategories(data);
      setFilteredCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = categories.filter((item) =>
      item.name.toLowerCase().includes(term)
    );
    setFilteredCategories(filtered);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await API.createCategory(formData);
      await fetchAll(); // Refresh the list
      setIsAddModalOpen(false);
      setFormData({ name: "" });
      toast.success("Category added successfully");
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Failed to add category");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await API.updateCategory(selectedCategory.id, formData);
      await fetchAll(); // Refresh the list
      setIsEditModalOpen(false);
      setFormData({ name: "" });
      toast.success("Category updated successfully");
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await API.deleteCategory(selectedCategory.id);
      await fetchAll(); // Refresh the list
      setIsDeleteModalOpen(false);
      toast.success("Category deleted successfully");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    } finally {
      setIsLoading(false);
    }
  };

  const openEditModal = (item) => {
    setSelectedCategory(item);
    setFormData({ name: item.name });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (item) => {
    setSelectedCategory(item);
    setIsDeleteModalOpen(true);
  };

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
            <h2 className="text-xl font-semibold text-gray-100">Categories</h2>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              disabled={isLoading}
            >
              <FaPlus size={14} />
              Add Category
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search categories..."
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
                    Artikel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-700">
                {filteredCategories.map((item) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                    <Link to="/products" state={item.id}>
                            <div className="text-sm font-medium text-gray-100">
                              {item.id}
                            </div>
                            </Link>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link to="/products" state={item.id}>
                          <div className="text-sm text-gray-300">
                            {item.name}
                          </div>
                        </Link>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                      <Link to="/products" state={item.id}>
                        <div className="text-sm text-gray-300">
                          {item.Products?.length || 0}
                        </div>
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

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Category"
      >
        <form onSubmit={handleAdd}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Category Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isLoading}
            />
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
              {isLoading ? "Adding..." : "Add Category"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Category"
      >
        <form onSubmit={handleEdit}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Category Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isLoading}
            />
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
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Category"
      >
        <div className="mb-4">
          <p className="text-gray-300">
            Are you sure you want to delete category "{selectedCategory?.name}"?
            This action cannot be undone.
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

export default CategoryTable;
