/// <reference path="../lib/server/interface.d.ts" />///

import { Request, Response } from "express";
import prisma from "../lib/server/prisma";
import bcrypt from "bcrypt";
import { URLSearchParams } from "url";
import session from "express-session";
import { execPath } from "process";
import fs from "fs";
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

    return res.redirect("/signin");
};
export const getSignInPage = (req: Request, res: Response) => res.render("signin", { pageTitle: "SIGN IN" });

export const signIn = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
        res.status(404).render("signin", { pageTitle: "Sign In", errorMessage: "wrong email adress" });

    } else {
        const isCorrectPassword = user.password ? await bcrypt.compare(password, user.password) : false;
        if (!isCorrectPassword) {
            return res.status(404).render("signin", { pageTile: "Sign In", errorMessage: "Wrong password" })
        }
        req.session.loggedIn = true;
        req.session.user = user;
    }
    res.redirect("/");
}
export const getEditUserPage = (req: Request, res: Response) => {
    return res.render("editUser", { pageTitle: "user profile" });
};
export const editUser = async (req: Request, res: Response) => {
    const userId = req.session.user?.id;
    const preAvatar = req.session.user?.avatar;
    const file = req.file as Express.Multer.File;
    const path = file?.path;
    if (!path) { return res.redirect("/user/edit") }
    try {
        const updatedUser = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                avatar: path
            }
        })
        req.session.user = updatedUser;
        if (preAvatar) {
            fs.unlink(preAvatar, (err) => {
                if (err) console.log("file deleted error");
                console.log("File deleted");
            })
        }
        return res.redirect("/user/edit")
    } catch (err) {
        return res.redirect("/user/edit")
    }
};
export const deleteUser = (req: Request, res: Response) => res.send("sign up page");
export const signOut = (req: Request, res: Response) => {
    req.session.destroy((err) => {
        return res.redirect("/")
    });
};

export const startGithubLogin = (req: Request, res: Response) => {
    const baseUrl = "https://github.com/login/oauth/authorize"
    const config = {
        client_id: process.env.GITHUB_CLIENT_ID,
        allow_signup: true.toString(),
        scope: "read:user user:email" //
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    // console.log(config, "start_finalUrl: ", finalUrl)
    return res.redirect(finalUrl);
}
export const finishGithubLogin = async (req: Request, res: Response) => {
    const baseUrl = "https://github.com/login/oauth/access_token";
    console.log(req.query.code);
    const config = {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: req.query.code?.toString() || ""
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`

    const tokenRequest = await (await fetch(finalUrl, {
        method: "POST",
        headers: {
            Accept: "application/json"
        }
    })).json();
    if ("access_token" in tokenRequest) {
        const { access_token } = tokenRequest;
        const apiUrl = "https://api.github.com";
        const userData = await (await fetch(`${apiUrl}/user`, {
            headers: {
                Authorization: `token ${access_token}`
            }
        })).json();
        const emailData: any = await (await fetch(`${apiUrl}/user/emails`, {
            headers: {
                Authorization: `token ${access_token}`
            }
        })).json()
        const emailObj = emailData.find((email: any) => email.primary === true && email.verified === true);
        if (!emailObj) {
            return res.redirect("/signin")
        }
        let user = await prisma.user.findFirst({ where: { email: emailObj.email } })
        if (!user) {
            try {
                user = await prisma.user.create({
                    data: {
                        email: emailObj.email, nickname: userData.login, social: true, avatar: userData.avatar_url
                    }
                })//nickname 같으면 문제 될 수 있음
            } catch (error) {
                console.log("usercreate error: ", error);
                return res.redirect("/signin")//
            }
        }
        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect("/");

    } else {
        return res.redirect("/signin")
    }
}