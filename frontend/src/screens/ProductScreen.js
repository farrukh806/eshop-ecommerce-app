import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	Row,
	Col,
	Image,
	ListGroup,
	Card,
	Button,
	Form,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { listProduct } from '../actions/productActions';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';

const ProductScreen = ({ history, match }) => {
	const dispatch = useDispatch();
	const [quantity, setQuantity] = useState(1);
	const productDetails = useSelector((state) => state.productDetails);
	const { loading, error, product } = productDetails;

	useEffect(() => {
		dispatch(listProduct(match.params.id));
	}, [dispatch, match]);

	const addToCartHandler = () => {
		history.push(`/cart/${match.params.id}?qty=${quantity}`);
	};
	return (
		<>
			<Link className='btn btn-dark my-3' to='/'>
				Go back
			</Link>
			{loading ? (
				<Loader />
			) : error ? (
				<Message varint='danger'>{error}</Message>
			) : (
				<Row>
					<Col md={6}>
						<Image src={product.image} alt={product.name} fluid />
					</Col>

					<Col md={3}>
						<ListGroup variant='flush'>
							<ListGroup.Item>
								<h4>{product.name}</h4>
							</ListGroup.Item>
							<ListGroup.Item>
								<Rating
									value={product.rating}
									text={`${product.numReviews} reviews`}
								/>
							</ListGroup.Item>
							<ListGroup.Item>Price: ${product.price}</ListGroup.Item>
							<ListGroup.Item>Description:{product.description}</ListGroup.Item>
						</ListGroup>
					</Col>
					<Col md={3}>
						<Card>
							<ListGroup variant='flush'>
								<ListGroup.Item>
									<Row>
										<Col>Price:</Col>
										<Col>
											<strong>${product.price}</strong>
										</Col>
									</Row>
								</ListGroup.Item>

								<ListGroup.Item>
									<Row>
										<Col>Status:</Col>
										<Col>
											<strong>
												{product.countInStock > 0 ? 'In stock' : 'Out of stock'}
											</strong>
										</Col>
									</Row>
								</ListGroup.Item>
								{product.countInStock > 0 && (
									<ListGroup.Item>
										<Row>
											<Col>Quantity</Col>
											<Col>
												<Form.Control
													as='select'
													value={quantity}
													onChange={(e) => setQuantity(e.target.value)}>
													{[...Array(product.countInStock).keys()].map((x) => (
														<option key={x + 1} value={x + 1}>
															{x + 1}
														</option>
													))}
												</Form.Control>
											</Col>
										</Row>
									</ListGroup.Item>
								)}
								<ListGroup.Item>
									<Button
										className='btn-block btn-dark'
										onClick={addToCartHandler}
										type='button'
										disabled={product.countInStock === 0}>
										Add to Cart
									</Button>
								</ListGroup.Item>
							</ListGroup>
						</Card>
					</Col>
				</Row>
			)}
		</>
	);
};

export default ProductScreen;
