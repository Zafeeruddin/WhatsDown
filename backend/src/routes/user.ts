import { Prisma, PrismaClient } from "@prisma/client"
import { LoginParams, SignUpParams } from "../interfaces";
import { userSignup } from "../types";
import { authMiddleware } from "../Authenticate";
import { get } from "http";
const express=require("express")
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken")
export const userRouter=express.Router()
const prisma=new PrismaClient();
const saltRounds=9
export const SECRET_KEY="thisismysecret"
const cors=require("cors")

const checkEmail=async (req:any,res:any,next:any)=>{
    console.log("inner peace")
    const email:string=req.body.email
    const isEmail=await prisma.register.findUnique({
        where:{email:email}
    })
    console.log(isEmail)
    if(isEmail==null){
        next()
    }else{
        res.json({
            "message":"Email already taken"
        })
    }
}

userRouter.use(cors())
userRouter.post("/signup",checkEmail,async (req:any,res:any)=>{
    const {username,email,password}:SignUpParams=req.body
    const parse=userSignup.safeParse({
        username:username,
        email:email,
        password:password
    })
    if(!parse.success){
        console.log(parse.error.errors[0])
        res.json({"message":parse.error.errors[0]})
        return 
    }
    
    try{
        const hash=bcrypt.hashSync(password,saltRounds)
        const response=await prisma.register.create({
            data:{
                username,
                email,
                password:hash
            }
        })
        res.status(201).json({
            "message":response
        })
    }catch(e){
        res.status(401).json(e)
    }
})


userRouter.post("/login",async(req:any,res:any)=>{
    const {username,password}:LoginParams=req.body;
    console.log("username, pass ",username,password)
    const isUser=await prisma.register.findUnique({
        where:{
            username
        }
    })
    console.log(isUser)
    if(!isUser){
        res.json({"message":"User doesn't exists"})
        return
    }
    
    
    const passwordMatch=bcrypt.compareSync(password,isUser.password)
    console.log("isUser pwd",passwordMatch)

    if(!passwordMatch){
        res.json({"message":"Passwords don't match"})
        return
    }

    
    var token="Bearer " +jwt.sign({userID:isUser.id},SECRET_KEY)
    
    res.status(200).json({
        "message":"User Signed",
        "user":isUser,
        "token":token
    })

    
})

userRouter.get("/getUsers",authMiddleware,async(req:any,res:any)=>{
    const allUsers=await prisma.register.findMany()
    res.json({
        "users":allUsers
    })
})



userRouter.post("/createRelation",authMiddleware,async (req:any,res:any)=>{
    const {serverName}:{serverName:string}=req.body;
    const userID=req.userId;
    const getServer=await prisma.register.findUnique({
        where:{
            username:serverName
        }
    })
    if(!getServer){
         res.json({"message":"client doesn't exisit"})
         return
    }
    const serverId=getServer.id;
    const createChat=await prisma.userRelations.create({
        data:{
            clientId:userID,
            serverId:serverId,
        }

    })
    if(!createChat){
       res.json({"message":"Error creating relation"})
       return
    }
    res.json({
        "message":"Users relation is created",
        "relation":createChat
})

})

 userRouter.post("/chat",authMiddleware,async(req:any,res:any)=>{
    const {server,message}=req.body;
    const client=req.userId
    const getRelation=await prisma.userRelations.findFirst({
        where:{
            clientId:client,
            serverId:server
        }
    })
    if(!getRelation){
        res.status(403).json({
            "message":"you are not related to this person"
        })
        return
    }
    const addMessage=await prisma.chatbox.create({
        data:{
            client,
            server,
            message:message.message,
            timestamp:message.time
        }
    })
    if(!addMessage){
        return res.status(401).json("Error creating messages")
    }
    res.status(200).json({
        "message":"Message Sent Successfully",
        "chatMessage":addMessage
    })
})


userRouter.get("/getAllChats",authMiddleware,async(req:any,res:any)=>{
    

    let token = req.headers.authorization;

    const serverUser=req.headers.server
    const server=await prisma.register.findUnique({
        where:{
            username:serverUser
        }
    })
    console.log("this mf doesn't reaches here server now",server)
    const client=req.userId

    const getRelation=await prisma.userRelations.findFirst({
        where:{
            clientId:client,
            serverId:server?.id
        }
    })
    console.log("relations is ",getRelation)
    if(!getRelation){
        console.log("no relation exists")
        res.status(403).json({
            "message":"you are not related to this person"
        })
        return
    }
    const getMessages=await prisma.chatbox.findMany({
        where:{
            client:client,
            server:server?.id
        }
    })
    console.log("messages",getMessages)
    res.status(200).json({
        "messages":getMessages
    })
})