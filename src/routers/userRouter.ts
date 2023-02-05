import express from "express";
import { editUser, deleteUser, signOut, getEditUserPage } from "../controllers/userController"
const userRouter = express.Router();

userRouter.route("/edit").get(getEditUserPage).post(editUser);
userRouter.get("/delete", deleteUser)
userRouter.get("/signout", signOut);
export default userRouter;