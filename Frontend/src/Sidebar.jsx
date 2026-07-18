import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./Mycontext";
import {v1 as uuidv1} from "uuid"
function Sidebar(){

const {allthreads,setallthreads,currentThreadId,setcurrentThreadId,prevChat,setprevChat,newChat,setnewChat,prompt,setprompt,reply,setreply}=useContext(MyContext);

const getallthreads=async()=>{
    try {
       const response= await fetch("http://localhost:8080/api/thread");
       const res= await response.json();
       const filterData= res.map(thread=>({
        threadId: thread.threadId,
        title: thread.title
       }));
     //  console.log(filterData);
       setallthreads(filterData);
       //threadid , title
    } catch (error) {
        console.log(error);
    }
};

useEffect(()=>{
getallthreads();
},[currentThreadId])


const createNewChat=() =>{
    setnewChat(true);
    setprompt("");
    setreply(null);
    setcurrentThreadId(uuidv1());
    setprevChat([]);
};
 const changeThread = async(newThreadId)=>{
    setcurrentThreadId(newThreadId);

    try {
        const response= await fetch(`http://localhost:8080/api/thread/${newThreadId}`);
        const res= await response.json();
        console.log(res);
        setprevChat(res);
        setreply(null);
        setnewChat(false);
    } catch (error) {
        console.log(error);
    }
 };

 const deleteThread =async(threadId)=>{
    try {
       const response= await fetch(`http://localhost:8080/api/thread/${threadId}`, {method:"DELETE"});
       const res= await response.json(); 
       console.log(res);

       //updated thread re-render
       setallthreads(prev=>prev.filter(thread=>thread.threadId != threadId));
       if(threadId=== currentThreadId){
        createNewChat();
       };


    } catch (error) {
        console.log(error);
    }
 }
    return(
        <section className="sidebar">
            {/* {new chat button} */}
        <button onClick={createNewChat}>
            <img src="src/assets/SigmGpt_logo.png" alt="Gpt logo " className="logo"></img>
           <span> <i className="fa-solid fa-pen-to-square"></i> </span>
        </button>
            {/* history */}
        <ul className="history">
            {
                allthreads?.map((thread,idx)=>(
                    <li key={idx}
                    onClick={(e)=>changeThread(thread.threadId)}
                    className={thread.threadId===currentThreadId ? "highlighted": ""}
                    >
                        {thread.title}
                        <i className="fa-solid fa-trash"
                        onClick={(e)=>{
                            e.stopPropagation();//stop event bubbling
                            deleteThread(thread.threadId);
                        }}></i>
                    </li>
                ))
            }
        </ul>
            {/* sign */}
        <div className="sign">
            <p>By Prathamesh Mandage &hearts;</p>

        </div>
        </section>
    )
}
export default Sidebar;