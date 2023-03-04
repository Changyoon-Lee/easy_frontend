import { Request, Response, NextFunction } from "express";
export const localsMiddleware = (req: Request, res: Response, next: NextFunction) => {
    res.locals.siteName = "easyFrontEnd";
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.loggedInUser = req.session.user;
    next();
}