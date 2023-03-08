import "dotenv/config";
import express, { Express, Request, Response } from "express";
import session from "express-session";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import articleRouter from "./routers/articleRouter";
import apiRouter from "./routers/apiRouter";
import { User } from "@prisma/client";
import prisma from "./lib/server/prisma";
import { localsMiddleware } from "./middlewares";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";

declare module "express-session" {
    interface SessionData {
        user: User | null
        loggedIn: boolean
    }
}
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            COOKIE_SECRET: string,
            GITHUB_CLIENT_ID: string,
            GITHUB_CLIENT_SECRET: string,
        }
    }
}
const app: Express = express();
const PORT = 3000;
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views"); //-> 기본값이지만 명시적으로 작성해주었음.
const loggerMiddleware = morgan("dev");
app.use(loggerMiddleware);
app.use(express.urlencoded({ extended: true }))
app.use(
    session({
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000 // ms
        },
        secret: process.env.COOKIE_SECRET,
        resave: true,
        saveUninitialized: false,
        store: new PrismaSessionStore(
            prisma,
            {
                checkPeriod: 2 * 60 * 1000,  //ms
                dbRecordIdIsSessionId: true,
                dbRecordIdFunction: undefined,
            }
        )
    })
);

app.use(localsMiddleware)

//routing
app.use("/", globalRouter)
app.use("/user", userRouter)
app.use("/article", articleRouter)
app.use("/api", apiRouter)
app.use("/uploads", express.static("uploads"))
app.use("/assets", express.static("assets"))
app.listen(PORT, () => {
    console.log(`[server]: Server is running at <https://localhost>:${PORT}`);
});