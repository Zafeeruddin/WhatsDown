"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SECRET_KEY = exports.userRouter = void 0;
const client_1 = require("@prisma/client");
const types_1 = require("../types");
const Authenticate_1 = require("../Authenticate");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
exports.userRouter = express.Router();
const prisma = new client_1.PrismaClient();
const saltRounds = 9;
exports.SECRET_KEY = "thisismysecret";
const cors = require("cors");
const checkEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("inner peace");
    const email = req.body.email;
    const isEmail = yield prisma.register.findUnique({
        where: { email: email }
    });
    console.log(isEmail);
    if (isEmail == null) {
        next();
    }
    else {
        res.json({
            "message": "Email already taken"
        });
    }
});
exports.userRouter.use(cors());
exports.userRouter.post("/signup", checkEmail, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    const getUser = yield prisma.register.findUnique({
        where: {
            username: username
        }
    });
    if (getUser) {
        res.status(411).json({
            "message": "Username already exists"
        });
    }
    console.log("username", username);
    console.log("email", email);
    console.log(username, email, password);
    const parse = types_1.userSignup.safeParse({
        username: username,
        email: email.toLowerCase(),
        password: password
    });
    if (!parse.success) {
        let response = parse.error.errors[0].message;
        response = response.replace("String", parse.error.errors[0].path[0]);
        console.log(parse.error.errors[0]);
        console.log(response);
        res.json({ "message": response });
        return;
    }
    try {
        const hash = bcrypt.hashSync(password, saltRounds);
        const response = yield prisma.register.create({
            data: {
                username,
                email,
                password: hash
            }
        });
        res.status(201).json({
            "message": response
        });
    }
    catch (e) {
        res.status(401).json(e);
    }
}));
exports.userRouter.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    console.log("username, pass ", username, password);
    const isUser = yield prisma.register.findUnique({
        where: {
            username
        }
    });
    console.log(isUser);
    if (!isUser) {
        res.json({ "message": "User doesn't exists" });
        return;
    }
    const passwordMatch = bcrypt.compareSync(password, isUser.password);
    console.log("isUser pwd", passwordMatch);
    if (!passwordMatch) {
        res.json({ "message": "Incorrect password" });
        return;
    }
    var token = "Bearer " + jwt.sign({ userID: isUser.id }, exports.SECRET_KEY);
    res.status(200).json({
        "message": "User Signed",
        "user": isUser,
        "token": token,
    });
}));
exports.userRouter.get("/getUsers", Authenticate_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allUsers = yield prisma.register.findMany();
    res.json({
        "users": allUsers
    });
}));
exports.userRouter.post("/createRelation", Authenticate_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { serverName } = req.body;
    const userID = req.userId;
    const getServer = yield prisma.register.findUnique({
        where: {
            username: serverName
        }
    });
    if (!getServer) {
        res.json({ "message": "client doesn't exisit" });
        return;
    }
    const serverId = getServer.id;
    const createChat = yield prisma.userRelations.create({
        data: {
            clientId: userID,
            serverId: serverId,
        }
    });
    if (!createChat) {
        res.json({ "message": "Error creating relation" });
        return;
    }
    res.json({
        "message": "Users relation is created",
        "relation": createChat
    });
}));
exports.userRouter.post("/chat", Authenticate_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { server, message } = req.body;
    const client = req.userId;
    const getRelation = yield prisma.userRelations.findFirst({
        where: {
            clientId: client,
            serverId: server
        }
    });
    if (!getRelation) {
        res.status(403).json({
            "message": "you are not related to this person"
        });
        return;
    }
    const addMessage = yield prisma.chatbox.create({
        data: {
            client,
            server,
            message: message.message,
            timestamp: message.time
        }
    });
    if (!addMessage) {
        return res.status(401).json("Error creating messages");
    }
    res.status(200).json({
        "message": "Message Sent Successfully",
        "chatMessage": addMessage
    });
}));
exports.userRouter.get("/getAllChats", Authenticate_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let token = req.headers.authorization;
    const serverUser = req.headers.server;
    const server = yield prisma.register.findUnique({
        where: {
            username: serverUser
        }
    });
    const client = req.userId;
    const getRelation = yield prisma.userRelations.findFirst({
        where: {
            clientId: client,
            serverId: server === null || server === void 0 ? void 0 : server.id
        }
    });
    console.log("relations is ", getRelation);
    if (!getRelation) {
        console.log("no relation exists");
        res.status(403).json({
            "message": "you are not related to this person"
        });
        return;
    }
    const clientMessages = yield prisma.chatbox.findMany({
        where: {
            client: client,
            server: server === null || server === void 0 ? void 0 : server.id
        }
    });
    const serverMessages = yield prisma.chatbox.findMany({
        where: {
            client: server === null || server === void 0 ? void 0 : server.id,
            server: client
        }
    });
    console.log("client messages", clientMessages);
    console.log("server messages", serverMessages);
    res.status(200).json({
        "clientMessages": clientMessages,
        "serverMessages": serverMessages,
        "serverId": server === null || server === void 0 ? void 0 : server.id
    });
}));
