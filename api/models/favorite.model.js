import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema({
    name: {
        type: String,
        default: "My Favorites",
    },
    listings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing'
    }],
});

const Favorite = mongoose.model('Favorite', favoriteSchema);

export default Favorite;
