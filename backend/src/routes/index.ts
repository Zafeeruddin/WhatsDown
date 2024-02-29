const express=require("express")
import {userRouter} from "./user"
export const indexRouter=express.Router()
const cors=require("cors")

indexRouter.use(cors())
indexRouter.use("/user",userRouter)
