import { NextFunction, Request, Response } from "express"
import HttpStatus from "http-status"
import { Prisma } from "../../generated/prisma/client"

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.log("Error: ", err)

    let statusCode
    let errorMessage = err.message
    let errorName = err.name || "Internal Server Error"
    let errorStack = err.stack

    if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = HttpStatus.BAD_REQUEST
        errorMessage = "You have provided incorrect field type or missing fields"
    } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            statusCode = HttpStatus.BAD_REQUEST,
                errorMessage = "Duplicate Key Error"
        } else if (err.code === "P2003") {
            statusCode = HttpStatus.BAD_REQUEST,
                errorMessage = "Foreign Key Constraint failed"
        } else if (err.code === "P2025") {
            statusCode = HttpStatus.BAD_REQUEST,
                errorMessage = "An operation failed because it depands on one or more records that were required but not found"
        }
    } else if (err instanceof Prisma.PrismaClientInitializationError) {
        if (err.errorCode === "P1000") {
            statusCode = HttpStatus.UNAUTHORIZED,
                errorMessage = "Authentication failed against database server. Please check your credentials"
        } else if (err.errorCode === "P1001") {
            statusCode = HttpStatus.UNAUTHORIZED,
                errorMessage = "Can not reach database server. Please check your credentials"
        }
    } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        statusCode = HttpStatus.INTERNAL_SERVER_ERROR
        errorMessage = "Error occured during execution"
    }

    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        statusCode: statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        errorCode: err.code || null,
        name: errorName,
        message: errorMessage,
        error: errorStack
    })
}