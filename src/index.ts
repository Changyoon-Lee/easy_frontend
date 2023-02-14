import express, { Express, Request, Response } from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import articleRouter from "./routers/articleRouter";

const app: Express = express();
const PORT = 3000;
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views"); //-> 기본값이지만 명시적으로 작성해주었음.
const loggerMiddleware = morgan("dev");
app.use(loggerMiddleware);

//routing
app.use("/", globalRouter)
app.use("/user", userRouter)
app.use("/article", articleRouter)
app.use("/static", express.static("src/public"))
app.listen(PORT, () => {
    console.log(`[server]: Server is running at <https://localhost>:${PORT}`);
});