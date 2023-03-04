import { Request, Response, NextFunction } from "express";
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