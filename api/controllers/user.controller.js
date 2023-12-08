import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import Listing from '../models/listing.model.js';
import Favorite from '../models/favorite.model.js';

export const test = (req, res) => {
    res.json({
        message: 'Api route is working!',
    });
};

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id)
        return next(errorHandler(401, 'You can only update your own account!'));
    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    avatar: req.body.avatar,
                    location: req.body.location,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    description: req.body.description,
                },
            },
            { new: true }
        );

        const { password, ...rest } = updatedUser._doc;

        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id)
        return next(errorHandler(401, 'You can only delete your own account!'));
    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token');
        res.status(200).json('User has been deleted!');
    } catch (error) {
        next(error);
    }
};

export const getUserListings = async (req, res, next) => {
    if (req.user.id === req.params.id) {
        try {
            const listings = await Listing.find({ userRef: req.params.id });
            res.status(200).json(listings);
        } catch (error) {
            next(error);
        }
    } else {
        return next(errorHandler(401, 'You can only view your own listings!'));
    }
};

export const getUserFavoriteListings = async (req, res, next) => {
    if (req.user.id === req.params.id) {
        try {
            const user = await User.findById(req.user.id).populate('favorites');
            if (!user) {
                return next(errorHandler(404, 'User not found'));
            }

            if (!user.favorites) {
                return res.status(200).json([]);
            }
            const favorite = await Favorite.findById(user.favorites._id);

            const favoriteListings = await Listing.find({ '_id': { $in: favorite.listings } });

            res.status(200).json({favoriteListings, name: favorite.name});
        } catch (error) {
            next(error);
        }
    } else {
        return next(errorHandler(401, 'You can only view your own listings!'));
    }
};

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return next(errorHandler(404, 'User not found!'));
        const { password: pass, ...rest } = user._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
};

export const addFavorite = async (req, res, next) => {
    const { userId, listingId } = req.body;


    try {
        let user = await User.findById(userId).populate('favorites');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let favorite;
        if (user.favorites) {
            favorite = await Favorite.findById(user.favorites._id);
        } else {
            favorite = new Favorite({ listings: [] });
            user.favorites = favorite._id;
            await user.save();
        }
        favorite.listings.push(listingId);
        await favorite.save();

        res.status(200).json({ message: 'Listing added to favorites' });
    } catch (error) {
        next(error);
    }
};

export const removeFavorite = async (req, res, next) => {
    const { userId, listingId } = req.body;

    try {
        const user = await User.findById(userId).populate('favorites');
        if (!user || !user.favorites) {
            return res.status(404).json({ message: 'Favorites not found' });
        }

        const favorite = await Favorite.findById(user.favorites._id);
        favorite.listings.pull(listingId);
        await favorite.save();

        res.status(200).json({ message: 'Listing removed from favorites' });
    } catch (error) {
        next(error);
    }
};

export const checkIfFavorited = async (req, res, next) => {
    const { userId, listingId } = req.params;
    try {
        const user = await User.findById(userId).populate('favorites');
        if (!user) {
            return res.status(404).json({ message: 'Favorites not found' });
        }
        if (!user.favorites) {
            return res.status(200).json({ isFavorited: false });
        }

        const favorite = await Favorite.findById(user.favorites._id);
        const isFavorited = favorite.listings.includes(listingId);
        res.status(200).json({ isFavorited });
    } catch (error) {
        next(error);
    }
};
