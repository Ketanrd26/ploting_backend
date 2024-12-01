import express from "express"
import cors from "cors"
import { checkDatabase } from "./database/db.js"
import dotenv from "dotenv";
import createAllTable from "./models/model.js";
import { userRoute } from "./routes/user.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

app.get("/",(req, res)=>{
    res.send("hello world")
})
app.use("/user", userRoute)
try {
    await checkDatabase();
    
    await createAllTable()
} catch (error) {
    console.log(error)
}

app.listen(port, ()=>{
    console.log(`your app running ${port}`)
})
