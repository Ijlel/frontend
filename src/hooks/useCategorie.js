import { useEffect, useState } from "react";
import axios from "axios";

const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [categorieSelected, setCategorieSelected] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  //     // Get All Categories
  const getAllCategories = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:4000/category");
      setCategories(response.data.payload);
    } catch (error) {
      setError(error?.data?.message || "Error fetching categories");
      console.error("Error getting all categories", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get One categorie
  const getCategorieById = async (id) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:4000/category/${id}`);
      setCategorieSelected(response.data.payload);
    } catch (error) {
      setError(
        error?.data?.message || `Error fetching categorie with id: ${id}`
      );
      console.error("Error getting categorie by id", error);
    } finally {
      setIsLoading(false);
    }
  };

      // Create an categorie
      const createCategorie = async (categorieData) => {
        try {
            setIsLoading(true);
            const response = await axios.post("http://localhost:4000/category", categorieData);
            // Check if prevCategorie is an array before updating the state
            setCategories((prevCategories) => {
                // If prevCategories is an array, add the new categorie to the array
                if (Array.isArray(prevCategories)) {
                    return [...prevCategories, response.data.payload];  // Spread the old categories and add the new one
                } else {
                    return [response.data.payload];  // Return an array with the newly created categorie
                }
            });
            getAllCategories()
        } catch (error) {
            setError(error.response?.data?.message || 'Error creating categorie');
            console.error("Error creating categorie", error);
        } finally {
            setIsLoading(false);
        }
    };

        // Update an categorie
        const updateCategorie = async (id, updatedData) => {
            try {
                setIsLoading(true)
                const response = await axios.put(`http://localhost:4000/category/${id}`, updatedData)
                setCategories(prevCategories =>
                    prevCategories.map(categorie => categorie.id === id ? response.data.payload : categorie)
                )
                setCategorieSelected(response.data.payload)
    
                getAllCategories()
            } catch (error) {
                setError(error.response?.data?.message || `Error updating categorie with id: ${id}`)
                console.error("Error updating categorie", error)
            } finally {
                setIsLoading(false)
            }
        }

            // Delete an categorie
    const deleteCategorie = async (id) => {
        try {
            setIsLoading(true)
            await axios.delete(`http://localhost:4000/category/${id}`)
            setCategories(prevCategories => prevCategories.filter(categorie => categorie.id !== id))
            setCategorieSelected(null)
            getAllCategories();
        } catch (error) {
            setError(error.response?.data?.message || `Error deleting categorie with id: ${id}`)
            console.error("Error deleting categorie", error)
        } finally {
            setIsLoading(false)
        }
    }

  // Effect to load categories on component mount
  useEffect(() => {
    getAllCategories();
  }, []);

  return {
    categories,
    error,
    isLoading,
    getAllCategories,
    getCategorieById,
    createCategorie,
    updateCategorie,
    deleteCategorie,
    setCategorieSelected,
    setError,
    categorieSelected
  };
};

export default useCategories;
