const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;


mongoose.connect('mongodb://localhost:27017/my_database', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Define Schema
const userSchema = new mongoose.Schema({
    name: String,
    lastName: String
});

const User = mongoose.model('User', userSchema);


app.use(bodyParser.json());


app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


app.post('/users', async (req, res) => {
    const user = new User({
        name: req.body.name,
        lastName: req.body.lastName
    });

    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


app.get('/users/search', async (req, res) => {
    const { name } = req.query;
    try {
        const user = await User.findOne({ name });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
        } else {
            res.json({ lastName: user.lastName });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
