import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";

const PORT = process.env.PORT

app.get("/", (req, res) => {

    res.json({
        message: "hello"
    })
    console.log("first")
})
console.log("first")


app.listen(PORT,() => {
    console.log(`Server started on ${PORT}`);
})