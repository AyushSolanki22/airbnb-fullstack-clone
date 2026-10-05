const express = require("express");
const storeRouter = express.Router();

const storeController = require("../controllers/storeController");

storeRouter.get("/", storeController.getIndex);
storeRouter.get("/homes", storeController.getHomes);
storeRouter.get("/favourites", storeController.getFavourites);

storeRouter.get("/homes/:homeId", storeController.getHomeDetails);
storeRouter.post("/favourites", storeController.postAddToFavourite);

storeRouter.post("/delete-favourite/:homeId", storeController.postDeleteFavourite)

module.exports = storeRouter;
