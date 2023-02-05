import express from "express";
import { getMainPage } from "../controllers/postingController";
import { getSignInPage, signIn, getSignUpPage, signUp } from "../controllers/userController";
const globalRouter = express.Router();

globalRouter.get("/", getMainPage)
globalRouter.route("/signin").get(getSignInPage).post(signIn);
globalRouter.route("/signup").get(getSignUpPage).post(signUp);


export default globalRouter;