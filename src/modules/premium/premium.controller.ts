import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import HttpStatus from "http-status";
import { sendResponse } from "../../utils/sendResponse";
import { premiumServices } from "./premium.services";

const getPremiumContent = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => { 

        const query = req.query
        const result = await premiumServices.getPremiumContent(query)

        sendResponse(res, {
            success: true,
            statusCode: HttpStatus.OK,
            message: "Premium Content retireved successfully",
            data: result.data,
            meta: result.meta
        })
    })

export const premiumController = {
    getPremiumContent
}