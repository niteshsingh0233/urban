const mongoose = require(`mongoose`);

const contactSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
    minLength: [10, "Number should be of length 10."],
    maxLength: [10, "Number should be of length 10."],
  },
  interestedIn: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Contact", contactSchema);
