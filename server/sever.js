import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";

const PORT = process.env.PORT

app.get("/api", (req, res) => {

    res.json({
        message: "hello"
    })
})


app.listen(PORT,() => {
    console.log(`Server started on ${PORT}`);
})