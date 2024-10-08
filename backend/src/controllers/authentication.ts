import { Request, Response } from "express";
import { Router } from "express";
import { body, header, validationResult } from "express-validator";
import crypt from "../helpers/cryptography"
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
import AuthMiddleware from "../helpers/authentication";
import axios from "axios";

configDotenv()

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "secret"

const route = Router();
const prismaClient = new PrismaClient();

route.post('/login', [
    body("username")
        .exists().withMessage("is required.")
        .notEmpty().withMessage("should not be empty."),
    body("password")
        .exists().withMessage("is required.")
        .notEmpty().withMessage("should not be empty.")
], async (request: Request, response: Response) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
        return response
            .status(400)
            .json(errors.array());
    }

    const username = request.body.username;
    const password = request.body.password;

    const user = await prismaClient.user.findFirst({
        where: {
            username: username
        }
    });

    if (!user) {
        return response
            .status(404)
            .json({
                code: response.statusCode,
                message: "User not found."
            });
    }

    // const is_valid = await crypt.compare(password, user.password);
    // if (!is_valid) {
    //     return response
    //         .status(401)
    //         .json({
    //             code: response.statusCode,
    //             message: "Unauthorized access."
    //         });
    // }

    const accessToken = jwt.sign(user, ACCESS_TOKEN_SECRET);

    const session = await prismaClient.session.create({
        data: {
            user_id: user.id,
            token: accessToken,
        },
        select: {
            user: {
                select: {
                    id: true,
                    username: true,
                    role: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    division: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            },
            token: true
        }
    });

    return response
        .status(200)
        .json(session);

})

route.post('/register', [
    body("username")
        .exists().withMessage("is required.")
        .notEmpty().withMessage("should not be empty."),
    body("password")
        .exists().withMessage("is required.")
        .notEmpty().withMessage("should not be empty."),
    body("roleId")
        .isInt().withMessage("must be an integer."),
    body("departmentId")
        .isInt().withMessage("must be an integer.")
], async (request: Request, response: Response) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
        return response
            .status(400)
            .json(errors.array());
    }

    const username = request.body.username;
    const password = request.body.password;
    const roleId = request.body.roleId;
    const departmentId = request.body.departmentId;

    const existingUser = await prismaClient.user.findFirst({
        where: {
            username: username
        }
    });

    if (existingUser) {
        return response
            .status(409)
            .json({
                code: response.statusCode,
                message: "User already exists."
            });
    }

    const hashedPassword = await crypt.encrypt(password);

    const newUser = await prismaClient.user.create({
        data: {
            username: username,
            password: hashedPassword as string,
            role: {
                connect: { id: roleId } // Provide the actual roleId
            },
            division: {
                connect: { id: departmentId } // Provide the actual departmentId
            },
        }
    });

    return response
        .status(201)
        .json(newUser);
})

route.get('/logout', AuthMiddleware.ensureAuthenticated, [
], async (request: Request, response: Response) => {
    await prismaClient.session.updateMany({
        where: {
            token: request.headers.authorization?.split(" ")[1],
            is_active: true
        },
        data: {
            is_active: false
        }
    });

    return response
        .status(200)
        .json({
            code: response.statusCode,
            message: "User logged out."
        });

})



export default route;