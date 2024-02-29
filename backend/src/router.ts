import { PrismaClient } from "@prisma/client";
import { createServer } from "http";
import { Server } from "socket.io";
import { indexRouter } from "./routes";
import { emit } from "process";

const cors=require("cors")
const prisma=new PrismaClient()
const express=require("express")
const app=express();
const httpServer=createServer(app)

app.use(express.json())
app.use("/api/v1",indexRouter)

app.use(cors())
const io=new Server(httpServer,{
    cors:{
        origin:"*",
        methods:["GET","POST","PUT"],
        credentials:true,
        allowedHeaders: ["Content-Type"], // Allow only Content-Type header

    }
});

app.use(express.json())

app.get("/postMessages",async (req:any,res:any)=>{
    res.send("response")
})

// intiializing outside, as this gets re-initialized if more users join the server.
let userMaps:{username:string,id:string}[]=[];

io.on("connection", (socket) => {

    socket.on("send-client", (username)=>{
        let userOne={
            username:username,
            id:socket.id
        }
       
        userMaps.push(userOne)
        console.log("users in client",userMaps)
    })

    
    
    // Define a function to handle chat messages
    const handleChatMessage = async (msg:any,client:string,server:string) => {
        console.log(msg);


       //checking if client and server exists
        const serverUser=await prisma.register.findUnique({
            where:{
                username:server
            }
        })
        const clientUser=await prisma.register.findUnique({
            where:{
                username:client
            }
        })

        console.log("client user", clientUser)
        console.log("server user",serverUser)
        let findRelation;
        // checking if relation exists, if not creating one.
        if(clientUser && serverUser){
            const allRelations=await prisma.userRelations.findMany()
            console.log(allRelations)
             findRelation=await prisma.userRelations.findFirst({
                where:{
                    clientId:clientUser.id,
                    serverId:serverUser.id
                }
            })
            console.log("relations is before creating :" ,findRelation)


            if(!findRelation){
                console.log("inside reayd to create")
                findRelation=await prisma.userRelations.create({
                    data:{
                        clientId:clientUser.id,
                        serverId:serverUser.id
                    }
                })
                console.log("relation created",findRelation)
            }
        }
        //adding messages to chatbox
        if(clientUser && serverUser){
        const message=await prisma.chatbox.create({
            data:{
                client:clientUser.id,
                server:serverUser.id,
                message:msg.message,
                timestamp:msg.timestamp
            }
        })
        console.log("message sent",message)
    }

        //checking if the server is there in userMaps, if so emitting
        const getServer=userMaps.filter(user=>user.username===server)[0]
        console.log("server with socket id ",getServer)
        console.log("users ",userMaps)
        if(getServer){
            console.log("sending data to ",getServer.id)
            console.log("this sending to ",msg)
            io.to(getServer.id).emit("chat message",msg)
        }

        console.log(`${msg} ${client} send to ${server}`)
        console.log(socket.id)
        // let clientUser =userMaps.filter(user => user.username === client)[0];
        // if(server){
         
        //     let serverUser =userMaps.filter(user => user.username === server)[0];

        //     io.to(serverUser.id).emit("chat-message", msg)
        // }
    };

    // Add the chat-message event listener
    socket.on("chat-message", handleChatMessage);

    // Remove the chat-message event listener when the client disconnects
    socket.on('disconnect', () => {
        console.log('A user disconnected');
        socket.off("chat-message", handleChatMessage);
    });
})
httpServer.listen(3000)


