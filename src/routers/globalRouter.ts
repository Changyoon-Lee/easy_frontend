import express from "express";
import { getMainPage, searchArticle, searchFamous } from "../controllers/articleController";
import { getSignInPage, signIn, getSignUpPage, signUp } from "../controllers/userController";
const globalRouter = express.Router();

globalRouter.get("/", getMainPage);
globalRouter.get("/search", searchArticle);
globalRouter.get("/famous", searchFamous);
globalRouter.route("/signin").get(getSignInPage).post(signIn);
globalRouter.route("/signup").get(getSignUpPage).post(signUp);


export default globalRouter;