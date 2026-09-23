
import { useState } from "react";
import "./App.css";
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import { MyContext } from "./Mycontext.jsx";
import { v1 as uuidv1 } from "uuid";

function App() {
    const [prompt, setprompt] = useState("");
    const [reply, setreply] = useState(null);
    const [currentThreadId, setcurrentThreadId] = useState(uuidv1());
    const [prevChat, setprevChat] = useState([]);
    const [newChat, setnewChat] = useState(true);
    const [allthreads, setallthreads] = useState([]);

    // Mobile sidebar state
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const providerValue = {
        prompt,
        setprompt,
        reply,
        setreply,
        currentThreadId,
        setcurrentThreadId,
        newChat,
        setnewChat,
        prevChat,
        setprevChat,
        allthreads,
        setallthreads,

        // Mobile sidebar
        sidebarOpen,
        setSidebarOpen,
    };

    return (
        <div className="app">
            <MyContext.Provider value={providerValue}>
                <Sidebar />
                <ChatWindow />
            </MyContext.Provider>
        </div>
    );
}

export default App;
