import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { userType } from "../types/user"
import { onUser, profileClick, serverUser, userClick, username } from "../atoms/user";

interface Props {
    user: userType;
 
}

export const User=({user}:Props)=>{
    const setUser=useSetRecoilState(userClick)
    const setIsProfileClicked=useSetRecoilState(profileClick) // for hiding and unhiding users list


    const [server,setServer]=useRecoilState(serverUser)
    const [isUser,setIsUser]=useRecoilState(onUser)
    const openChat=():void=>{
        setUser(true);
        setIsProfileClicked(false)
        setServer(user.username)
        setIsUser(true)
    }
    const userName=useRecoilValue(username);
    console.log(user)
    return (
         user.username!=userName &&
        <div className="h-fit   p-2 pb-2 " onClick={openChat}>
            <div className=" transition hover:rounded-md ease-in-out delay-75    p-2 w-full hover:bg-slate-900 hover:text-white">
                <div className="text-lg" >{user.username}</div>
                <div className="text-xs ">{user.email}</div>
            </div>
        </div>
    
    )
}