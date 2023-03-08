import express from "express";
import { editUser, deleteUser, signOut, getEditUserPage, startGithubLogin, finishGithubLogin } from "../controllers/userController"
import { protectorMiddleware, publicOnlyMiddleware, uploadAvatar } from "../middlewares";
const userRouter = express.Router();

userRouter.route("/edit").all(protectorMiddleware).get(getEditUserPage).post(uploadAvatar.single('avatar'), editUser);
userRouter.get("/delete", protectorMiddleware, deleteUser)
userRouter.get("/signout", protectorMiddleware, signOut);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);

export default userRouter;