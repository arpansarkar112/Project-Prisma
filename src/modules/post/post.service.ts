import { CommentStatus, PostStatus } from "../../../generated/prisma/enums"
import { prisma } from "../../lib/prisma"
import { ICreatePostPayload, IUpdatePostPayload } from "./post.interface"

const createPostIntoDB = async (payload: ICreatePostPayload,
    userId: string) => {
    const result = await prisma.post.create({
        data: {
            ...payload,
            authorId: userId
        }
    })
    return result
}

const getAllPostsFromDB = async () => {
    const post = await prisma.post.findMany(
        {
            include: {
                author: {
                    omit: {
                        password: true
                    }
                },
                comments: true
            }
        }
    )
    return post
}

const getPostStatsFromDB = async () => {
    const transactionResult = await prisma.$transaction(
        async (tx) => {
            // const totalPost = await tx.post.count()

            // const totalPublishedPost = await tx.post.count({
            //     where: {
            //         status: PostStatus.PUBLISHED
            //     }
            // })
            // const totalDraftPost = await tx.post.count({
            //     where: {
            //         status: PostStatus.DRAFT
            //     }
            // })
            // const totalArchivedPost = await tx.post.count({
            //     where: {
            //         status: PostStatus.ARCHIVE
            //     }
            // })

            // const totalComments = await tx.comment.count()

            // const totalApprovedComments = await tx.comment.count({
            //     where: {
            //         status: CommentStatus.APPROVED
            //     }
            // })

            // const totalRejectedComments = await tx.comment.count({
            //     where: {
            //         status: CommentStatus.REJECT
            //     }
            // })

            // //bad approach
            // // const allPosts = await tx.post.findMany()

            // // let totalPostViews = 0

            // // allPosts.forEach((post) => {
            // //     totalPostViews += post.views
            // // })

            // //better approach
            // const totalPostViewsAggregate = await tx.post.aggregate({
            //     _sum: {
            //         views: true
            //     }
            // })

            // const totalPostViews = totalPostViewsAggregate._sum.views

            // return {
            //     totalPost,
            //     totalPublishedPost,
            //     totalDraftPost,
            //     totalArchivedPost,
            //     totalComments,
            //     totalApprovedComments,
            //     totalRejectedComments,
            //     totalPostViews
            //     }
            //better approach
            const [totalPost,
                totalPublishedPost,
                totalDraftPost,
                totalArchivedPost,
                totalComments,
                totalApprovedComments,
                totalRejectedComments,
                totalPostViewsAggregate]
                = await Promise.all([
                    await tx.post.count(),
                    await tx.post.count({
                        where: {
                            status: PostStatus.PUBLISHED
                        }
                    }),
                    await tx.post.count({
                        where: {
                            status: PostStatus.DRAFT
                        }
                    }),
                    await tx.post.count({
                        where: {
                            status: PostStatus.ARCHIVE
                        }
                    }),
                    await tx.comment.count(),
                    await tx.comment.count({
                        where: {
                            status: CommentStatus.APPROVED
                        }
                    }),
                    await tx.comment.count({
                        where: {
                            status: CommentStatus.REJECT
                        }
                    }),
                    await tx.post.aggregate({
                        _sum: {
                            views: true
                        }
                    })
                ])

            return {
                totalPost,
                totalPublishedPost,
                totalDraftPost,
                totalArchivedPost,
                totalComments,
                totalApprovedComments,
                totalRejectedComments,
                totalPostViews : totalPostViewsAggregate._sum.views
            }
        }
    )
    return transactionResult
}

const getMyPostsFromDB = async (authorId: string) => {
    const result = await prisma.post.findMany({
        where: {
            authorId
        },
        orderBy: {
            createdAt: "desc"
        },
        include: {
            comments: true,
            author: {
                omit: {
                    password: true
                }
            },
            _count: {
                select: {
                    comments: true
                }
            }
        }
    })
    return result
}

const getPostByIdFromDB = async (postId: string) => {

    // await prisma.post.update({
    //     where: {
    //         id: postId
    //     },
    //     data: {
    //         views: {
    //             increment : 1
    //         }
    //     }
    // })

    // //throw new Error("Fake Error")

    // const post = await prisma.post.findUniqueOrThrow({
    //     where: {
    //         id : postId
    //     },
    //     include: {
    //         author: {
    //             omit: {
    //                 password: true
    //             }
    //         },
    //         comments: {
    //             where: {
    //                 status: CommentStatus.APPROVED
    //             },

    //             orderBy: {
    //                 createdAt : "desc"
    //             }
    //         },
    //         _count: {
    //             select: {
    //                 comments: true
    //             }
    //         }
    //     }
    // })
    // return post

    const transactionResult = await prisma.$transaction(
        async (tx) => {
            await tx.post.update({
                where: {
                    id: postId
                },
                data: {
                    views: {
                        increment: 1
                    }
                }
            })
            const post = await tx.post.findUniqueOrThrow({
                where: {
                    id: postId
                },
                include: {
                    author: {
                        omit: {
                            password: true
                        }
                    },
                    comments: {
                        where: {
                            status: CommentStatus.APPROVED
                        },

                        orderBy: {
                            createdAt: "desc"
                        }
                    },
                    _count: {
                        select: {
                            comments: true
                        }
                    }
                }
            })
            return post
        }
    )
    return transactionResult
}

const updatePostIntoDB = async (postId: string, payload: IUpdatePostPayload, authorId: string, isAdmin: boolean) => {
    const post = await prisma.post.findUniqueOrThrow({
        where: {
            id: postId
        }
    })

    if (!isAdmin && post.authorId !== authorId) {
        throw new Error("You are not the owner of this post!")
    }

    const result = await prisma.post.update({
        where: {
            id: postId
        },
        data: payload,
        include: {
            author: {
                omit: {
                    password: true
                }
            },
            comments: true
        }
    })
    return result
}

const deletePostFromDB = async (postId: string, authorId: string, isAdmin: boolean) => {
    const post = await prisma.post.findUniqueOrThrow({
        where: {
            id: postId
        }
    })

    if (!isAdmin && post.authorId !== authorId) {
        throw new Error("You are not the owner of this post!")
    }

    await prisma.post.delete({
        where: {
            id: postId
        }
    })
}

export const postService = {
    createPostIntoDB,
    getAllPostsFromDB,
    getPostStatsFromDB,
    getMyPostsFromDB,
    getPostByIdFromDB,
    updatePostIntoDB,
    deletePostFromDB
}