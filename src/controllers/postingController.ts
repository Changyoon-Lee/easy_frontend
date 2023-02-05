import { Request, Response } from "express";

export const getMainPage = (req: Request, res: Response) => res.send("posting page")
export const getCreatePostingPage = (req: Request, res: Response) => res.send("posting page")
export const CreatePosting = (req: Request, res: Response) => res.send("posting page")
export const deletePosting = (req: Request, res: Response) => res.send("posting page")
export const getEditPostingPage = (req: Request, res: Response) => res.send("posting page")
export const editPosting = (req: Request, res: Response) => res.send("posting page")
export const commentPosting = (req: Request, res: Response) => res.send("posting page")
export const likePosting = (req: Request, res: Response) => res.send("posting page")