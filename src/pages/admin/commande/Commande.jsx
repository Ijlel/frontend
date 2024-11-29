import React, { useState } from "react";
import {
  Button,
  Form,
  Modal,
  Table,
  Alert,
  OverlayTrigger,
  Tooltip,
  ButtonGroup,
} from "react-bootstrap";
import useCommande from "../../../hooks/useCommande.js";
import useCategorie from "../../../hooks/useCategorie.js";
import {
  EditIcon,
  DeleteIcon,
  CreateIcon,
} from "../../../assets/icons/Icons.jsx"; // Import reusable icons
import Loader from "../../../components/loader/Loader.jsx";
import { truncateText } from "../../../assets/utils/helpers.js";
import Pagination from "../../../components/paggination/Paggination.jsx";
import usePagination from "../../../hooks/usePagination.js";

const CommandesPage = () => {
  // Destructure custom hook to manage Commandes data and operations (CRUD)
  const {
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
    deleteCommande,
    product
  } = useCommande();
  const { category } = useCategorie;
  // Destructure pagination hook to manage current page and items
  const { currentPage, currentItems, totalPages, handlePageChange } =
    usePagination(commandes, 1);

  // State for handling modal visibility and form action
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState("create");
  const [commandeData, setCommandeData] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    category: { id: "" },
  });

  // Function to show the modal and set the action (create or update)
  const handleShow = (action, commande) => {
    setModalAction(action);
    if (action === "update" && commande) {
      setCommandeData({
        id: commande._id,
        name: commande.name,
        description: product.description,
        price: product.price,
        category: {
          id: product.category.id,
          name: product.category.name,
        },
      });
      setCommandeSelected(commande);
    }
    setShowModal(true);
  };

  //Function to close the modal and reset form data
  const handleClose = () => {
    setShowModal(false);
    setCommandeData({ id: "", name: "", description: "" });
    setCommandeSelected(null);
    setError(null);
  };

  // Function to handle form submission for creating or updating an commande
  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (modalAction === "create") {
      createCommande(commandeData)
        .then(() => {
          handleClose();
          getAllCommandes(); // Refresh list after creation
        })
        .catch((err) => {
          alert("Error creating commande");
        });
    } else if (modalAction === "update" && commandeSelected) {
      updateCommande(commandeSelected._id, commandeData)
        .then(() => {
          handleClose();
          getAllCommandes(); // Refresh list after update
        })
        .catch((err) => {
          alert("Error updating commande");
        });
    }
  };

  //  Function to handle deletion of an commande with confirmation
  const handleDeleteCommande = (id) => {
    if (window.confirm("Are you sure you want to delete this commande?")) {
      deleteCommande(id)
        .then(() => {
          getAllCommandes(); // Refresh list after deletion
        })
        .catch((err) => {
          alert("Error deleting commande");
        });
    }
  };

  return (
    <div className="container mt-4">
      {/*  Display an error message if there's an error */}
      {error && <Alert variant="danger">{error}</Alert>}

      <div className="d-flex justify-content-between">
        <h1>Commandes Page</h1>
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip id="create-tooltip"> Create a new Commande </Tooltip>
          } // Display "Create a new commande" when hovered
        >
          <Button
            variant="primary"
            onClick={() => handleShow("create")}
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
          {/* Table to display the list of commandes */}
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
                currentItems.map((commande) => (
                  <tr key={commande._id}>
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id="nameCommande-tooltip">
                          {commande.name}
                        </Tooltip>
                      } // Display Full Name when hovered
                    >
                      <td>{truncateText(commande.status, 5)}</td>
                    </OverlayTrigger>

                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id="nameCommande-tooltip">
                          {commande.description}
                        </Tooltip>
                      } // Display Full Description when hovered
                    >
                      <td>{truncateText(commande.description, 5)}</td>
                    </OverlayTrigger>

                    <td>
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id="edit-tooltip">Update</Tooltip>} // Display "Update" when hovered
                      >
                        <Button
                          variant="warning"
                          onClick={() => handleShow("update", commande)}
                          className="me-2"
                        >
                          <EditIcon />
                        </Button>
                      </OverlayTrigger>

                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip id="delete-tooltip"> Delete </Tooltip>
                        } // Display "Delete" when hovered
                      >
                        <Button
                          variant="danger"
                          onClick={() => handleDeleteCommande(commande._id)}
                        >
                          <DeleteIcon />
                        </Button>
                      </OverlayTrigger>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No Data Found</td>
                </tr>
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

          {/* Modal for creating or updating Commandes */}
          <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>
                {modalAction === "create"
                  ? "Create Commande"
                  : "Update Commande"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleFormSubmit}>
                <Form.Group controlId="formCommandeName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter name"
                    value={commandeData.name}
                    onChange={(e) =>
                      setCommandeData({ ...commandeData, name: e.target.value })
                    }
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formCommandeDescription">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter description"
                    value={commandeData.description}
                    onChange={(e) =>
                      setCommandeData({
                        ...commandeData,
                        description: e.target.value,
                      })
                    }
                    required
                  />
                </Form.Group>

                <ButtonGroup className="my-2 d-flex justify-content-end">
                  <Button variant="primary" type="submit" className="me-2">
                    {modalAction === "create" ? "Create" : "Update"}
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      handleClose();
                    }}
                  >
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
};

export default CommandesPage;
