import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeItem, updateQuantity } from '../redux/cart/cart.slice.js'
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { toast } from "react-toastify";

const useCartItem = (data) => {
    const navigate = useNavigate()
    const currentUser = useSelector(state => state.auth.user);
    const dispatch = useDispatch();
    const cart = useSelector(state => state.cart);
    const list = cart.list;

    const [quantity, setQuantity] = useState(data?.quantity);
    const [totalPrice, setTotalPrice] = useState(data?.price * data?.quantity);
    const [error, setError] = useState('')
    useEffect(() => {
        setTotalPrice(data?.prix * quantity);
        dispatch(updateQuantity({ _id: data?._id, quantity }));
    }, [quantity, data?.prix, data?._id, dispatch]);

    const calculateTotalProduct = () => {
        if (list.length === 0) return 0;
        return list.reduce((acc, product) => acc + product.price * product.quantity, 0);
    };

    const handleRemove = () => {
        dispatch(removeItem({ _id: data?._id }));
    };

    const handleCancelOrder = async () => {
        const products = list.map(product => ({
            product_id: product._id,
            quantity: product.quantity,
            prixUnitaire: product.price,
        }));
        const commandeCanceled = {
            user_id: currentUser?._id,
            products,
            prixTotale: calculateTotalProduct(),
            status: "Canceled"
        };
        try {
            await axios.post('http://localhost:4000/commande/addCommande', commandeCanceled);
            toast.error('Canceled orders');
            navigate('/products');
        } catch (error) {
            console.error('Erreur lors de la création de la commande', error);
        }
    };

    const handleConfirmOrder = async () => {
        const products = list.map(product => ({
            product_id: product._id,
            quantite: product.quantity,
            prixUnitaire: product.prix,
        }));
        const commandeDone = {
            user_id: currentUser?._id,
            products,
            prixTotale: calculateTotalProduct(),
            etat: "Done"
        };
        try {
            await axios.post('http://localhost:4000/commande/addCommande', commandeDone);
            toast.success('Passer au Paiement');
            navigate('/Paiement');
        } catch (error) {
            console.error('Erreur lors de la création de la commande', error);
        }
    };

    return {
        quantity,
        setQuantity,
        totalPrice,
        list,
        calculateTotalProduct,
        handleRemove,
        handleConfirmOrder,
        handleCancelOrder

    };
};

export default useCartItem;
