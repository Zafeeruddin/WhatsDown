import { useRecoilState, useRecoilValue } from "recoil";
import { Message, messages, messagesState, serverUser, token, username } from "../atoms/user";
import io from "socket.io-client";
import { Suspense, useEffect, useRef } from "react";

// Importing the Socket type from socket.io-client
import { Socket } from "socket.io-client";
import axios from "axios";

export function ChatBox() {
  const socketRef = useRef<Socket>(); // Ref to hold socket instance

  const server = useRecoilValue(serverUser);
  const client=useRecoilValue(username)
  const userToken=useRecoilValue(token)

  const getAllMessages=async()=>{
    const headers={
      authorization:userToken,
      server:server
    }
    
    try{
      const res=await axios.get("http://localhost:3000/api/v1/user/getAllChats",{
        
        headers:headers
      })
      console.log(res.data.messages)
      setAddMessages(res.data.messages)
   }catch(e:any){
    if(e.response && e.response.status==403){
      setAddMessages([])
    }
      console.log("error: ",e)
    }
  }
  useEffect(()=>{
    console.log("server changes")
    getAllMessages()
  },[server])

  useEffect(() => {
    
    socketRef.current = io("http://www.localhost:3000");
    console.log("socket is set ",username)
    socketRef.current.on("connect",()=>{
      console.log("socket connected")
      socketRef.current?.emit("send-client",client)
    })
    // Clean up socket connection when component unmounts
    return () => {
      socketRef.current?.off("chat-message");
      socketRef.current?.off("disconnect");
      socketRef.current?.disconnect();
    };
  }, [client]);

  useEffect(() => {
    const socket = socketRef.current;

    if (!socket) return; // Exit if socket is not initialized yet

    socket.on("chat message", (msg:any) => {
      console.log("clietn msg : ",msg)
      setAddMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket?.off("chat-message"); // Clean up event listener
    };
  }, []); // Empty dependency array to run only once when component mounts

  
  const emptyInput = useRef<HTMLInputElement>(null);
  const [currentMessage, setCurrentMessage] = useRecoilState(messages);
  const [addMessage, setAddMessages] = useRecoilState(messagesState);

  const sendMessage = (): void => {
    console.log("the message sent",currentMessage)
    
    const date: String = new Date().toTimeString();

    emptyInput.current!.value = "";
    const newMessage: Message = { 
          message: currentMessage,
          timestamp: `${date.slice(0, 5)}`
       };
       console.log("new message",newMessage)
      setAddMessages(prevMessages => [...prevMessages, newMessage]);
       // Send message through the socket connection
    socketRef.current?.emit("chat-message", newMessage,client,server);

    setCurrentMessage("");
  };

  return (
    <>
      <div className="h-96 w-full absolute bg-slate-200">
        <div>
          <div className="rounded-full"></div>
          <div>{server}</div>
        </div>
        <Suspense fallback={<Loading/>}>
        <div className="h-full w-full overflow-auto">
          
          <ul>
            {addMessage.map((message, index) => (
              <li key={index}>
                <div>{message.message}</div>
                <div>{message.timestamp}</div>
              </li>
            ))}
          </ul>
          
        </div>
        </Suspense>
        <div className="flex">
          <input ref={emptyInput} type="text" placeholder="Enter message..." onChange={(e) => { setCurrentMessage(e.target.value) }} />
          <button onClick={sendMessage}>send</button>
        </div>
      </div>
    </>
  );
}

function Loading(){
  return <h3>Loading...</h3>
}