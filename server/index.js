const express = require("express")
const mongoose = require("mongoose")
const userRoute = require("./routes/User");
const jobRoute = require("./routes/job")
const bodyParser = require("body-parser");
const app = express();
const dotenv = require("dotenv")
dotenv.config();
const PORT = process.env.PORT || 3000;
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use("/api/user", userRoute);
app.use("/api/job", jobRoute);

app.get("/", (req, res)=>{
    res.send("Hello World");
})
app.listen(PORT, ()=>{
    console.log("Server is running on port 3000");
    mongoose.connect(process.env.MONGODB_URI).then(()=>{
        console.log("MONGODB connected");
    }).catch((err)=>{
        console.log(err)
    })
})