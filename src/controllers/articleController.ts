import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import { title } from "process";
import prisma from '../lib/server/prisma'
export const getMainPage = async (req: Request, res: Response) => {
    try {
        const articles = await prisma.article.findMany({
            take: 10,
            include: {
                hashtags: true
            },
            orderBy: {
                updatedAt: "desc"
            }
        })
        res.render("main", { pageTitle: "create Article", articles })
    } catch (e) {
        console.error('main page loading error', e);
        res.render("main", { pageTitle: "create Article", errorMessage: 'main page loading error' })
    }
}
export const getCreateArticlePage = (req: Request, res: Response) => res.render("createArticle")
export const watchArticle = (req: Request, res: Response) => res.render("watch")


interface HashtagObj {
    where: { hashtag: string }
    create: { hashtag: string }
}
export const createArticle = async (req: Request, res: Response) => {
    const userId: number = 0;
    try {
        const { title, description, caption } = req.body;
        let hashtagObjs: HashtagObj[] = [];
        if (caption) {
            const hashtags = caption.match(/#[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\w]+/g);//array형태
            hashtagObjs = hashtags?.map((hashtag: any) => ({// 각 tag마다 where,create구문을 만들어준다
                where: { hashtag },
                create: { hashtag }
            })) || [];
        }
        await prisma.article.create({
            data: {
                title,
                description,
                user: {
                    connect: {
                        id: userId
                    }
                },
                ...(hashtagObjs.length > 0 && {// hashobj가있으면 아래내용 진행
                    hashtags: {
                        connectOrCreate: hashtagObjs
                    }
                })

            }
        })
        res.render("createArticle")
    } catch (e) {
        res.render("createArticle", { errorMessage: e })

    }
}
export const deleteArticle = (req: Request, res: Response) => res.render("edit")
export const getEditArticlePage = (req: Request, res: Response) => res.render("edit")
export const editArticle = (req: Request, res: Response) => res.render("edit")
export const commentArticle = (req: Request, res: Response) => res.send("article page")
export const likeArticle = (req: Request, res: Response) => res.send("article page")