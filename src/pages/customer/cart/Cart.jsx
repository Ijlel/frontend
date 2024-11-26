import React from 'react';
import { Button, Image, Row, Col, Container, Alert } from 'react-bootstrap';
import useCartItem from '../../../hooks/useCartItem.js';
import { Link } from 'react-router-dom';

const CartItem = ({ data }) => {
    const {
        quantity,
        setQuantity,
        totalPrice,
        list,
        calculateTotalProduct,
        handleRemove,
        handleCancelOrder,
        handleConfirmOrder,
    } = useCartItem(data);

    // if (!data) {
    //     return (
    //         <Container className="text-center mt-5">
    //             <Alert variant="warning">
    //                 <Alert.Heading>Your shopping cart is empty </Alert.Heading>
    //                 <p>
    //                     It looks like you haven't added any products to your cart.
    //                 </p>
    //                 <Link to="/shop">
    //                     <Button variant="primary">
    //                         Show Products
    //                     </Button>
    //                 </Link>
    //             </Alert>
    //         </Container>
    //     );
    // }


    return (
        <div className="border rounded p-3 mb-4">
            <Row className="align-items-center">
                {/* Image Section */}
                <Col md={2} className="text-center">
                    <Image src={data?.image} rounded fluid width={50} alt={data?.nom || 'Product Image'} />
                </Col>

                {/* Product Name and Description */}
                <Col md={3}>
                    <h5>{data?.nom}</h5>
                    <p className="text-muted">{data?.description}</p>
                </Col>

                {/* Quantity Controls */}
                <Col md={3} className="text-center">
                    <Button
                        variant="danger"
                        onClick={() => quantity > 1 && setQuantity(q => q - 1)}
                        className="me-2"
                    >
                        -
                    </Button>
                    <span className="fw-bold">{quantity}</span>
                    <Button
                        variant="success"
                        onClick={() => setQuantity(q => q + 1)}
                        className="ms-2"
                    >
                        +
                    </Button>
                </Col>

                {/* Product Price */}
                <Col md={2} className="text-center">
                    <span className="fw-bold">{data?.prix} DT</span>
                </Col>

                {/* Total Price */}
                <Col md={2} className="text-center">
                    <span className="fw-bold">{totalPrice} DT</span>
                </Col>

                {/* Remove Button */}
                <Col md={1} className="text-center">
                    <Button variant="danger" onClick={handleRemove}>
                        <Image
                            src="https://cdn-icons-png.flaticon.com/512/6861/6861362.png"
                            width={30}
                            height={30}
                            alt="Remove Item"
                        />
                    </Button>
                </Col>
            </Row>

            {/* Total and Actions */}
            {list[list.length - 1]?._id === data?._id && (
                <div className="text-center mt-4">
                    <h4>Total: {calculateTotalProduct()} DT</h4>
                    <Button variant="danger" onClick={handleCancelOrder} className="me-3">
                        Cancel Order
                    </Button>
                    <Button variant="success" onClick={handleConfirmOrder}>
                        Confirm Order
                    </Button>
                </div>
            )}
        </div>
    );
};

export default CartItem;
