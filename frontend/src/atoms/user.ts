import axios from "axios"
import {atom, selector} from "recoil"



export type Message={
    client:number,
    server:number
    message:string,
    timestamp:string
  }
export type MessageSent={
    message:string,
    timestamp:string
  }
export type ClientMessages={
    msg:String,
    time:String,
    username:String
}

export const username=atom({
    key:"username",
    default:""
})

export const email=atom({
    key:"email",
    default:""
})

export const clientId=atom({
    key:"cid",
    default:0
})

export const serverId=atom({
    key:"sid",
    default:0
})

export const userClick=atom({
    key:"userClciked",
    default:false
})


export const profileClick=atom({
    key:"profileClick",
    default:false
})

export const password=atom({
    key:"password",
    default:""
})

export  const token=atom<string>({
    key:"token",
    default:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0cyI6MTcwM…jIifQ.DaOjdsRkquVqk7Gbx_nv12JXzQpJ58nggKodt3qoJBw"
})

export const allUsers=atom({
    key:"allUsers",
    default:[]
})

export const messages=atom<string>({
    key:"message",
    default:""
})



export const messagesState = atom<Message[]>({
    key: 'allMessages',
    default: [],
});

export const fetchMessages = selector<Message[]>({
    key: 'fetchMessages',
    get: async ({ get }) => {
        const server = get(serverUser);
        const res = await axios.get("http://localhost:3000/api/v1/user/getAllChats", {
            params: {
                server: server
            }
        });
        return res.data.messages;
    }
});
export const serverUser=atom<string>({
    key:"server",
    default:""
})
export const onUser=atom({
    key:"onUser",
    default:false
})