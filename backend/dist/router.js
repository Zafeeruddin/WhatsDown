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
const client_1 = require("@prisma/client");
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const routes_1 = require("./routes");
const cors = require("cors");
const prisma = new client_1.PrismaClient();
const express = require("express");
const app = express();
const httpServer = (0, http_1.createServer)(app);
app.use(express.json());
app.use("/api/v1", routes_1.indexRouter);
app.use(cors());
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT"],
        credentials: true,
        allowedHeaders: ["Content-Type"], // Allow only Content-Type header
    }
});
app.use(express.json());
app.get("/postMessages", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("response");
}));
// intiializing outside, as this gets re-initialized if more users join the server.
let userMaps = [];
io.on("connection", (socket) => {
    socket.on("send-client", (username) => {
        let userOne = {
            username: username,
            id: socket.id
        };
        userMaps.push(userOne);
        console.log("users in client", userMaps);
    });
    // Define a function to handle chat messages
    const handleChatMessage = (msg, client, server) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(msg);
        //checking if client and server exists
        const serverUser = yield prisma.register.findUnique({
            where: {
                username: server
            }
        });
        const clientUser = yield prisma.register.findUnique({
            where: {
                username: client
            }
        });
        console.log("client user", clientUser);
        console.log("server user", serverUser);
        let findRelation;
        // checking if relation exists, if not creating one.
        if (clientUser && serverUser) {
            const allRelations = yield prisma.userRelations.findMany();
            console.log(allRelations);
            findRelation = yield prisma.userRelations.findFirst({
                where: {
                    clientId: clientUser.id,
                    serverId: serverUser.id
                }
            });
            console.log("relations is before creating :", findRelation);
            if (!findRelation) {
                console.log("inside reayd to create");
                findRelation = yield prisma.userRelations.create({
                    data: {
                        clientId: clientUser.id,
                        serverId: serverUser.id
                    }
                });
                console.log("relation created", findRelation);
            }
        }
        //adding messages to chatbox
        if (clientUser && serverUser) {
            const message = yield prisma.chatbox.create({
                data: {
                    client: clientUser.id,
                    server: serverUser.id,
                    message: msg.message,
                    timestamp: msg.timestamp
                }
            });
            console.log("message sent", message);
        }
        //checking if the server is there in userMaps, if so emitting
        const getServer = userMaps.filter(user => user.username === server)[0];
        console.log("server with socket id ", getServer);
        console.log("users ", userMaps);
        if (getServer) {
            console.log("sending data to ", getServer.id);
            console.log("this sending to ", msg);
            io.to(getServer.id).emit("chat message", msg);
        }
        console.log(`${msg} ${client} send to ${server}`);
        console.log(socket.id);
        // let clientUser =userMaps.filter(user => user.username === client)[0];
        // if(server){
        //     let serverUser =userMaps.filter(user => user.username === server)[0];
        //     io.to(serverUser.id).emit("chat-message", msg)
        // }
    });
    // Add the chat-message event listener
    socket.on("chat-message", handleChatMessage);
    // Remove the chat-message event listener when the client disconnects
    socket.on('disconnect', () => {
        console.log('A user disconnected');
        socket.off("chat-message", handleChatMessage);
    });
});
httpServer.listen(3000);
