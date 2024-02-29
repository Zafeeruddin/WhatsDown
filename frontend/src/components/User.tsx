import { useRecoilState, useRecoilValue } from "recoil";
import { userType } from "../types/user"
import { onUser, serverUser, username } from "../atoms/user";

interface Props {
    user: userType;
 
}

export const User=({user}:Props)=>{
    const [server,setServer]=useRecoilState(serverUser)
    const [isUser,setIsUser]=useRecoilState(onUser)
    const openChat=():void=>{
        setServer(user.username)
        setIsUser(true)
    }
    const userName=useRecoilValue(username);
    console.log(user)
    return (
         user.username!=userName &&
        <div onClick={openChat}>
            <div className=" m-3 bg-slate-300 rounded p-2 w-40 hover:bg-slate-900 hover:text-white">
                <div className="text-lg" >{user.username}</div>
                <div className="text-xs">{user.email}</div>
            </div>
        </div>
    
    )
}