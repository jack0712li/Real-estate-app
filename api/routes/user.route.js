import express from 'express';
import { deleteUser, test, updateUser, getUserListings, getUser, addFavorite, removeFavorite, checkIfFavorited, getUserFavoriteListings, getAllUsers } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test', test);
router.post('/update/:id', verifyToken, updateUser)
router.delete('/delete/:id', verifyToken, deleteUser)
router.get('/listings/:id', verifyToken, getUserListings)
router.get('/:id', getUser)
router.get('', getAllUsers)
router.put('/favorite/add', verifyToken, addFavorite)
router.delete('/favorite/remove', verifyToken, removeFavorite)
router.get('/favorite/check/:userId/:listingId', verifyToken, checkIfFavorited)
router.get('/favorite/:id', verifyToken, getUserFavoriteListings)

export default router;