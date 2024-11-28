import React, { useState } from 'react';
import { Button, Form, Modal, Table, Alert, OverlayTrigger, Tooltip, ButtonGroup } from 'react-bootstrap';
import useProducts from '../../../hooks/useProduct.js';
import { EditIcon, DeleteIcon, CreateIcon } from '../../../assets/icons/Icons.jsx';  // Import reusable icons
import Loader from '../../../components/loader/Loader.jsx';
import { truncateText } from '../../../assets/utils/helpers.js';
import Pagination from '../../../components/paggination/Paggination.jsx';
import usePagination from '../../../hooks/usePagination.js';

const ProductsPage = () => {

    // Destructure custom hook to manage Products data and operations (CRUD)
    const {
        products,
        productSelected,
        setProductSelected,
        isLoading,
        error,
        setError,
        getAllProducts,
        getProductById,
        createProduct,
        updateProduct,
        deleteProduct,
       
    } = useProducts()

    // Destructure pagination hook to manage current page and items
    const { currentPage, currentItems, totalPages, handlePageChange } =
        usePagination(products,3);

            // State for handling modal visibility and form action
    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState('create');
    const [productData, setProductData] = useState({ id: '', name: '', description: '', price: '' ,category: ''});

        // Function to show the modal and set the action (create or update)
        const handleShow = (action, product) => {
            setModalAction(action);
            if (action === 'update' && product) {
                setProductData({ id: product._id, name: product.name, description: product.description,price: product.price, category: product.category });
                setProductSelected(product);
            }
            setShowModal(true);
        };

    // Function to close the modal and reset form data
    const handleClose = () => {
        setShowModal(false);
        setProductData({ id: '', name: '', description: '',price: '' ,category: '' });
        setProductSelected(null);
        setError(null)
    };

   //Function to handle form submission for creating or updating an product
    const handleFormSubmit = (event) => {
        event.preventDefault();
        if (modalAction === 'create') {
            createProduct(productData).then(() => {
                handleClose();
                getAllProducts(); // Refresh list after creation
            }).catch((err) => {
                alert("Error creating product");
            });
        } else if (modalAction === 'update' && productSelected) {
            updateProduct(productSelected._id, productData).then(() => {
                handleClose();
                getAllProducts(); // Refresh list after update
            }).catch((err) => {
                alert("Error updating product");
            });
        }
    };

  //  Function to handle deletion of an product with confirmation
  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
        deleteProduct(id).then(() => {
            getAllProducts(); // Refresh list after deletion
        }).catch((err) => {
            alert("Error deleting product");
        });
    }
};
return (
    <div className="container mt-4">
        {/*  Display an error message if there's an error */}
        {error && <Alert variant="danger">{error}</Alert>}

        <div className='d-flex justify-content-between'>
            <h1>Products Page</h1>
            <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="create-tooltip">  Create a new Product </Tooltip>}  // Display "Create a new Product" when hovered
            >
                <Button
                    variant="primary"
                    onClick={() => handleShow('create')}
                    disabled={isLoading}
                >
                    <CreateIcon />
                </Button>
            </OverlayTrigger>

        </div>

        {/* Show a loading spinner while data is being fetched */}
        {isLoading ? (
            <Loader />
        ) : (
            <>
                {/* Table to display the list of products */}
                <Table striped bordered hover className="mt-4">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems?.length > 0 ? (
                            currentItems.map((product) => (
                                <tr key={product._id}>
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={<Tooltip id="nameProduct-tooltip">{product.name}</Tooltip>}  // Display Full Name when hovered
                                    >
                                        <td>{truncateText(product.name, 10)}</td>
                                    </OverlayTrigger>

                                    <OverlayTrigger
                                        placement="top"
                                        overlay={<Tooltip id="nameProduct-tooltip">{product.description}</Tooltip>}  // Display Full Description when hovered
                                    >
                                        <td>{truncateText(product.description,50)}</td>
                                    </OverlayTrigger>

                                    <td>
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={<Tooltip id="edit-tooltip">Update</Tooltip>}  // Display "Update" when hovered
                                        >
                                            <Button
                                                variant="warning"
                                                onClick={() => handleShow('update', product)}
                                                className="me-2"
                                            >
                                                <EditIcon />
                                            </Button>
                                        </OverlayTrigger>

                                        <OverlayTrigger
                                            placement="top"
                                            overlay={<Tooltip id="delete-tooltip"> Delete </Tooltip>}  // Display "Delete" when hovered
                                        >
                                            <Button
                                                variant="danger"
                                                onClick={() => handleDeleteProduct(product._id)}
                                            >
                                                <DeleteIcon />
                                            </Button>
                                        </OverlayTrigger>

                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="3">No Data Found</td></tr>
                        )}
                    </tbody>
                </Table>

                {/* Display pagination if there are items */}
                      {!error && currentItems?.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                )}


        {/* Modal for creating or updating products */}
        <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{modalAction === 'create' ? 'Create Product' : 'Update Product'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleFormSubmit}>
                    <Form.Group controlId="formProductName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter name"
                            value={productData.name}
                            onChange={(e) => setProductData({ ...productData, name: e.target.value })}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="formProductDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Enter description"
                            value={productData.description}
                            onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="formProductDescription">
                        <Form.Label> Price </Form.Label>
                        <Form.Control
                            type="number"
                            rows={3}
                            placeholder="Enter price"
                            value={productData.price}
                            onChange={(e) => setProductData({ ...productData, price: e.target.value })}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="formProductDescription">
                        <Form.Label> Category </Form.Label>
                        <Form.Control
                            type="number"
                            rows={3}
                            placeholder="Enter category"
                            value={productData.category}
                            onChange={(e) => setProductData({ ...productData, category: e.target.value })}
                            required
                        />
                    </Form.Group>

                    <ButtonGroup className="my-2 d-flex justify-content-end">
                    <Button variant="primary" type="submit" className='me-2'>
                        {modalAction === 'create' ? 'Create' : 'Update'}
                    </Button>
                    <Button variant="danger" onClick={() => { handleClose() }}>
                        cancel
                    </Button>
                    </ButtonGroup>
                </Form>
            </Modal.Body>
        </Modal>
            </>
        )}

    </div>
);

}
export default ProductsPage;
