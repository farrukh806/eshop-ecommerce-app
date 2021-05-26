import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
	Row,
	Col,
	ListGroup,
	Image,
	Form,
	Button,
	Card,
} from 'react-bootstrap';
import { addToCart } from '../actions/cardActions';
import Message from '../components/Message';

const CartScreen = ({ match, location, history }) => {
	const productId = match.params.id;
	const quantity = location.search ? location.search.split('=')[1] : 1;
	const cart = useSelector((state) => state.cart);
	const { cartItems } = cart;
	const dispatch = useDispatch();
	useEffect(
		(productId, quantity) => {
			if (productId) {
				dispatch(addToCart(productId, quantity));
			}
		},
		[dispatch, productId, quantity]
	);
	return <></>;
};

export default CartScreen;
