import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import productService from "./products.service";

// Get user from localStorage
const user = localStorage.getItem("token");

const initialState = {
    user: user ? user : null,
    products: [], // For storing all products
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
};

// // Create product
export const createProduct = createAsyncThunk(
    "Create",
    async (product, thunkAPI) => {
        try {
            return await productService.create(product);
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// // Get all examples
export const getAllProducts = createAsyncThunk(
    "getAll",
    async (_, thunkAPI) => {
        try {
            return await productService.getAll();
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// // Get example by ID
export const getExampleById = createAsyncThunk(
    "Product getById",
    async (id, thunkAPI) => {
        try {
            return await productService.getById(id);
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// // Update Product
export const updateProduct = createAsyncThunk(
    "product update",
    async ({ id, product }, thunkAPI) => {
        try {
            return await productService.update(id, product);
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// // Delete product
export const deleteProduct = createAsyncThunk(
    "example/delete",
    async (id, thunkAPI) => {
        try {
            return await productService.remove(id);
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = "";
        },
    },
    extraReducers: (builder) => {
        builder
            // Create product
            .addCase(createProduct.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.products.push(action.payload);
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
//             // Get all products
            .addCase(getAllProducts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.products = action.payload;
            })
            .addCase(getAllProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
//             // Get product by ID
            .addCase(getProductById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getProductById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload; // Replace with the specific field where you want to store this example
            })
            .addCase(getProductById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
//             // Update product
            .addCase(updateProduct.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.products = state.products.map((product) =>
                    product.id === action.payload.id ? action.payload : product
                );
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
//             // Delete product
            .addCase(deleteProduct.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.products = state.products.filter(
                    (product) => product.id !== action.payload.id
                );
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset } = productSlice.actions;
export default productSlice.reducer;
