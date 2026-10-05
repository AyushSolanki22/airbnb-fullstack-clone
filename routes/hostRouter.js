const express = require("express");
const hostRouter = express.Router();

const upload = require("../middleware/fileUpload");
const requireLogin = require("../middleware/auth");
const hostController = require("../controllers/hostController");

// Display add-home page
hostRouter.get(
  "/add-home",
  requireLogin,
  hostController.getAddHome
);

// Add home with image
hostRouter.post(
  "/add-home",
  requireLogin,
  upload.fields([
    {
      name: "photo",
      maxCount: 1
    },
    {
      name: "houseRules",
      maxCount: 1
    }
  ]),
  hostController.postAddHome
);

// Display host homes
hostRouter.get(
  "/host-homes",
  requireLogin,
  hostController.getHostHomes
);

// Display edit page
hostRouter.get(
  "/edit-home/:homeId",
  requireLogin,
  hostController.getEditHome
);

// Update home with optional new image
hostRouter.post(
  "/edit-home/:homeId",
  requireLogin,
  upload.fields([
    {
      name: "photo",
      maxCount: 1
    },
    {
      name: "houseRules",
      maxCount: 1
    }
  ]),
  hostController.postEditHome
);

// Delete home
hostRouter.post(
  "/delete-home/:homeId",
  requireLogin,
  hostController.postDeleteHome
);

exports.hostRouter = hostRouter;