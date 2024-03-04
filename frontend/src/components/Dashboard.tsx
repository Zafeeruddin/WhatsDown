import { useRecoilState, useRecoilValue} from "recoil"
import { allUsers, onUser, profileClick,  token, userClick, username } from "../atoms/user"
import axios from "axios";
import { User } from "./User";
import { useEffect, } from "react";
import { ChatBox } from "./ChatBox";
import { useNavigate } from "react-router-dom";


export const Dashboard=()=>{
    const [users,setUsers]=useRecoilState(allUsers);
    const [userToken,setUserToken]=useRecoilState(token)
    const userName=useRecoilValue(username)
    const isUser=useRecoilValue(onUser);
    const [user,setUser]=useRecoilState(userClick)
    const [isProfileClicked,setIsProfileClicked]=useRecoilState(profileClick) // for hiding and unhiding users list

    const handleProfileClick=()=>{
        setUser(!user);
        setIsProfileClicked(true)
    }
    

    const navigate=useNavigate()
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
    
    
    const logout=()=>{
        setUserToken("")
        setUser(false)
        navigate("/login")
    }

    return (
        //dashboard.tsx
        <div className="overflow-hidden relative h-screen   w-full">
            
                <a href="#" className="flex items-center justify-between h-1/8 p-3 bg-gray-300">
                    <div className="flex items-center">
                        <div onClick={handleProfileClick} className="bg-gray-200 w-12 h-12 rounded-full text-center justify-center capitalize">
                            <div className="relative top-2 justify-center text-2xl">{userName[0]}</div>
                        </div>
                        <div className="text-3xl font-sans pl-5 capitalize">{userName}</div>
                    </div>
                    <button onClick={logout} className="text-center rounded-lg bg-black hover:bg-red-800  transition ease-in-out delay-150 font-serif ">
                        <div className="text-white justify-center font-mono text-center p-2 text-sm font-semibold">Logout</div>
                    </button>
                </a>

                <div className="lg:flex lg:justify-between w-full p-5">                           
                        <div className="bg-gray-300 h-[80vh] w-full lg:w-1/3   shadow-xl border border-r-2 rounded-lg overflow-y-auto m-2 ">
                            {users.map(user=>{
                                return <User  user={user}/>
                            })}
                        </div>
                        {isUser && <  div className={`absolute top-16 left-px ml-4 right-px justify-center flex  m-8 w-[111vh]  h-[81vh] mb-2 lg:w-1/2 lg:h-5/6 bg-white lg:relative lg:top-2  lg:ml-8 lg:rounded-2xl lg:mt-2 `}>
                                {isUser && <ChatBox/>}
                        </div>}
                </div>
                       
           
        </div>

    )
}