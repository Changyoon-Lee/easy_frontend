import { Request, Response } from "express";
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
export const watchArticle = async (req: Request, res: Response) => {
    const userId = req.session.user?.id
    const articleId = req.params.id

    try {
        const article = await prisma.article.findUnique({
            where: { id: parseInt(articleId) },
            include: {
                comments: {
                    include: {
                        user: true
                    }
                },
                user: true,
                hashtags: true,
            }
        })

        if (!article) {
            return res.redirect("/")
        }
        return res.render("watchArticle", { article })
    } catch (e) {
        return res.redirect("/")
    }
}

interface HashtagObj {
    where: { hashtag: string }
    create: { hashtag: string }
}
export const createArticle = async (req: Request, res: Response) => {
    //userId 없으면 에러남->에러처리
    const userId = req.session.user?.id;
    const file = req.file as Express.Multer.File;
    const video = file?.path;
    const { title, description, hashtags: caption } = req.body;
    try {
        let hashtagObjs: HashtagObj[] = [];
        if (caption) {
            const hashtags = caption.match(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\w|\d]+/g);//array형태
            hashtagObjs = hashtags?.map((hashtag: any) => ({// 각 tag마다 where,create구문을 만들어준다
                where: { hashtag },
                create: { hashtag }
            })) || [];
        }
        const newArticle = await prisma.article.create({
            data: {
                title,
                video,
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
        res.redirect(`/article/${newArticle.id}`)
    } catch (e) {
        console.log(e);
        res.render("createArticle", { errorMessage: e })

    }
}
export const deleteArticle = (req: Request, res: Response) => res.render("edit")
export const getEditArticlePage = (req: Request, res: Response) => res.render("edit")
export const editArticle = (req: Request, res: Response) => res.render("edit")
export const addComment = async (req: Request, res: Response) => {
    const userId = req.session.user?.id
    const articleId = parseInt(req.params.id)
    const comments = req.body.text;
    console.log(userId, articleId, comments)
    if (userId) {
        try {
            await prisma.comment.create({
                data: {
                    userId,
                    articleId,
                    comments
                }
            })
        } catch (e) {
            console.log(e)
            res.sendStatus(404)
        }
    }
    return res.sendStatus(200)

}
export const likeArticle = (req: Request, res: Response) => res.send("article page")
export const viewCount = async (req: Request, res: Response) => {
    const articleId = req.params.id;
    try {
        await prisma.article.update({
            where: { id: parseInt(articleId) },
            data: { views: { increment: 1 } }
        })
        return res.sendStatus(200)
    } catch {
        return res.sendStatus(404)
    }
}