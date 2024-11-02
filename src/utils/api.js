import axios from "axios";

// const API_BASE_URL = "http://localhost:8000";
const API_BASE_URL = "https://xeric-sandi-kantiss-cb026c8c.koyeb.app";

class API {
  static async fetchAll() {
    const response = await axios.get(`${API_BASE_URL}/all`, {});
    return response.data;
  }

  static async fetchCategory() {
    const response = await axios.get(`${API_BASE_URL}/category`, {});
    return response.data;
  }

  static async fetchProducts(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await axios.get(`${API_BASE_URL}/product?${queryParams}`, {});
    return response.data;
  }

  static async fetchColor(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await axios.get(`${API_BASE_URL}/color?${queryParams}`, {});
    return response.data;
  }

  static async fetchCategoryById(categoryId) {
    const response = await axios.get(`${API_BASE_URL}/category/${categoryId}`, {});
    return response.data;
  }

  static async fetchProductById(productId) {
    const response = await axios.get(`${API_BASE_URL}/product/${productId}`, {});
    return response.data;
  }

  static async fetchColorById(colorId) {
    const response = await axios.get(`${API_BASE_URL}/color/${colorId}`, {});
    return response.data;
  }

  static async createCategory(category) {
    const response = await axios.post(`${API_BASE_URL}/category`, category);
    return response.data;
  }

  static async updateCategory(categoryId, category) {
    const response = await axios.put(`${API_BASE_URL}/category/${categoryId}`, category);
    return response.data;
  }

  static async deleteCategory(categoryId) {
    await axios.delete(`${API_BASE_URL}/category/${categoryId}`);
  }

  static async createProduct(product) {
    const response = await axios.post(`${API_BASE_URL}/product`, product);
    return response.data;
  }

  static async updateProduct(productId, product) {
    const response = await axios.put(`${API_BASE_URL}/product/${productId}`, product);
    return response.data;
  }

  static async deleteProduct(productId) {
    await axios.delete(`${API_BASE_URL}/product/${productId}`);
  }

  static async createColor(color) {
    const response = await axios.post(`${API_BASE_URL}/color`, color);
    return response.data;
  }

  static async updateColor(colorId, color) {
    const response = await axios.put(`${API_BASE_URL}/color/${colorId}`, color);
    return response.data;
  }

  static async deleteColor(colorId) {
    await axios.delete(`${API_BASE_URL}/color/${colorId}`);
  }

  static async updateProductImages(productId, imageFiles) {
    const formData = new FormData();
    imageFiles.forEach((file) => {
      formData.append("photos", file);
    });

    console.log(imageFiles)
    const response = await axios.patch(
      `${API_BASE_URL}/productimage/${productId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(response)
    return response.data;

  }

  static async updateColorImage(colorId, imageFile) {
    const formData = new FormData();
    formData.append("photo", imageFile);

    for (let pair of formData.entries()) {
      console.log(pair[0]+ ', ' + pair[1]); 
  }

    const response = await axios({
        
        method: 'PATCH',
        url : `${API_BASE_URL}/colorimage/${colorId}`,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data"
        },

      }
    );
    return response.data;
  }
}

export default API;