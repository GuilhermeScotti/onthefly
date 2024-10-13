import express from "express";
import TripsUsersController from "../controllers/tripsUsers.js";

const router = express.Router();

router.get("/", TripsUsersController.getTripUsers);
router.get("/trip/:trip_id", TripsUsersController.getUsersForTrip);
router.post("/", TripsUsersController.createTripUser);
router.delete("/:trip_id/:user_id", TripsUsersController.deleteTripUser);

export default router;
