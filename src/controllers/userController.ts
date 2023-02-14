import { Request, Response } from "express";

export const getSignUpPage = (req: Request, res: Response) => res.render("signup", { pageTitle: "SIGN UP" });
export const signUp = (req: Request, res: Response) => res.send("sign up page");
export const getSignInPage = (req: Request, res: Response) => res.render("signin", { pageTitle: "SIGN IN" });
export const signIn = (req: Request, res: Response) => res.send("sign up page");
export const getEditUserPage = (req: Request, res: Response) => res.send("sign up page");
export const editUser = (req: Request, res: Response) => res.send("sign up page");
export const deleteUser = (req: Request, res: Response) => res.send("sign up page");
export const signOut = (req: Request, res: Response) => res.send("sign up page");