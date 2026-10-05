const Home = require("../models/home");
const { deleteFile } = require("../utils/file");


// --------------------------------------------------
// Find home only if it belongs to the logged-in host
// --------------------------------------------------

const getOwnedHome = async (homeId, userId) => {
  return Home.findOne({
    _id: homeId,
    host: userId
  });
}


// --------------------------------------------------
// GET ADD HOME
// --------------------------------------------------

exports.getAddHome = (req, res, next) => {
  res.render("host/edit-home", {
    pageTitle: "Add Home",
    currPage: "addHome",
    editing: false,
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user || {}
  });
};


// --------------------------------------------------
// GET EDIT HOME
// --------------------------------------------------

exports.getEditHome = async (req, res, next) => {
  try {

    const homeId = req.params.homeId;

    const home = await getOwnedHome(
      homeId,
      req.session.user.id
    );

    if (!home) {
      return res.status(404).send(
        "Home not found or you are not authorized."
      );
    }

    res.render("host/edit-home", {
      home,
      editing: true
    });

  } catch (error) {
    next(error);
  }
};


// --------------------------------------------------
// POST ADD HOME
// --------------------------------------------------

exports.postAddHome = async (req, res, next) => {

  const uploadedFiles = [];

  try {

    const {
  houseName,
  housePrice,
  maxGuests,
  extraGuestFee,
  houseLocation,
  houseRating,
  description
} = req.body || {};


    const photoFile = req.files?.photo?.[0];

    console.log("PHOTO FILE:");
    console.log(photoFile); 

    const rulesFile = req.files?.houseRules?.[0];


    // Keep track of uploaded files
    if (photoFile) {
      uploadedFiles.push(photoFile.filename);
    }

    if (rulesFile) {
      uploadedFiles.push(rulesFile.filename);
    }


    // Photo is compulsory
    if (!photoFile) {

      return res.status(400).send(
        "Please upload a home photo."
      );

    }


    const home = new Home({
  name: houseName,
  price: housePrice,

  maxGuests: Number(maxGuests),

  extraGuestFee: Number(extraGuestFee),

  location: houseLocation,
  rating: houseRating,

  photo: photoFile.filename,

  houseRules: rulesFile
    ? rulesFile.filename
    : null,

  description: description || "",

  host: req.session.user.id
});


    await home.save();


    res.redirect("/host/host-homes");

  } catch (error) {

    // If DB save fails,
    // remove files that were already uploaded

    for (const filename of uploadedFiles) {
      await deleteFile(filename);
    }

    next(error);
  }
};


// --------------------------------------------------
// GET HOST HOMES
// --------------------------------------------------

exports.getHostHomes = async (req, res, next) => {
  try {
    const registeredHomes = await Home.find({
      host: req.session.user.id
    });

    res.render("host/host-home-list", {
      registeredHomes,
      pageTitle: "Host Homes",
      currPage: "hostHomes",
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user || {}
    });
  } catch (error) {
    next(error);
  }
};


// --------------------------------------------------
// POST EDIT HOME
// --------------------------------------------------

exports.postEditHome = async (req, res, next) => {

  const newlyUploadedFiles = [];

  try {

    const homeId = req.params.homeId;


    const {
  houseName,
  housePrice,
  maxGuests,
  extraGuestFee,
  houseLocation,
  houseRating,
  description
} = req.body || {};


    // Find home AND make sure it belongs
    // to the currently logged-in host

    const existingHome = await getOwnedHome(
      homeId,
      req.session.user.id
    );


    if (!existingHome) {

      return res.status(404).send(
        "Home not found or you are not authorized."
      );

    }


    const photoFile = req.files?.photo?.[0];

    const rulesFile = req.files?.houseRules?.[0];


    // Keep track of new files
    // in case database update fails

    if (photoFile) {
      newlyUploadedFiles.push(photoFile.filename);
    }

    if (rulesFile) {
      newlyUploadedFiles.push(rulesFile.filename);
    }


    // Save old filenames

    const oldPhoto = existingHome.photo;

    const oldHouseRules = existingHome.houseRules;


    // Update text fields

    existingHome.name = houseName;

    existingHome.price = housePrice;

    existingHome.maxGuests =
  Number(maxGuests);

existingHome.extraGuestFee =
  Number(extraGuestFee);

    existingHome.location = houseLocation;

    existingHome.rating = houseRating;

    existingHome.description = description || "";


    // Replace photo only if
    // a new photo was uploaded

    if (photoFile) {
      existingHome.photo = photoFile.filename;
    }


    // Replace rules only if
    // a new PDF was uploaded

    if (rulesFile) {
      existingHome.houseRules = rulesFile.filename;
    }


    // Save DB first

    await existingHome.save();


    // Now delete old photo

    if (
      photoFile &&
      oldPhoto &&
      oldPhoto !== existingHome.photo
    ) {

      await deleteFile(oldPhoto);

    }


    // Now delete old rules

    if (
      rulesFile &&
      oldHouseRules &&
      oldHouseRules !== existingHome.houseRules
    ) {

      await deleteFile(oldHouseRules);

    }


    res.redirect("/host/host-homes");


  } catch (error) {

    // DB failed.
    // Delete newly uploaded files.

    for (const filename of newlyUploadedFiles) {
      await deleteFile(filename);
    }

    next(error);

  }

};


// --------------------------------------------------
// DELETE HOME
// --------------------------------------------------

exports.postDeleteHome = async (req, res, next) => {

  try {

    const homeId = req.params.homeId;


    // Find home belonging to current host

    const home = await getOwnedHome(
      homeId,
      req.session.user.id
    );


    if (!home) {

      return res.status(404).send(
        "Home not found or you are not authorized."
      );

    }


    // Save filenames before deleting DB document

    const photo = home.photo;

    const houseRules = home.houseRules;


    // Delete database document

    await Home.findByIdAndDelete(homeId);


    // Delete image

    if (photo) {
      await deleteFile(photo);
    }


    // Delete rules PDF

    if (houseRules) {
      await deleteFile(houseRules);
    }


    res.redirect("/host/host-homes");


  } catch (error) {

    next(error);

  }

};