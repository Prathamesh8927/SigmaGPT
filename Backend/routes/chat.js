import express from "express";
import Thread from "../models/Thread.js";
import getGeminiAIAPIResponse from "../utils/GeminiAi.js";
const router =express.Router();

//test
router.post("/test",async(req,res)=>{
    try{
            const thread= new Thread({
                threadId:"poiu",
                title:"Testing my threadi"
            });
          const response= await thread.save();
          res.send(response);
    }catch(err){
        console.log(err);
        res.status(500).json({error: "failed to save in DB"});
        
    }

});


//Get all threads

router.get("/thread", async(req, res) => {
    try {
const threads = await Thread.find({}).sort({ updatedAt: -1 });
    //desending order at updatedAt// most resent data at top
    res.json(threads);
    } catch(error) {
        console.log(error);
        res.status(500).json({error: "failed to fetch"});
    }
})
router.get("/thread/:threadId",async(req,res)=>{
    const {threadId}= req.params;
    try {
     const thread=await Thread.findOne({threadId});
     if(!thread){
            return res.status(404).json({error:"thread not found"});
     }
     res.json(thread.messages);
    } catch (error) {
         console.log(error);
        res.status(500).json({error: "failed to fetch chat"});
    }
})

router.delete("/thread/:threadId",async(req,res)=>{

    const {threadId}= req.params;

    try {
      const deletedThread= await Thread.findOneAndDelete({ threadId });
      if(!deletedThread){
        return res.status(404).json({error:"Thread not found"})
      }
      res.status(200).json({success:"Thread deleted Succesfully"})
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "failed to fetch chat"});

    }
})

router.post("/chat",async(req,res)=>{
    const{threadId,message}= req.body;

    if(!threadId || !message){
        return res.status(400).json({error:"missing required fields"})
    }
    try {
       let thread= await Thread.findOne({threadId});
       if(!thread){
        //creat new thread in Db
        thread= new Thread({
            threadId:threadId,
            title:message,
            messages:[
                {
                role:"user",
                content:message
            }
        ]
        })
       }else{
        thread.messages.push({role:"user",content:message});
    }
    const assistantReply= await getGeminiAIAPIResponse(message);
    
    thread.messages.push({role:"assistant",content:assistantReply});
    thread.updatedAt= new Date();
    await thread.save();
    res.json({reply:assistantReply});

    } catch (error) {
        console.log(error);
        res.status(500).json({error:"something went wrong"})
    }
})
export default router;