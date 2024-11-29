import { useEffect, useState } from 'react'
import axios from 'axios'

const useCommandes = () => {
    const [commandes, setCommandes] = useState([])
    const [commandeSelected, setCommandeSelected] = useState(null)
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    // Get All Commandes
    const getAllCommandes = async () => {
        try {
            setIsLoading(true)
            const response = await axios.get("http://localhost:4000/commande")
            setCommandes(response.data.payload)
        } catch (error) {
            setError(error?.data?.message || 'Error fetching commandes')
            console.error("Error getting all commandes", error)
        } finally {
            setIsLoading(false)
        }
    }

    // Get One commande
    const getCommandeById = async (id) => {
        try {
            setIsLoading(true)
            const response = await axios.get(`http://localhost:4000/commande/${id}`)
            setCommandeSelected(response.data.payload)
        } catch (error) {
            setError(error?.data?.message || `Error fetching commande with id: ${id}`)
            console.error("Error getting commande by id", error)
        } finally {
            setIsLoading(false)
        }
    }

    // Create an Commande
    const createCommande = async (commandeData) => {
        try {
            setIsLoading(true);
            const response = await axios.post("http://localhost:4000/examples", commandeData);
            // Check if prevCommandes is an array before updating the state
            setCommandes((prevCommandes) => {
                // If prevCommandes is an array, add the new commande to the array
                if (Array.isArray(prevCommandes)) {
                    return [...prevCommandes, response.data.payload];  // Spread the old commandes and add the new one
                } else {
                    return [response.data.payload];  // Return an array with the newly created commande
                }
            });
            getAllCommandes()
        } catch (error) {
            setError(error.response?.data?.message || 'Error creating commande');
            console.error("Error creating commande", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Update an commande
    const updateCommande = async (id, updatedData) => {
        try {
            setIsLoading(true)
            const response = await axios.put(`http://localhost:4000/commande/${id}`, updatedData)
            setCommandes(prevCommandes =>
                prevCommandes.map(commande => commande.id === id ? response.data.payload : commande)
            )
            setCommandeSelected(response.data.payload)

            getAllCommandes()
        } catch (error) {
            setError(error.response?.data?.message || `Error updating commande with id: ${id}`)
            console.error("Error updating commande", error)
        } finally {
            setIsLoading(false)
        }
    }

    // Delete an commande
    const deleteCommande = async (id) => {
        try {
            setIsLoading(true)
            await axios.delete(`http://localhost:4000/commande/${id}`)
            setCommandes(prevCommandes => prevCommandes.filter(commande => commande.id !== id))
            setCommandeSelected(null)
            getAllCommandes();
        } catch (error) {
            setError(error.response?.data?.message || `Error deleting commande with id: ${id}`)
            console.error("Error deleting commande", error)
        } finally {
            setIsLoading(false)
        }
    }

    // Effect to load commandes on component mount
    useEffect(() => {
        getAllCommandes()
    }, [])

    return {
        commandes,
        commandeSelected,
        setCommandeSelected,
        isLoading,
        error,
        setError,
        getAllCommandes,
        getCommandeById,
        createCommande,
        updateCommande,
        deleteCommande
    };
}

export default useCommandes
