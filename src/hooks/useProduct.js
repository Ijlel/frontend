import { useEffect, useState } from 'react'
import axios from 'axios'

const useProducts = () => {
    const [products, setProducts] = useState([])
    const [productSelected, setProductSelected] = useState(null)
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

//     // Get All Products
    const getAllProducts = async () => {
        try {
            setIsLoading(true)
            const response = await axios.get("http://localhost:4000/products")
            setProducts(response.data.payload)
        } catch (error) {
            setError(error?.data?.message || 'Error fetching products')
            console.error("Error getting all products", error)
        } finally {
            setIsLoading(false)
        }
    }

        // Get One product
        const getProductById = async (id) => {
            try {
                setIsLoading(true)
                const response = await axios.get(`http://localhost:4000/products/${id}`)
                setProductSelected(response.data.payload)
            } catch (error) {
                setError(error?.data?.message || `Error fetching product with id: ${id}`)
                console.error("Error getting product by id", error)
            } finally {
                setIsLoading(false)
            }
        }

            // Create an product
    const createProduct = async (productData) => {
        try {
            setIsLoading(true);
            const response = await axios.post("http://localhost:4000/products", productData);
            // Check if prevProducts is an array before updating the state
            setProducts((prevProducts) => {
                // If prevProducts is an array, add the new product to the array
                if (Array.isArray(prevProducts)) {
                    return [...prevProducts, response.data.payload];  // Spread the old products and add the new one
                } else {
                    return [response.data.payload];  // Return an array with the newly created product
                }
            });
            getAllProducts()
        } catch (error) {
            setError(error.response?.data?.message || 'Error creating product');
            console.error("Error creating product", error);
        } finally {
            setIsLoading(false);
        }
    };

        // Update an Product
        const updateProduct = async (id, updatedData) => {
            try {
                setIsLoading(true)
                const response = await axios.put(`http://localhost:4000/products/${id}`, updatedData)
                setProducts(prevProducts =>
                    prevProducts.map(product => product.id === id ? response.data.payload : product)
                )
                setProductSelected(response.data.payload)
    
                getAllProducts()
            } catch (error) {
                setError(error.response?.data?.message || `Error updating product with id: ${id}`)
                console.error("Error updating product", error)
            } finally {
                setIsLoading(false)
            }
        }

            // Delete an product
    const deleteProduct = async (id) => {
        try {
            setIsLoading(true)
            await axios.delete(`http://localhost:4000/products/${id}`)
            setProducts(prevProducts => prevProducts.filter(product => product.id !== id))
            setProductSelected(null)
            getAllProducts();
        } catch (error) {
            setError(error.response?.data?.message || `Error deleting product with id: ${id}`)
            console.error("Error deleting product", error)
        } finally {
            setIsLoading(false)
        }
    }

    // Effect to load products on component mount
    useEffect(() => {
        getAllProducts()
    }, [])

    return {
        products,
        error,
        isLoading,
        getAllProducts,
        setProductSelected,
        productSelected,
        createProduct,
        getProductById,
        updateProduct,
        deleteProduct,
        setError,      
    };
}

export default useProducts
