import express from "express";
import { viewCount } from "../controllers/articleController";
const apiRouter = express.Router();

apiRouter.get("/article/:id/view", viewCount)



export default apiRouter;