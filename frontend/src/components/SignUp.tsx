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
        setMessage("")
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
        setMessage(res.email? res.email +" created": res.message ? res.message : res )
    }catch(e:any){
        setMessage(e)
    }
}

    return (
        <div className="h-screen flex justify-center  flex-col">
          <div className="flex justify-center ">
            <a href="#" className="block w-72 sm:max-w-sm p-6  bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-200">
              <div >
                <div className="px-10 flex justify-center">
                    <div className="text-3xl font-extrabold justify-center">
                      Sign in
                    </div>  
                </div>                   
                <div className="pt-2">
                    <LabelledInput setUser={setUserName} label="Username" placeholder="itzxaf" type="text"/>
                    <LabelledInput setUser={setEmailUser} label="Email" placeholder="xaf@gmail.com" type="text" />
                    <LabelledInput setUser={setUserPass} label="Password" placeholder="12345678" type="password"/>
                    <button className="mt-8 w-full text-white bg-gray-800 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2.5 mb-2" onClick={registerUser}>Sign Up</button>    
                  <div className={`text-red-600 font-xs text-sm mt-2 justify-center font-extrabold ${message.includes("created")? "text-green-300" :""}`}>{message}</div>
                </div>
              </div>
            </a>
          </div>
        </div>
    )
}

interface LabelledInputProps{
  label:string,
  placeholder:string,
  type?:string,
  setUser:React.Dispatch<React.SetStateAction<string>>
}

const LabelledInput: React.FC<LabelledInputProps> = ({ label, placeholder, type = "text", setUser }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("value",e.target.value)
    setUser(e.target.value); // Call the setUser function with the input value
  };

  return (
    <div>
      <label className="block mb-2 text-sm text-black font-semibold pt-4">{label}</label>
      <input
        onChange={handleChange} // Call handleChange function on input change
        type={type}
        id="first_name"
        className="focus:pl-4 transition delay-100 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5"
        placeholder={placeholder}
        required
      />
    </div>
  );
};