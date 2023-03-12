import express from "express";
import { viewCount, addComment } from "../controllers/articleController";
const apiRouter = express.Router();

apiRouter.get("/article/:id/view", viewCount)
apiRouter.post("/article/:id/comment", addComment)



export default apiRouter;