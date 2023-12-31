
import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};


export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }
  if (req.user.id !== listing.userRef && req.user.type !== 'admin') {
    return next(errorHandler(401, 'You can only delete your own listings!'));
  }
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('Listing has been deleted!');
  } catch (error) {
    next(error);
  }
};


export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }
  if (req.user.id !== listing.userRef && req.user.type !== 'admin' ) {
    return next(errorHandler(401, 'You can only update your own listings!'));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }

}

export const getListingByUserId = async (req, res, next) => {
  try {
    const userId = req.query.userId;
    const amount = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || "desc";
    const sortOption = sort === "asc" ? 1 : -1;

    const sortBy = req.query.sortBy || "create";
    const sortByOptions = sortBy === "create" ? "createdAt" : "updatedAt";

    const listings = await Listing.find({ userRef: userId })
      .sort({ [sortByOptions]: sortOption })
      .limit(amount)
    if (!listings) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
}

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = parseInt(req.query.startIndex) || 0;

    let offer = req.query.offer;
    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;
    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;
    if (type === undefined || type === "all") {
      type = { $in: ['sale', 'rent'] };
    }

    const searchTerm = req.query.searchTerm || "";

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" }, // i means don't care about upeprcase or lowercase
      offer,
      furnished,
      parking,
      type,
    }).sort({ [sort]: order }).limit(limit).skip(startIndex)

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
}

export const getAllListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const start = parseInt(req.query.start) || 0;

    let offer = req.query.offer;
    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;
    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;
    if (type === undefined || type === "all") {
      type = { $in: ['sale', 'rent'] };
    }

    const searchTerm = req.query.searchTerm || "";

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" }, // i means don't care about upeprcase or lowercase
      offer,
      furnished,
      parking,
      type,
    }).skip(start)
    .limit(limit)
    .sort({ createdAt: -1 });

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
}

export const countAllListings = async (req, res, next) => {
  try {
    const count = await Listing.countDocuments();
    res.json({ count });
  } catch (error) {
    next(error);
  }
};
