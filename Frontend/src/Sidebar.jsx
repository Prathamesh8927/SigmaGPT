
import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./Mycontext";
import { v1 as uuidv1 } from "uuid";

function Sidebar() {
    const {
        allthreads,
        setallthreads,
        currentThreadId,
        setcurrentThreadId,
        prevChat,
        setprevChat,
        setnewChat,
        setprompt,
        setreply,
        sidebarOpen,
        setSidebarOpen,
    } = useContext(MyContext);

    const getallthreads = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/thread");
            const res = await response.json();

            const filterData = res.map((thread) => ({
                threadId: thread.threadId,
                title: thread.title,
            }));

            setallthreads(filterData);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getallthreads();
    }, [currentThreadId]);

    const createNewChat = () => {
        setnewChat(true);
        setprompt("");
        setreply(null);
        setcurrentThreadId(uuidv1());
        setprevChat([]);

        // Close sidebar on mobile
        setSidebarOpen(false);
    };

    const changeThread = async (newThreadId) => {
        setcurrentThreadId(newThreadId);

        try {
            const response = await fetch(
                `http://localhost:8080/api/thread/${newThreadId}`
            );

            const res = await response.json();

            console.log(res);

            setprevChat(res);
            setreply(null);
            setnewChat(false);

            // Close sidebar on mobile
            setSidebarOpen(false);
        } catch (error) {
            console.log(error);
        }
    };

    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/thread/${threadId}`,
                {
                    method: "DELETE",
                }
            );

            const res = await response.json();

            console.log(res);

            setallthreads((prev) =>
                prev.filter((thread) => thread.threadId !== threadId)
            );

            if (threadId === currentThreadId) {
                createNewChat();
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="sidebarOverlay"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            <section
                className={`sidebar ${
                    sidebarOpen ? "sidebarOpen" : ""
                }`}
            >
                {/* Mobile close button */}
                <button
                    className="mobileCloseButton"
                    onClick={() => setSidebarOpen(false)}
                    aria-label="Close sidebar"
                >
                    <i className="fa-solid fa-xmark"></i>
                </button>

                {/* New chat button */}
                <button
                    className="newChatButton"
                    onClick={createNewChat}
                >
                    <img
                        src="src/assets/SigmGpt_logo.png"
                        alt="SigmaGPT logo"
                        className="logo"
                    />

                    <span>
                        <i className="fa-solid fa-pen-to-square"></i>
                    </span>
                </button>

                {/* History */}
                <ul className="history">
                    {allthreads?.map((thread) => (
                        <li
                            key={thread.threadId}
                            onClick={() =>
                                changeThread(thread.threadId)
                            }
                            className={
                                thread.threadId === currentThreadId
                                    ? "highlighted"
                                    : ""
                            }
                        >
                            <span className="threadTitle">
                                {thread.title}
                            </span>

                            <i
                                className="fa-solid fa-trash"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteThread(thread.threadId);
                                }}
                            ></i>
                        </li>
                    ))}
                </ul>

                {/* Signature */}
                <div className="sign">
                    <p>By Prathamesh Mandage &hearts;</p>
                </div>
            </section>
        </>
    );
}

export default Sidebar;
