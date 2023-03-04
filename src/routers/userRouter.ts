import express from "express";
import { editUser, deleteUser, signOut, getEditUserPage, startGithubLogin, finishGithubLogin } from "../controllers/userController"
const userRouter = express.Router();

userRouter.route("/edit").get(getEditUserPage).post(editUser);
userRouter.get("/delete", deleteUser)
userRouter.get("/signout", signOut);
userRouter.get("/github/start", startGithubLogin);
userRouter.route("/github/finish").get(finishGithubLogin).post(finishGithubLogin);

export default userRouter;