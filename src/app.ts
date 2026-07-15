import cookieParser from "cookie-parser";
import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors"
import config from "./config";
import { userRoutes } from "./modules/user/user.route";
import { authRoutes } from "./modules/auth/auth.route";
import { postRoutes } from "./modules/post/post.route";
import { commentRoutes } from "./modules/comment/comment.route";
import { notFound } from "./middlewares/notfound";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";


const app: Application = express()

app.use(cors({
    origin: config.app_url,
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get('/', async (req: Request, res: Response) => {
    // const user = await prisma.user.findMany()
    // console.log(user)
    res.send('Hello World!')
})

app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/comments", commentRoutes)

app.use(notFound)

app.use(globalErrorHandler)

export default app