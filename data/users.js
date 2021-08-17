import bcrypt from 'bcryptjs';

const users = [
	{
		name: 'Admin',
		email: 'admin@example.com',
		password: bcrypt.hashSync('admin', 10),
		isAdmin: true,
	},
	{
		name: 'John',
		email: 'john@example.com',
		password: bcrypt.hashSync('john', 10),
	},
	{
		name: 'Jane',
		email: 'jane@example.com',
		password: bcrypt.hashSync('jane', 10),
	},
];

export default users;
