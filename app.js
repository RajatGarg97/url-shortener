const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Database connection
connectDB();

// Allows our API to accept json data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs')
app.get('/', (req, res) => {
	res.render('index');
});

app.use('/', require('./routes/index'));
app.use('/api/url', require('./routes/url'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));