import { Request, Response, NextFunction } from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3"

const s3 = new S3Client({
    region:"ap-northeast-2",
    credentials: {
        accessKeyId: process.env.AWS_ID,
        secretAccessKey: process.env.AWS_SECRET,
    }
})
const multerUploader = multerS3({
    s3: s3,
    bucket: "ezfrontend",
    acl: "public-read"
})

export const localsMiddleware = (req: Request, res: Response, next: NextFunction) => {
    res.locals.siteName = "easyFrontEnd";
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.loggedInUser = req.session.user;
    next();
}

export const protectorMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // 로그인된 유저만 허가하는 기능
    if (req.session.loggedIn) {
        return next();
    } else {
        return res.redirect("/signin");
    }
}
export const publicOnlyMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // 로그인되지 않은 유저만 허가하는 기능
    if (req.session.loggedIn) {
        return res.redirect("/");
    } else {
        return next();
    }
}

export const uploadAvatar = multer({
    //where to store th files, req.files 가 생성됨
    dest: "uploads/avatars/",
    limits: {
        fileSize: 3000000,
    },
    storage: multerUploader,
})
export const uploadVideo = multer({
    //where to store th files, req.files 가 생성됨
    dest: "uploads/videos/",
    limits: {
        fileSize: 50000000,
    },
    storage: multerUploader,
})

export const useffmpeg = (req: Request, res: Response, next: NextFunction) => {
    res.header("Cross-Origin-Embedder-Policy", "require-corp");
    res.header("Cross-Origin-Opener-Policy", "same-origin");
    next();
}
