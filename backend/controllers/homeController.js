const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const User = require("../models/userModel");
const Home = require("../models/homeModel");

// Create Home
exports.createHome = catchAsyncError(async (req, res, next) => {
  const options = {
    name: req.body.name,
    shortDescription: req.body.shortDescription,
    longDescription: req.body.longDescription,
    address: req.body.address,
    maxPrice: req.body.maxPrice,
    minPrice: req.body.minPrice,
    category: req.body.category,
    keyHighlight: req.body.keyHighlight,
    user: req.user.id,
  };

  const home = await Home.create(options);

  res.status(201).json({
    success: true,
    home,
  });
});

// get All Homes
exports.getAllHomes = catchAsyncError(async (req, res, next) => {
  const homes = await Home.find();

  res.status(200).json({
    success: true,
    homes,
  });
});

//get single home
exports.getSingleHome = catchAsyncError(async (req, res, next) => {
  const home = await Home.findById(req.params.id);

  if (!home)
    return next(
      new ErrorHandler(`Home does not exist with id -: ${req.params.id}`),
      400
    );

  res.status(200).json({
    success: true,
    home,
  });
});

//delete home
exports.deleteHome = catchAsyncError(async (req, res, next) => {
  const home = await Home.findById(req.params.id);

  if (!home) {
    return next(
      new ErrorHandler(`Home does not exist with id -: ${req.params.id}`),
      400
    );
  }

  await home.remove();

  res.status(200).json({
    success: true,
    message: "Home deleted successfully.",
  });
});

//update home
exports.updateHome = catchAsyncError(async (req, res, next) => {
  let home = await Home.findById(req.params.id);

  if (!home) {
    return next(
      new ErrorHandler(`Home does not exist with id -: ${req.params.id}`),
      400
    );
  }

  home = await Home.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  await home.save();

  res.status(200).json({
    success: true,
    message: "Home updated Successfully.",
    home,
  });
});
