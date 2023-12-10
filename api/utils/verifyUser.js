/** 
import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) return next(errorHandler(401, 'Unauthorized'));

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) return next(errorHandler(403, 'Forbidden'));

        req.user = user;
        next();
    });
};

*/
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) return next(errorHandler(401, 'Unauthorized'));

    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
        if (err) return next(errorHandler(403, 'Forbidden'));

        try {
            const user = await User.findById(decoded.id);
            if (!user) return next(errorHandler(404, 'User not found'));

            req.user = user; // Now req.user contains the full user document
            next();
        } catch (error) {
            next(error);
        }
    });
};
