const express = require('express');
const app = express();
const products = require('./data/products');
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
	res.send('API is running');
});

app.get('/api/products', (req, res) => {
	res.json(products);
});

app.get('/api/products/:id', (req, res) => {
	const product = products.find((p) => p._id === req.params.id);
	res.json(product);
});
app.listen(PORT, (success, err) => {
	if (!err) console.log(`Server started at ${PORT}`);
	else console.log(err);
});
