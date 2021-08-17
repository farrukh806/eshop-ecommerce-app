import React, { useEffect } from 'react';
import {Link} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'react-bootstrap';
import { listProducts } from '../actions/productActions';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';

const HomeScreen = ({ match }) => {
	const dispatch = useDispatch();
	const keyword = match.params.keyword;

	const pageNumber = match.params.pageNumber || 1;

	const productList = useSelector((state) => state.productList);
	const { loading, error, products, pages, page } = productList;

	useEffect(
		() => dispatch(listProducts(keyword, pageNumber)),
		[dispatch, keyword, pageNumber]
	);

	return (
		<>
			{!keyword ? (
				<ProductCarousel />
			) : (
				<Link to={'/'} className='btn btn-dark'>
					Go back
				</Link>
			)}
			<h1>Latest Products</h1>
			{loading ? (
				<Loader />
			) : error ? (
				<Message variant='danger'>{error}</Message>
			) : (
				<>
					<Row>
						{products.map((product) => (
							<Col sm={12} md={6} lg={4} xl={3} key={product._id}>
								<Product product={product} />
							</Col>
						))}
					</Row>
					<Paginate
						pages={pages}
						page={page}
						keyword={keyword ? keyword : ''}
					/>
				</>
			)}
		</>
	);
};

export default HomeScreen;
