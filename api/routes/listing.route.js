
import express from 'express';
import { createListing, deleteListing, updateListing, getListing, getListings, getListingByUserId } from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();


router.post('/create', verifyToken, createListing);
router.delete('/delete/:id', verifyToken, deleteListing);
router.post('/update/:id', verifyToken, updateListing);
router.get('/get/:id', getListing);
router.get('/get', getListings);

/**
 * Route for getting listings by user ID.
 * @name GET /getByUser
 * @function
 * @memberof module:routes/listing.route
 * @param {string} userId - User ID
 * @param {string} amount - Amount of listings to return, default 10
 * @param {string} sort - Sort order, default desc
 * @param {string} sortBy - Sort by, default create
 */
router.get('/getByUser', getListingByUserId);

export default router;