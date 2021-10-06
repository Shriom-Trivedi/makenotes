const express = require("express");
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// create a user using: POST "/api/auth/createuser". No login required
router.post('/createuser',
    [
        body('name', 'Enter a valid name').isLength({min: 3}),
        body('email', 'Enter a valid mail').isEmail(),
        body('password', 'Password must be atleast 5 characters').isLength({min: 5}),
    ]
, async (req, res)=> {
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check whether the user with this email already exists.
    try {
    let user = await User.findOne({email: req.body.email});
    if(user) {
        return res.status(400).json({error: "Sorry a user with this email already exists"})
    }

    // securing with bcryptJs
    const salt = await bcrypt.genSalt(10);
    securePassword = await bcrypt.hash(req.body.password, salt);

    // Create a new user
    user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securePassword,
    })
    
    const data = {
        user: {
            id: user.id
        }
    }

    // jwt for authentication
    const authToken = jwt.sign(data, process.env.JWT_SECRET)
    res.json({authToken})

    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error occured");
    }

})

module.exports = router