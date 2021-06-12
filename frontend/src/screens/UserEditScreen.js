import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getUserDetails, editUserProfile } from '../actions/userActions';
import {USER_EDIT_RESET} from '../constants/userConstants';
import FormContainer from '../components/FormContainer';

const UserEditScreen = ({ match, history }) => {
	const userId = match.params.id;
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [isAdmin, setIsAdmin] = useState(false);

	const dispatch = useDispatch();

	const userDetails = useSelector((state) => state.userDetails);
	const { loading, user, error } = userDetails;

	const userEdit = useSelector((state) => state.userEdit);
	const {loading:loadingEditUpdate, success, error: editError} = userEdit;

	useEffect(() => {
		if(success) {
			dispatch({ type: USER_EDIT_RESET});
			history.push('/admin/userlist');
		}
		else{
			if(!user || user._id !== userId)
			dispatch(getUserDetails(userId))
			else {
				setEmail(user.email)
				setName(user.name)
				setIsAdmin(user.isAdmin)
			}
		}
	}, [user, userId, dispatch, success, history]);

	const submitHandler = (e) => {
		e.preventDefault();
		dispatch(editUserProfile({ _id: userId, name, email, isAdmin}));
	};

	return (
        <>
            <Link to='/admin/userlist' className='btn btn-sm btn-dark'>Go Back</Link>
		<FormContainer>
			<h1>Edit Profile</h1>
			{loadingEditUpdate && <Loader />}
			{editError && <Message variant='primary'>{editError}</Message>}
			{loading ? <Loader /> : error ? <Message variant='primary'>{error}</Message> : (

			<Form onSubmit={submitHandler}>
				<Form.Group controlId='name'>
					<Form.Label>Name</Form.Label>
					<Form.Control
						type='text'
						placeholder='Enter name'
						value={name}
						onChange={(e) => setName(e.target.value)}
					></Form.Control>
				</Form.Group>

				<Form.Group controlId='email'>
					<Form.Label>Email Address</Form.Label>
					<Form.Control
						type='email'
						placeholder='Enter email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					></Form.Control>
				</Form.Group>
				
                <Form.Group controlId='isAdmin'>
					<Form.Check
						type='checkbox'
                        label='Is Admin'
                        checked={isAdmin}
						onChange={(e) => setIsAdmin(e.target.checked)}
					></Form.Check>
				</Form.Group>

				<Button type='submit' variant='dark'>
					Update
				</Button>
			</Form>
            )}

		</FormContainer>
        </>
	);
};

export default UserEditScreen;
