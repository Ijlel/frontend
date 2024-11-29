import { useEffect, useState } from "react";
import axios from "axios";

const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [userSelected, setUserSelected] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get All users
  const getAllUsers = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:4000/users");
      setUsers(response.data.payload);
    } catch (error) {
      setError(error?.data?.message || "Error fetching users");
      console.error("Error getting all users", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get One user
  const getUserById = async (id) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:4000/users/${id}`);
      setUserSelected(response.data.payload);
    } catch (error) {
      setError(error?.data?.message || `Error fetching user with id: ${id}`);
      console.error("Error getting user by id", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create an user
  const createUser = async (userData) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://localhost:4000/users",
        userData
      );
      // Check if prevUsers is an array before updating the state
      setUsers((prevUsers) => {
        // If prevUsers is an array, add the new user to the array
        if (Array.isArray(prevUsers)) {
          return [...prevUsers, response.data.payload]; // Spread the old users and add the new one
        } else {
          return [response.data.payload]; // Return an array with the newly created user
        }
      });
      getAllUsers();
    } catch (error) {
      setError(error.response?.data?.message || "Error creating user");
      console.error("Error creating user", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update an user
  const updateUser = async (id, updatedData) => {
    try {
      setIsLoading(true);
      const response = await axios.put(
        `http://localhost:4000/users/${id}`,
        updatedData
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === id ? response.data.payload : user))
      );
      setUserSelected(response.data.payload);

      getAllUsers();
    } catch (error) {
      setError(
        error.response?.data?.message || `Error updating user with id: ${id}`
      );
      console.error("Error updating user", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete an user
  const deleteUser = async (id) => {
    try {
      setIsLoading(true);
      await axios.delete(`http://localhost:4000/users/${id}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      setUserSelected(null);
      getAllUsers();
    } catch (error) {
      setError(
        error.response?.data?.message || `Error deleting user with id: ${id}`
      );
      console.error("Error deleting user", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to load users on component mount
  useEffect(() => {
    getAllUsers();
  }, []);
  return {
    users,
    userSelected,
    setUserSelected,
    isLoading,
    error,
    setError,
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
  };
};
export default useUsers;
