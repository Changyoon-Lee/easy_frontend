import express from "express";
import { commentArticle, createArticle, deleteArticle, editArticle, getCreateArticlePage, getEditArticlePage, watchArticle } from "../controllers/articleController"
import { uploadVideo } from "../middlewares";
const articleRouter = express.Router();

articleRouter.route("/create").get(getCreateArticlePage).post(uploadVideo.single('video'), createArticle);
articleRouter.get("/delete", deleteArticle);
articleRouter.get("/comments", commentArticle);
articleRouter.get("/:id", watchArticle);
articleRouter.route("/:id/edit").get(getEditArticlePage).post(editArticle);



export default articleRouter;