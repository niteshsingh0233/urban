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
      new ErrorHandler(`Home does not exist with id -: ${req.params.id}`, 400)
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
      new ErrorHandler(`Home does not exist with id -: ${req.params.id}`, 400)
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
      new ErrorHandler(`Home does not exist with id -: ${req.params.id}`, 400)
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

// wishlist a home (User)
exports.wishlistHome = catchAsyncError(async (req, res, next) => {
  const home = await Home.findById(req.params.id);
  let user = await User.findById(req.user.id);

  if (!home) {
    return next(
      new ErrorHandler(`Home does not exist with id -: ${req.params.id}`, 400)
    );
  }

  // const updatedwishlist = [...home];
  // const newHome = [home];
  // const oldHomes = [{homeuser.wishList}];
  // const updatedwishlist = user.wishList.concat(newHome);
  // const options = {
  //   wishList: updatedwishlist,
  // };
  // console.log(updatedwishlist);
  // user = await User.findByIdAndUpdate(req.user.id, options);

  if (user.role === "admin") {
    return next(new ErrorHandler(`Admin cannot add home to wishlist `, 400));
  }

  if (user.wishList.includes(home._id)) {
    return next(new ErrorHandler("Home is already wishlisted.", 400));
  }

  user.wishList.push(home);

  console.log(home);

  console.log(user.wishList);

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    user,
  });
});

// remove from wishlist (User)
exports.removeWishlist = catchAsyncError(async (req, res, next) => {
  const home = await Home.findById(req.params.id);
  let user = await User.findById(req.user.id);

  if (!home) {
    return next(
      new ErrorHandler(`Home does not exist with id -: ${req.params.id}`, 400)
    );
  }

  if (user.role === "admin") {
    return next(
      new ErrorHandler(`Admin cannot remove home from wishlist.`, 400)
    );
  }

  const filterWishlist = user.wishList.filter((home) => home !== home._id);

  user = await User.findByIdAndUpdate(
    req.user.id,
    {
      wishList: filterWishlist,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    user,
  });
});

// filter home (nearby Station)
exports.findNearbyHomes = catchAsyncError(async (req, res, next) => {
  const area = req.params.area;

  let homes = await Home.find();

  // console.log(homes[1].address.nearbyStation);

  homes = homes.filter((home) => home.address.nearbyStation === area);

  if (homes.length === 0) {
    return next(
      new ErrorHandler(`Currently we don't have any homes in ${area} area`, 400)
    );
  }

  res.status(200).json({
    success: true,
    message: `Following are the homes available in aera -: ${area}`,
    homes,
  });
});

// filter based on category (rent , buy)
exports.findFilteredHomes = catchAsyncError(async (req, res, next) => {
  const category = req.params.category;

  let homes = await Home.find();

  homes = homes.filter((home) => home.category == category);

  if (homes.length === 0) {
    return next(
      new ErrorHandler(
        `Currently we don't have any homes for ${category} category.`,
        400
      )
    );
  }

  res.status(200).json({
    success: true,
    message: `Following are the homes available for category -: ${category}`,
    homes,
  });
});

// filter homes based on price ranges
exports.priceFilterHomes = catchAsyncError(async (req, res, next) => {
  const { minP, maxP } = req.query;
  let homes = await Home.find();

  // console.log(minP, maxP);

  homes = homes.filter(
    (home) => home.minPrice >= minP && home.maxPrice <= maxP
  );

  if (homes.length === 0) {
    return next(
      new ErrorHandler("Homes does not exist with this price range", 400)
    );
  }

  res.status(200).json({
    success: true,
    homes,
  });
});
