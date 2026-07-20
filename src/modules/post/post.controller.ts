import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import HttpStatus from "http-status"
import { postService } from "./post.service"


const createPost =
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const id = req.user?.id

        const payload = req.body

        const result = await postService.createPostIntoDB(payload, id as string)

        sendResponse(res, {
            success: true,
            statusCode: HttpStatus.CREATED,
            message: "Post created successfully",
            data: { result }
        })
    })

const getAllPosts =
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const query = req.query
        const result = await postService.getAllPostsFromDB(query)

        sendResponse(res, {
            success: true,
            statusCode: HttpStatus.OK,
            message: "Post retrieved successfully",
            data: result.data,
            meta: result.meta
        })
    })

const getPostStats =
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const result = await postService.getPostStatsFromDB()

        sendResponse(res, {
            success: true,
            statusCode: HttpStatus.OK,
            message: "Post stats retrieved successfully",
            data: result 
        })
    })

const getMyPosts =
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const authorId = req.user?.id

        const result = await postService.getMyPostsFromDB(authorId as string)

        sendResponse(res, {
            success: true,
            statusCode: HttpStatus.OK,
            message: "My Post retrieved successfully",
            data: result 
        })
    })

const getPostById =
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const postId = req.params.postId

        if (!postId) throw new Error("Post Id is Required in Params")
        
        const result = await postService.getPostByIdFromDB(postId as string)

        sendResponse(res, {
            success: true,
            statusCode: HttpStatus.OK,
            message: "Post retrieved successfully",
            data: result 
        })
    })

const updatePost =
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const authorId = req.user?.id
        const isAdmin = req.user?.role === "ADMIN"

        const postId = req.params.postId
        const payload = req.body

        if (!postId) throw new Error("Post Id is Required in Params")
        
        const result = await postService.updatePostIntoDB(postId as string, payload, authorId as string, isAdmin)

        sendResponse(res, {
            success: true,
            statusCode: HttpStatus.OK,
            message: "Post updated successfully",
            data: result 
        })
    })


const deletePost =
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const authorId = req.user?.id
        const isAdmin = req.user?.role === "ADMIN"

        const postId = req.params.postId

        if (!postId) throw new Error("Post Id is Required in Params")
        
        await postService.deletePostFromDB(postId as string, authorId as string, isAdmin)

        sendResponse(res, {
            success: true,
            statusCode: HttpStatus.OK,
            message: "Post deleted successfully",
            data: null 
        })
    })

export const postController = {
    createPost,
    getAllPosts,
    getPostStats,
    getMyPosts,
    getPostById,
    updatePost,
    deletePost
}