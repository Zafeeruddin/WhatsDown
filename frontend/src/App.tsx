import {RecoilRoot} from "recoil"
import {BrowserRouter, Route, Routes} from "react-router-dom"
import { ChatBox } from "./components/ChatBox"
import { SignUp } from "./components/SignUp"
import { Login } from "./components/Login"
import { Dashboard } from "./components/Dashboard"

function App() {
  
  return (
    <BrowserRouter>
    <RecoilRoot>
      <Routes>
        <Route path="/chat" element={<ChatBox/>}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
      </Routes>
    </RecoilRoot>
    </BrowserRouter>
  )
}

export default App
