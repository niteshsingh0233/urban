const mongoose = require(`mongoose`);

const homeSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Please enter the name for the home."],
  },
  shortDescription: {
    type: String,
    required: [true, "Please enter short description for home."],
  },
  longDescription: {
    type: String,
    required: [true, "Please enter long description fo home."],
  },
  address: {
    addressLine1: {
      type: String,
      required: true,
    },
    addressLine2: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pinCode: {
      type: Number,
      required: true,
      minLength: [6, "Pincode must be 6 char. long."],
    },
  },
  maxPrice: {
    type: Number,
    required: [true, "Please enter max price for home."],
  },
  minPrice: {
    type: Number,
    required: [true, "Please enter min price for home."],
  },
  category: {
    type: String,
    required: true,
  },
  ratings: {
    type: Number,
    default: 0,
  },
  numberOfReviews: {
    type: Number,
    default: 0,
  },
  keyHighlight: [
    {
      type: String,
      required: true,
    },
  ],
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("home", homeSchema);
