const Booking = require("../models/booking");
const Home = require("../models/home");


// ======================================================
// GET BOOKING PAGE
// ======================================================

exports.getBooking = async (req, res, next) => {
  try {
    const homeId = req.params.homeId;

    const home = await Home.findById(homeId);

    if (!home) {
      return res.status(404).send("Home not found.");
    }

    // Host cannot book their own property
    if (
      home.host.toString() ===
      req.session.user.id.toString()
    ) {
      return res.status(403).send(
        "You cannot book your own home."
      );
    }

    res.render("store/booking", {
      home: home,

      pageTitle: "Book Home",

      currPage: "bookings",

      isLoggedIn: req.session.isLoggedIn,

      user: req.session.user || {},
    });

  } catch (error) {
    next(error);
  }
};


// ======================================================
// POST BOOKING
// ======================================================

exports.postBooking = async (req, res, next) => {
  try {

    const homeId = req.params.homeId;

    const {
      checkIn,
      checkOut,
      guests
    } = req.body;


    // --------------------------------------------------
    // FIND HOME
    // --------------------------------------------------

    const home = await Home.findById(homeId);

    if (!home) {
      return res.status(404).send(
        "Home not found."
      );
    }


    // --------------------------------------------------
    // PREVENT HOST FROM BOOKING OWN HOME
    // --------------------------------------------------

    if (
      home.host.toString() ===
      req.session.user.id.toString()
    ) {
      return res.status(403).send(
        "You cannot book your own home."
      );
    }


    // --------------------------------------------------
    // VALIDATE DATES
    // --------------------------------------------------

    const startDate = new Date(checkIn);

    const endDate = new Date(checkOut);


    if (
      !checkIn ||
      !checkOut ||
      isNaN(startDate.getTime()) ||
      isNaN(endDate.getTime())
    ) {
      return res.status(400).send(
        "Please enter valid check-in and check-out dates."
      );
    }


    // Check-out must be after check-in

    if (endDate <= startDate) {
      return res.status(400).send(
        "Check-out date must be after check-in date."
      );
    }


    // --------------------------------------------------
    // PREVENT PAST BOOKINGS
    // --------------------------------------------------

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    startDate.setHours(0, 0, 0, 0);

    endDate.setHours(0, 0, 0, 0);


    if (startDate < today) {
      return res.status(400).send(
        "Check-in date cannot be in the past."
      );
    }


    // --------------------------------------------------
    // GUEST VALIDATION
    // --------------------------------------------------

    const numberOfGuests = Number(guests);


    if (
      !Number.isInteger(numberOfGuests) ||
      numberOfGuests < 1
    ) {
      return res.status(400).send(
        "Invalid number of guests."
      );
    }


    // --------------------------------------------------
    // MAXIMUM GUEST CHECK
    // --------------------------------------------------

    const maxGuests = Number(
      home.maxGuests || 1
    );


    if (numberOfGuests > maxGuests) {
      return res.status(400).send(
        `This property allows a maximum of ${maxGuests} guests.`
      );
    }


    // --------------------------------------------------
    // PRICE VALUES
    // --------------------------------------------------

    const basePrice = Number(
      home.price || 0
    );

    const extraGuestFee = Number(
      home.extraGuestFee || 0
    );


    // --------------------------------------------------
    // CALCULATE NUMBER OF NIGHTS
    // --------------------------------------------------

    const millisecondsPerDay =
      1000 * 60 * 60 * 24;


    const nights = Math.ceil(
      (endDate - startDate) /
      millisecondsPerDay
    );


    if (nights <= 0) {
      return res.status(400).send(
        "Invalid number of nights."
      );
    }


    // --------------------------------------------------
    // CALCULATE BASE PRICE
    // --------------------------------------------------

    /*
      Example:

      Price per night = ₹1000
      Nights = 3

      Base amount = ₹1000 × 3
                  = ₹3000
    */

    const baseAmount =
      basePrice * nights;


    // --------------------------------------------------
    // CALCULATE EXTRA GUESTS
    // --------------------------------------------------

    /*
      First guest is included in base price.

      Example:

      Guests = 1
      Extra guests = 0

      Guests = 2
      Extra guests = 1

      Guests = 3
      Extra guests = 2

      Guests = 4
      Extra guests = 3
    */

    const extraGuests =
      Math.max(0, numberOfGuests - 1);


    // --------------------------------------------------
    // CALCULATE EXTRA GUEST CHARGES
    // --------------------------------------------------

    /*
      Example:

      Extra guest fee = ₹200/night
      Extra guests = 2
      Nights = 3

      ₹200 × 2 × 3
      = ₹1200
    */

    const extraGuestAmount =
      extraGuests *
      extraGuestFee *
      nights;


    // --------------------------------------------------
    // FINAL TOTAL
    // --------------------------------------------------

    const totalPrice =
      baseAmount +
      extraGuestAmount;


    // --------------------------------------------------
    // CHECK FOR BOOKING CONFLICT
    // --------------------------------------------------

    /*
      Booking A:
      10 Oct → 15 Oct

      Booking B:
      12 Oct → 18 Oct

      These overlap.

      Therefore Booking B should be rejected.
    */

    const conflictingBooking =
      await Booking.findOne({
        home: homeId,

        status: "confirmed",

        checkIn: {
          $lt: endDate
        },

        checkOut: {
          $gt: startDate
        }
      });


    if (conflictingBooking) {
      return res.status(400).send(
        "This home is already booked for the selected dates."
      );
    }


    // --------------------------------------------------
    // CREATE BOOKING
    // --------------------------------------------------

    const booking = new Booking({

      home: homeId,

      user: req.session.user.id,

      checkIn: startDate,

      checkOut: endDate,

      guests: numberOfGuests,

      nights: nights,

      basePrice: basePrice,

      extraGuestFee: extraGuestFee,

      extraGuests: extraGuests,

      baseAmount: baseAmount,

      extraGuestAmount: extraGuestAmount,

      totalPrice: totalPrice,

      status: "confirmed"

    });


    // --------------------------------------------------
    // SAVE BOOKING
    // --------------------------------------------------

    await booking.save();


    // --------------------------------------------------
    // REDIRECT TO BOOKINGS
    // --------------------------------------------------

    res.redirect("/bookings");

  } catch (error) {

    next(error);

  }
};


// ======================================================
// GET MY BOOKINGS
// ======================================================

exports.getBookings = async (req, res, next) => {

  try {

    const bookings = await Booking.find({

      user: req.session.user.id

    })

      .populate("home")

      .sort({
        createdAt: -1
      });


    res.render("store/bookings", {

      bookings: bookings,

      pageTitle: "My Bookings",

      currPage: "bookings",

      isLoggedIn: req.session.isLoggedIn,

      user: req.session.user || {}

    });

  } catch (error) {

    next(error);

  }

};


// ======================================================
// CANCEL BOOKING
// ======================================================

exports.postCancelBooking = async (
  req,
  res,
  next
) => {

  try {

    const bookingId =
      req.params.bookingId;


    // Find only the booking belonging
    // to the currently logged-in user

    const booking =
      await Booking.findOne({

        _id: bookingId,

        user: req.session.user.id,

        status: "confirmed"

      });


    if (!booking) {

      return res.status(404).send(
        "Booking not found."
      );

    }


    // Change status

    booking.status = "cancelled";


    await booking.save();


    // Go back to bookings

    res.redirect("/bookings");

  } catch (error) {

    next(error);

  }

};