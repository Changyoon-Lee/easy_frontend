/// <reference path="../lib/server/interface.d.ts" />///

import { Request, Response } from "express";
import prisma from "../lib/server/prisma";
import bcrypt from "bcrypt";
export const getSignUpPage = (req: Request, res: Response) => res.render("signup", { pageTitle: "SIGN UP" });


export const signUp = async (req: Request, res: Response) => {
    const pageTitle = "Sign Up";
    const {
        email,
        password,
        password2,
        nickname,
    } = req.body;
    if (password !== password2) {
        return res.status(404).render("/singup", { pageTitle, errorMessage: "password not same" })
    }
    const user = await prisma.user.findFirst({
        where:
        {
            OR: [{ email }, { nickname }]
        },
        select: {
            nickname: true,
            email: true
        }
    })
    if (user) {
        const emailError = user.email == email ? "email" : "";
        const nicknameError = user.nickname == nickname ? "nickname" : "";

        return res.status(404).render("signup", { pageTitle, errorMessage: `${emailError} ${nicknameError} is already used` })

    }
    await prisma.user.create({
        data: {
            email, password, nickname
        }
    })

    return res.render("/signin", { pageTitle: "Sign In", okMessage: "Your Account Successfully created!" });
};
export const getSignInPage = (req: Request, res: Response) => res.render("signin", { pageTitle: "SIGN IN" });
export const signIn = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
        res.status(404).render("signin", { pageTitle: "Sign In", errorMessage: "wrong email adress" });

    } else {
        const isCorrectPassword = await bcrypt.compare(password, user.password);
        if (!isCorrectPassword) {
            return res.status(404).render("signin", { pageTile: "Sign In", errorMessage: "Wrong password" })
        }
    }
    req.session.loggedIn = true;
    req.session.user = user;
    res.redirect("/");
}
export const getEditUserPage = (req: Request, res: Response) => res.send("sign up page");
export const editUser = (req: Request, res: Response) => res.send("sign up page");
export const deleteUser = (req: Request, res: Response) => res.send("sign up page");
export const signOut = (req: Request, res: Response) => res.send("sign up page");