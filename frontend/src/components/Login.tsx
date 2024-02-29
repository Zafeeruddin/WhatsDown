import { useRecoilState } from "recoil"
import {  password, token, username } from "../atoms/user"
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Login=()=>{
    const [userName,setUserName]=useRecoilState(username);
    const [userPass,setUserPass]=useRecoilState(password);
    const [message,setMessage]=useState("")
    const [userToken,setUserToken]=useRecoilState(token)
    const navigate=useNavigate()

    const signin=async ():Promise<void>=>{
        try{
            const response=await axios.post("http://localhost:3000/api/v1/user/login",
            {
                "username":userName,
                "password":userPass
            })
            
            setUserPass("")

            const res=response.data.message
            if (response.data.token){
                setUserToken(response.data.token)
                console.log("token set")
            }
            setMessage(res.email? res.email: res.message ? res.message : res )
            navigate("/dashboard")
        }catch(e:any){
            setMessage(e)
        }
    }
    return (
        <div>
            <div>
                <div className="">Username</div>
                <input type="text" placeholder="JohnDoe" onChange={(e)=>setUserName(e.target.value)}/>
            </div>
            <div>
                <div>Password</div>
                <input type="password" placeholder="*****" onChange={(e)=>setUserPass(e.target.value)}/>
            </div>
            <button onClick={signin}>Login</button>
            <div>{message}</div>
        </div>
    )
}