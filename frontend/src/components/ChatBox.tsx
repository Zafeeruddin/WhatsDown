import { useRecoilState, useRecoilValue } from "recoil";
import { Message, clientId, messages, messagesState, serverId, serverUser, token, username } from "../atoms/user";
import io from "socket.io-client";
import {  useEffect, useRef } from "react";
import { Scrollbars } from 'react-custom-scrollbars';

// Importing the Socket type from socket.io-client
import { Socket } from "socket.io-client";
import axios from "axios";

export function ChatBox() {
  const socketRef = useRef<Socket>(); // Ref to hold socket instance
  const server = useRecoilValue(serverUser);
  const client=useRecoilValue(username)
  const userToken=useRecoilValue(token)
  const userId:number=useRecoilValue(clientId)
  const emptyInput = useRef<HTMLInputElement>(null);
  const chatRef = useRef<Scrollbars>(null);
  const [serverUserId,setServerUserId]=useRecoilState(serverId)

  const [currentMessage, setCurrentMessage] = useRecoilState(messages);
  const [addMessage, setAddMessages] = useRecoilState(messagesState);

  const handleKeyDown = (e:any) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default behavior of form submission
      sendMessage();
    }
  };
  const getAllMessages=async()=>{
    const headers={
      authorization:userToken,
      server:server
    }
    
    try{
      const res=await axios.get("http://localhost:3000/api/v1/user/getAllChats",{
        
        headers:headers
      }) 
      console.log(res.data.clientMessages)
      console.log(res.data.serverMessages)
      console.log("serverId",res.data.serverId)
      setServerUserId(res.data.serverId)
      const mergedMessages=[...res.data.clientMessages,...res.data.serverMessages]
      mergedMessages.sort((a, b) => {
        // Convert timestamps to Date objects for comparison
        let timeA:any = new Date('2000-01-01T' + a.timestamp);
        let timeB:any = new Date('2000-01-01T' + b.timestamp);
        
        // Compare the timestamps
        return timeA - timeB;
      });
      
      setAddMessages(mergedMessages)
      if (chatRef.current) {
        chatRef.current.scrollToBottom();
      }
      console.log("messages in total",mergedMessages)
   }catch(e:any){
    if(e.response && e.response.status==403){
      setAddMessages([])
    }
      console.log("error: ",e)
    }
  }

  useEffect(() => {
    // Scroll to bottom when new content is added
    if (chatRef.current) {
      chatRef.current.scrollToBottom();
    }
  }, [addMessage,currentMessage]); // Trigger when addMessage changes
  
  useEffect(()=>{
    console.log("server changes")
    getAllMessages()
  },[server])

  useEffect(() => {
    
    socketRef.current = io("http://www.localhost:3000");
    console.log("socket is set ",client)
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
      console.log("compare with current msg",currentMessage)
      setAddMessages((prevMessages) => [...prevMessages, msg]);
      console.log("after addition of message",addMessage)
      if (chatRef.current) {
        chatRef.current.scrollToBottom();
      }
    });

    return () => {
      socket?.off("chat-message"); // Clean up event listener
    };
  }, []); // Empty dependency array to run only once when component mounts


  
  
 

  const sendMessage = (): void => {
    // After updating the state with new messages

    console.log("the message sent",currentMessage)
    
    const date: String = new Date().toTimeString();

    emptyInput.current!.value = "";
    const newMessage: Message = { 
          message: currentMessage,
          timestamp: `${date.slice(0, 8)}`,
          client:userId,
          server:serverUserId
       };
       console.log("new message",newMessage)
      setAddMessages(prevMessages => [...prevMessages, newMessage]);
      console.log("messages updates",addMessage)
       // Send message through the socket connection
    socketRef.current?.emit("chat-message", newMessage,client,server);
    setCurrentMessage("");
  };

  return (
    <div className="   h-fit w-full shadow rounded-lg m-3" >
        <a href="#" className="w-full flex font-sans bg-gray-200 hover:bg-gray-300">
            <div className=" text-xl font-bold   text-center bg-gray-400 rounded-full w-10 h-10 rounded- m-2 pt-1 ">{server[0].toUpperCase()}</div>
            <div className="text-2xl font-bold  capitalize ml-3 mt-2 text-gray-800 ">{server}</div>
        </a>
        
        <div className=" bg-slate-300   w-full h-full"  >
          <Scrollbars  autoHeight autoHeightMax={400} ref={chatRef} style={{width: '100%', height: '100%' }}>  
            <ul className=" bg-skate-800 p-2   font-sans  bg-slate-300  h-72 overflow-auto-y"  >
                {addMessage.map((message, index) => (
                    userId === message.client ? (
                        <li key={index} className="flex  items-center  pb-2 justify-end ">
                            <div className="bg-blue-500 text-white flex py-2 px-4 rounded-lg max-w-xs">
                                <div>{message.message}</div>
                                <div className="text-[0.5rem]  w-fit ml-2 mt-5" >{message.timestamp.slice(0,5)}</div>
                            </div>
                        </li>
                    ) : (
                        <li key={index} className="flex pb-2 items-center mb-4">
                            <div className="bg-gray-200 flex text-gray-800 py-2 px-4 rounded-lg max-w-xs">
                                <div>{message.message}</div>
                                <div className="text-[0.6rem]  w-fit ml-2 mt-3">{message.timestamp.slice(0,5)}</div>
                            </div>
                        </li>
                    )
                ))}
            </ul>
            </Scrollbars>
        </div>
        <div className="flex h-[10vh]  relative bottom-1 bg-gray-200  p-2 ">
            <input onKeyDown={handleKeyDown} className="w-full border shadow  focus:pl-3 font-serif rounded-md p-3 focus:ring-black" ref={emptyInput} type="text" placeholder="Enter message..." onChange={(e) => { setCurrentMessage(e.target.value) }} />
            <button className="bg-slate-900 transition ease-in-out delay-150 hover:bg-black text-white rounded-md pl-3 pr-3 ml-3 text-lg font-semibold mr-3 w-20  " onClick={sendMessage}>send</button>
        </div>
    </div> 
  )
}
