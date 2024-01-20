const express = require("express");
const app = express();
const port = 8000;
const mongoose = require("mongoose");
const path = require("path");
const Chat=require("./models/chat.js");
const methodOverride = require("method-override")

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

main()
.then(()=>{
    console.log("connection successful");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Whatsapp');
}

let chat1 = new Chat({
    from:"neha",
    to:"priya",
    msg:"send me your exam sheets",
    created_at: new Date()
});

chat1.save()
.then((res)=>{
    console.log(res);
})


// index route
app.get("/chats",async (req,res)=>{
    let chats = await Chat.find();
    console.log(chats);
    
    res.render("index.ejs",{chats});
})

// new route
app.get("/chats/new",(req,res)=>{
    res.render("new.ejs");
})

// create route
app.post("/chats",(req,res)=>{
    let { from, to ,msg } = req.body;
    let newchat = new Chat({
        from: from,
        to: to,
        msg: msg,
        created_at: new Date()
    });
    newchat.save()
    .then(()=>{
        console.log('chat was saved');
    })
    .catch((err)=>{
        console.log(err);
    })
    res.redirect("/chats");

})

app.post("/chats/:id",(req,res)=>{
    let {msg }=req.body;

})

// edit route
app.get("/chats/:id/edit",async (req,res)=>{
    let {id }= req.params;
    let chat=await Chat.findById(id)

    res.render("edit.ejs",{chat});
})
// update route
app.put("/chats/:id",async(req,res)=>{
    let {id}=req.params;
    let {msg:newmsg}=req.body;
    let updatedchat = await Chat.findByIdAndUpdate(
        id,
        {msg:newmsg},
        {runValidators:true , new:true}
    );
    console.log(updatedchat);
    res.redirect("/chats");


})
// DELETE ROUTE
app.delete("/chats/:id",async (req,res)=>{
    let {id}=req.params;
    let deletedchat = await Chat.findByIdAndDelete(id);
    console.log(deletedchat);
    res.redirect("/chats");
})

app.get("/",(req,res)=>{
    res.send("root is working");
})

app.listen(port,()=>{
    console.log(`listening on port ${port}`);
})