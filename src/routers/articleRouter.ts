import express from "express";
import { createArticle, deleteArticle, editArticle, getCreateArticlePage, getEditArticlePage, watchArticle } from "../controllers/articleController"
import { uploadVideo, useffmpeg, protectorMiddleware } from "../middlewares";
const articleRouter = express.Router();

articleRouter.route("/create").all(protectorMiddleware, useffmpeg).get(getCreateArticlePage).post(uploadVideo.single('video'), createArticle);
articleRouter.post("/delete", protectorMiddleware, deleteArticle);
articleRouter.get("/:id", watchArticle);
articleRouter.route("/:id/edit").get(getEditArticlePage).post(editArticle);



export default articleRouter;