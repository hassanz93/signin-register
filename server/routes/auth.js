const router = require('express').Router();
const User = require('../model/User.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {registerValidation, loginValidation} = require('../validation.js');

// in index.js route starts at /api/user
// so at register it continous at /api/user/register
router.post('/register', async (req, res) => {

    //Lets validate the data before we input user
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send( error.details[0].message);
    
    // Checking if the user is already in the database
    const emailExist = await User.findOne({email: req.body.email})
    if (emailExist) return res.status(400).send('Email already exists');

    //Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try {
        const savedUser = await user.save();
        res.send(savedUser);
    }catch(err) {
        res.status(400).send(err);
    }

});

// Login
router.post('/login', async (req, res) => {

    //Lets validate the data before we input user
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send( error.details[0].message );

    // Checking if the email exists
    const user = await User.findOne({email: req.body.email})
    if (!user) return res.status(400).send( 'Email or password are incorrect');

    // Checking if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send("Invalid password");

    // Create and assign a token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
    res.header('auth-token', token).send(token)
});

module.exports = router;