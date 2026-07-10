import { Router } from "express";
import { userController } from "./user.controller";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";

const router = Router()

router.post("/register", userController.registerUser)

router.get("/me",
    // (req: Request, res: Response, next: NextFunction) => {

    // const { accessToken } = req.cookies

    // const verifiedToken = jwtUtils.verifyToken(accessToken, config.jwt_access_secret)
    
    // if (!verifiedToken.success) {
    //     throw new Error(verifiedToken.error)
    // }
    
    // const {email, name, id, role} = verifiedToken.data as JwtPayload

    // const requiredRoles = [Role.ADMIN, Role.USER, Role.AUTHOR]

    // if (!requiredRoles.includes(role)) {
    //     return res.status(403).json({
    //         success: false,
    //         statusCode: HttpStatus.FORBIDDEN,
    //         message: "Forbidden, You do not have permission to access this resource"
    //     })
    // }

    // req.user = {
    //     email,
    //     name,
    //     id,
    //     role
    // }
    // next()
    // },

    auth(Role.ADMIN, Role.USER, Role.AUTHOR),
    userController.getMyProfile)

router.put("/my-profile",
    auth(Role.ADMIN, Role.USER, Role.AUTHOR),
    userController.updateMyProfile)


export const userRoutes = router