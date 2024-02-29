import { useRecoilState, useRecoilValue} from "recoil"
import { allUsers, onUser, serverUser, token, username } from "../atoms/user"
import axios from "axios";
import { User } from "./User";
import { useEffect, useState } from "react";
import { ChatBox } from "./ChatBox";
import { userType } from "../types/user";


export const Dashboard=()=>{
    const [users,setUsers]=useRecoilState(allUsers);
    const userToken=useRecoilValue(token)
    const userName=useRecoilValue(username)
    const isUser=useRecoilValue(onUser);
    // for chat modal
        useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/v1/user/getUsers", {
                    headers: {
                        authorization: userToken
                    }
                });
                console.log("users", response.data.users);
                setUsers(response.data.users);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        getUsers();
        // Call getUsers function inside useEffect
    }, []); //    
    return (
        <div className="flex postion absolute h-screen w-full">
            <div>
                <div className="bg-gray-600 w-80 ">
                    <div className="rounded-full w-10 h-10 text-center text-2xl bg-gray-200 ">{userName[0]} </div>
                </div>
                <input className="rounded p-2 m-2 w-72 border-slate-800" type="text" placeholder="Search users..."/>
                <div className="overflow-y-auto bg-black h-full w-80">
                    {users.map(user=>{
                        return <User  user={user}/>
                    })}
                </div>
            </div>
            <div className="h-full w-full">
               {isUser && <ChatBox/>}
            </div>     
        </div>
    )
}