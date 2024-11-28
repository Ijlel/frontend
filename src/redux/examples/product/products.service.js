import axios from "axios";

const API_URL = "http://localhost:4000";

// // Create product
const create = async (productData) => {
    try {
        const response = await axios.post(`${API_URL}/product`, productData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Read all products
const getAll = async () => {
    try {
        const response = await axios.get(`${API_URL}/product`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Read product by ID
const getById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/product/${id}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Update product
const update = async (id, productData) => {
    try {
        const response = await axios.put(`${API_URL}/example/${id}`, productData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Delete product
const remove = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/product/${id}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const productService = {
    create,
    getAll,
    getById,
    update,
    remove,
};

export default productService;
