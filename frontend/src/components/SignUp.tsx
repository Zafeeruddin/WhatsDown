import axios from "axios"
import { email, password, username} from "../atoms/user"
import { useRecoilState } from "recoil"
import { useState } from "react"

export const SignUp=()=>{
    const [userName,setUserName]=useRecoilState(username)
    const [userEmail,setEmailUser]=useRecoilState(email)
    const [userPass,setUserPass]=useRecoilState(password)
    const [message,setMessage]=useState("")
    const registerUser=async ():Promise<void>=>{
    try{
        const response=await axios.post("http://localhost:3000/api/v1/user/signup",
        {
            "username":userName,
            "email":userEmail,
            "password":userPass
        })
        setEmailUser("");
        setUserName("");
        setUserPass("")
        console.log("response ", response.data)
        const res=response.data.message
        console.log("messages ",res)
        setMessage(res.email? res.email: res.message ? res.message : res )
    }catch(e:any){
        setMessage(e)
    }
}

    return (
        <div>
          <div>
            <div>Username</div>
            <input type="text" placeholder="Johndoe" onChange={(e)=>setUserName(e.target.value)}  />
          </div>
          <div>
            <div>email</div>
            <input type="text" placeholder="john@gmail.com" onChange={(e)=>setEmailUser(e.target.value)}/>
          </div>
          <div>
            <div>password</div>
            <input type="password" placeholder="********" onChange={(e)=>setUserPass(e.target.value)}/>
          </div>
          <button onClick={registerUser}>Sign Up</button>
          <div>{message}</div>
        </div>
    )
}