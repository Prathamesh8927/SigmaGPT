import "./ChatWindow.css";
import Chat from "./Chat.jsx"
import { MyContext } from "./Mycontext.jsx";
import { useContext, useState,useEffect } from "react";
import {ScaleLoader} from "react-spinners";
function ChatWindow(){
    const {prompt,setprompt,reply,setreply,currentThreadId,setcurrentThreadId,prevChat,setprevChat}= useContext(MyContext);
    const[loading,setloading]=useState(false);
    const [isOpen,setisOpen]=useState(false);


    const getReply =async ()=> {
        setloading(true);
        console.log("message",prompt,"threadId",currentThreadId);
        
        const options={
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                message:prompt,
                threadId :currentThreadId
            })
        };
        try{
         const response=await fetch("http://localhost:8080/api/chat",options);
         const res=await response.json()
         console.log(res);
        setreply(res.reply)
        }catch(error)
        {
            console.log(error)
        }
        setloading(false);
    }
    //append new chat to previous chat
    useEffect(()=>{
        if(prompt && reply){
            setprevChat(prevChat=>
                [...prevChat,{
                    role:"user",
                    content:prompt
                },{
                    role:"assistant",
                    content:reply
                }]
            )
            }
            setprompt("");
    },[reply])

    const handleProfileClick=()=>{
        setisOpen(!isOpen);
    }
    return(
        <div className="chatwindow">
            <div className="navbar">
             <span>SigmaGPT<i className="fa-solid fa-angle-down"></i></span>
                <div className="usericonDiv" onClick={handleProfileClick}>
                    <span className="usericon"><i className="fa-solid fa-user"></i></span>
                </div>
            </div>
            {
                isOpen &&
                <div className="dropDown">
                    <div className="dropDownitem"><i class="fa-solid fa-gear"></i>Setting</div>
                    <div className="dropDownitem" ><i class="fa-solid fa-cloud-arrow-up"></i>Upgrade Plan</div>
                    <div className="dropDownitem"><i class="fa-solid fa-arrow-right-from-bracket"></i>Log out</div>
                </div>
            }
            <Chat></Chat>
            
            <ScaleLoader color="#fff" loading={loading}>

            </ScaleLoader>

            <div className="chatinput">
                <div className="inputbox">
                    <input placeholder="Ask Anything"
                    value={prompt}
                   onChange={(e)=>setprompt(e.target.value)}
                   onKeyDown={(e)=>e.key==="Enter"?getReply():''}>
                   
                    </input>
                    <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
                </div>
                <p className="info">SigmaGPT can make mistakes. Check important info.</p>
            </div>
        </div>
    
    )
}
export default ChatWindow;