import express from "express";
import { commentPosting, createPosting, deletePosting, editPosting, getCreatePostingPage, getEditPostingPage, viewPosting } from "../controllers/postingController"
const postingRouter = express.Router();

postingRouter.get("/:id", viewPosting);
postingRouter.route("/create").get(getCreatePostingPage).post(createPosting);
postingRouter.route("/:id/edit").get(getEditPostingPage).post(editPosting);
postingRouter.get("/delete", deletePosting);
postingRouter.get("/comments", commentPosting);



export default postingRouter;