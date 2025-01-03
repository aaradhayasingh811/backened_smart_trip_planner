import Router from "express"
import { loginController,logoutController,signupController } from "../controllers/user.controller.js";
import {verifyJWT} from "../middlewares/auth-middleware.js"
import { createTripController, showTripController , showSingleTripController, deleteSingleTripController} from "../controllers/trip.controller.js";
const router = Router();

router.route('/sign-up').post(signupController);
router.route('/sign-in').post(loginController);
router.route('/create-trip/:email').post(createTripController);
router.route('/logout/:email').post(logoutController);
router.route('/show-trips/:email').get(showTripController);
router.route('/show-trips/:email/:id').get(showSingleTripController);
router.route('/delete-trips/:email/:id').delete(deleteSingleTripController);



export {router};