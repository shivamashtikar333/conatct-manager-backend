// const asyncHandler = require('express-async-handler');
// const jwt = require('jsonwebtoken');

// const validateToken = asyncHandler(async (req, res, next) => {
//     let token;
//     let authHeader = req.headers.authorization;

//     if (authHeader && authHeader.startsWith("Bearer")) {
//         token = authHeader.split(' ')[1];

//         jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
//             if (err) {
//                 console.error(err);  // Log the error for debugging
//                 res.status(401);
//                 throw new Error("User is not Authorized");
//             }

//             console.log(decoded);
//         });
//     } else {
//         console.error("Token missing or in the wrong format");
//         res.status(401);
//         throw new Error("User is not Authorized or token is missing");
//     }

//     next();
// });

// module.exports = validateToken;

const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const validateToken = asyncHandler(async (req, res, next) => {
    let token;
    let authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(' ')[1];

        if (!token) {
            console.error("Token missing or in the wrong format");
            res.status(401);
            throw new Error("User is not Authorized or token is missing");
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    console.error("Token expired");
                    res.status(401);
                    throw new Error("Token expired");
                } else {
                    console.error(err);  // Log the error for debugging
                    res.status(401);
                    throw new Error("User is not Authorized");
                }
            }

            req.user = decoded.user;
            next();
        });
    } else {
        console.error("Token missing or in the wrong format");
        res.status(401);
        throw new Error("User is not Authorized or token is missing");
    }
});

module.exports = validateToken;
