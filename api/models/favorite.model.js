import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema({
    listings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
        required: true
    }],
});

const Favorite = mongoose.model('Favorite', favoriteSchema);

export default Favorite;