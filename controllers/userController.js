const express = require ('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

//@desc register user
//@route POST /api/user/register
//@access public

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }

    const userAvailable = await User.findOne({ email });

    if (userAvailable) {
        res.status(400);
        throw new Error("User already registered");
    }

    // Hashed password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Corrected: Use await with User.create
    const user = await User.create({
        username,
        email,
        password: hashedPassword,
    });

    console.log(`User created ${user}`);

    if (user) {
        res.status(201).json({ _id: user._id, email: user.email });
    } else {
        res.status(400);
        throw new Error('User data is not valid');
    }

    res.json({message:"register the user"});
});


//@desc login user
//@route POST /api/user/login
//@access private

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error('All fields are mandatory');
    }

    const user = await User.findOne({ email });

    // compare password with hashed password
    if (user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign(
            {
                user: {
                    username: user.username,
                    email: user.email,
                    id: user.id,
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );

        res.status(200).json({ accessToken });  // Send the token in the response
    } else {
        res.status(401).json({ error: 'Invalid email or password' });  // Send an error response
    }
});


//@desc current user info
//@route POST /api/user/current
//@access private


const currentUser = asyncHandler(async (req,res)=>{
    res.json(req.user);
});

module.exports = {currentUser,loginUser,registerUser};