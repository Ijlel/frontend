import React, { useState } from 'react';
import { Button, Form, Modal, Table, Alert, OverlayTrigger, Tooltip, ButtonGroup } from 'react-bootstrap';
import useCategories from '../../../hooks/useCategorie.js';
import { EditIcon, DeleteIcon, CreateIcon } from '../../../assets/icons/Icons.jsx';  // Import reusable icons
import Loader from '../../../components/loader/Loader.jsx';
import { truncateText } from '../../../assets/utils/helpers.js';
import Pagination from '../../../components/paggination/Paggination.jsx';
import usePagination from '../../../hooks/usePagination.js';

const CategoriesPage = () => {
    // Destructure custom hook to manage categorie data and operations (CRUD)
    const {
        categories,
        isLoading,
        error,
        setError,
        getAllCategories,
        getCategorieById,
        createCategorie,
        updateCategorie,
        deleteCategorie,
        setCategorieSelected,
        categorieSelected
}= useCategories()

 //  Destructure pagination hook to manage current page and items
 const {currentPage, currentItems, totalPages, handlePageChange } =
 usePagination(categories,3);

   //  State for handling modal visibility and form action
   const [showModal, setShowModal] = useState(false);
   const [modalAction, setModalAction] = useState('create');
   const [categorieData, setCategorieData] = useState({ id: '', name: '', description: '' });

       //  Function to show the modal and set the action (create or update)
       const handleShow = (action, categorie) => {
        setModalAction(action);
        if (action === 'update' && categorie) {
            setCategorieData({ id: categorie._id, name: categorie.name, description: categorie.description });
            setCategorieSelected(categorie);
        }
        setShowModal(true);
    };
    
        // Function to close the modal and reset form data
        const handleClose = () => {
            setShowModal(false);
            setCategorieData({ id: '', name: '', description: '' });
            setCategorieSelected(null);
            setError(null)
        };

            // Function to handle form submission for creating or updating an Categorie
    const handleFormSubmit = (event) => {
        event.preventDefault();
        if (modalAction === 'create') {
            createCategorie(categorieData).then(() => {
                handleClose();
                getAllCategories(); // Refresh list after creation
            }).catch((err) => {
                alert("Error creating Categorie");
            });
        } else if (modalAction === 'update' && categorieSelected) {
            updateCategorie(categorieSelected._id, categorieData).then(() => {
                handleClose();
                getAllCategories(); // Refresh list after update
            }).catch((err) => {
                alert("Error updating categorie");
            });
        }
    };

      // Function to handle deletion of an categorie with confirmation
      const handleDeleteCategorie = (id) => {
        if (window.confirm('Are you sure you want to delete this categorie?')) {
            deleteCategorie(id).then(() => {
                getAllCategories(); // Refresh list after deletion
            }).catch((err) => {
                alert("Error deleting categorie");
            });
        }
    };

    return (
        <div className="container mt-4">
            {/*  Display an error message if there's an error */}
            {error && <Alert variant="danger">{error}</Alert>}

            <div className='d-flex justify-content-between'>
                <h1> Categories </h1>
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="create-tooltip">  Create a new Categorie </Tooltip>}  // Display "Create a new Categorie" when hovered
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
                    {/* Table to display the list of categories */}
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
                                currentItems.map((categorie) => (
                                    <tr key={categorie._id}>
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={<Tooltip id="nameCategorie-tooltip">{categorie.name}</Tooltip>}  // Display Full Name when hovered
                                        >
                                            <td>{truncateText(categorie.name, 10)}</td>
                                        </OverlayTrigger>

                                        <OverlayTrigger
                                            placement="top"
                                            overlay={<Tooltip id="nameCategorie-tooltip">{categorie.description}</Tooltip>}  // Display Full Description when hovered
                                        >
                                            <td>{truncateText(categorie.description, 50) || "-"}</td>
                                        </OverlayTrigger>

                                        <td>
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={<Tooltip id="edit-tooltip">Update</Tooltip>}  // Display "Update" when hovered
                                            >
                                                <Button
                                                    variant="warning"
                                                    onClick={() => handleShow('update', categorie)}
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
                                                    onClick={() => handleDeleteCategorie(categorie._id)}
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


            {/* Modal for creating or updating categories */}
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalAction === 'create' ? 'Create Categorie' : 'Update Categorie'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleFormSubmit}>
                        <Form.Group controlId="formCategorieName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter name"
                                value={categorieData.name}
                                onChange={(e) => setCategorieData({ ...categorieData, name: e.target.value })}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formCategorieDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter description"
                                value={categorieData.description}
                                onChange={(e) => setCategorieData({ ...categorieData, description: e.target.value })}
                                required
                            />
                        </Form.Group>

                        <ButtonGroup className="my-2 d-flex justify-content-end">
                        <Button variant="primary" type="submit" className='me-2'>
                            {modalAction === 'create' ? 'Create' : 'Update'}
                        </Button>
                        <Button variant="danger" onClick={() => { handleClose() }}>
                            cancel
                        </Button>e
                        </ButtonGroup>
                    </Form>
                </Modal.Body>
            </Modal>
                </>
            )}

        </div>
    );

}
 export default CategoriesPage;