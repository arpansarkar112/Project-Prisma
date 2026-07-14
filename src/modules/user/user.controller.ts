import { NextFunction, Request, Response } from "express"
import HttpStatus from "http-status"
import { userService } from "./user.service"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"

// const registerUser = async (req: Request, res: Response) => {
//     try {

//     const payload = req.body

//     const user = await userService.registerUserintoDB(payload)

//     res.status(HttpStatus.CREATED).json({
//         success: true,
//         statusCode : HttpStatus.CREATED,
//         message: "User registered successfully",
//         data: {
//             user
//         }
//     })
//     } catch (error) {
//         console.log(error)

//         res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
//             success: false,
//             statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
//             message: "Failed to register user",
//             error: (error as Error).message
//         })
//     }
// }

const registerUser =
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const payload = req.body
        const user = await userService.registerUserintoDB(payload)

        // res.status(HttpStatus.CREATED).json({
        //     success: true,
        //     statusCode: HttpStatus.CREATED,
        //     message: "User registered successfully",
        //     data: {
        //         user
        //     }
        // })

        sendResponse(res, {
            success: true,
            statusCode: HttpStatus.CREATED,
            message: "User registered successfully",
            data: {user}
        })
    })
    
const getMyProfile =
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        //const { accessToken } = req.cookies
        
        // const verifiedToken = jwtUtils.verifyToken(accessToken, config.jwt_access_secret)

        // if (typeof verifiedToken === "string") throw new Error(verifiedToken)

        const profile = await userService.getMyProfileFromDB(req.user?.id as string)

        sendResponse(res, {
            success: true,
            statusCode: HttpStatus.OK,
            message: "User profile fetched successfully",
            data: { profile }
        })
    })

const updateMyProfile =
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {

        const userId = req.user?.id as string

        const payload = req.body
        const updatedProfile = await userService.updateMyProfileFromDB(userId, payload)

        sendResponse(res, {
            success: true,
            statusCode: HttpStatus.OK,
            message: "User profile updated successfully",
            data: { updatedProfile }
        })
    })
export const userController = {
    registerUser,
    getMyProfile,
    updateMyProfile
}