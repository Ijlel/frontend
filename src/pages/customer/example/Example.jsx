import React, { useState, useEffect } from 'react';
import { Button, Card, Row, Col, Alert } from 'react-bootstrap';
import { ShopIcon } from '../../../assets/icons/Icons.jsx';
import Loader from '../../../components/loader/Loader.jsx';
import { truncateText } from '../../../assets/utils/helpers.js';
import usePagination from '../../../hooks/usePagination.js';
import useExamples from '../../../hooks/useExample.js';
import Pagination from '../../../components/paggination/Paggination.jsx'

const ExamplesPage = () => {
    // Destructuring custom hook to manage examples data and operations
    const {
        examples,
        isLoading,
        error,
        getAllExamples
    } = useExamples();

    // Hook for managing pagination
    const { currentPage, currentItems, totalPages, handlePageChange } =
        usePagination(examples, 1);

    useEffect(() => {
        getAllExamples(); // Fetch products when the page is mounted
    }, []);

    // Handle adding product to cart
    const handleAddToCart = (product) => {
        console.log(product);
    };

    return (
        <div className="container mt-4">
            {/* Display error message if any */}
            {error && <Alert variant="danger">{error}</Alert>}

            <div className='d-flex justify-content-between'>
                <h1>Examples</h1>
            </div>

            {/* Show loader while data is being fetched */}
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    {/* Display products as cards */}
                    <Row>
                        {currentItems?.length > 0 ? (
                            currentItems.map((product) => (
                                <Col key={product._id} md={4} className="mb-4">
                                    <Card>
                                        <Card.Img variant="top" src={product.imageUrl} alt={product.name} />
                                        <Card.Body>
                                            <Card.Title>{truncateText(product.name, 15)}</Card.Title>
                                            <Card.Text>{truncateText(product.description, 50)}</Card.Text>
                                            <h5>${product.price}</h5>
                                            <Button variant="primary" onClick={() => handleAddToCart(product)}>
                                                <ShopIcon /> Add to Cart
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))
                        ) : (
                            <p>No products found</p>
                        )}
                    </Row>

                    {/* Display pagination */}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        disabled={currentItems?.length === 0}
                    />
                </>
            )}
        </div>
    );
};

export default ExamplesPage;
