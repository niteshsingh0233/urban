const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const Contact = require("../models/contactModel");

// create contact form
exports.createContactUs = catchAsyncError(async (req, res, next) => {
  const contact = await Contact.create(req.body);

  res.status(201).json({
    success: true,
    contact,
  });
});

// get all contact forms
exports.getAllContactUs = catchAsyncError(async (req, res, next) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    contacts,
  });
});

//get single contact forms
exports.getSingleContactUs = catchAsyncError(async (req, res, next) => {
  const id = {
    _id: req.params.id,
  };
  const contact = await Contact.find(id);

  if (!contact) {
    return next(
      new ErrorHandler(
        `Contact From does not exist with id -:${req.params.id}`,
        400
      )
    );
  }

  res.status(200).json({
    success: true,
    contact,
  });
});

// update contact status to checked from pending
exports.updateContactStatus = catchAsyncError(async (req, res, next) => {
  const id = {
    _id: req.params.id,
  };

  const contact = await Contact.findOne(id);

  if (!contact) {
    return next(
      new ErrorHandler(
        `Contact From does not exist with id -:${req.params.id}`,
        400
      )
    );
  }

  contact.status = "Checked";

  await contact.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    contact,
  });
});

//delete contact form
exports.deleteContactUs = catchAsyncError(async (req, res, next) => {
  const id = {
    _id: req.params.id,
  };

  const contact = await Contact.findOne(id);

  if (!contact) {
    return next(
      new ErrorHandler(
        `Contact From does not exist with id -:${req.params.id}`,
        400
      )
    );
  }

  contact.remove();

  res.status(200).json({
    success: true,
    message: "This contact form is deleted.",
  });
});
