import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/task.js"


const app = express()

app.use(express.json())
app.use(cors({
    origin:"http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH']
}))
app.use(cookieParser())


app.use("/api/auth", authRoutes)
app.use("/api/userTask", taskRoutes)

app.listen(8800, ()=>{
    console.log("api okay!!");
})