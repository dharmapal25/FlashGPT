import app from "./src/app.js";
import "dotenv/config";

const PORT = process.env.PORT

app.get("/", (req, res) => {

    res.json({
        message: "hello"
    })
    console.log("first")
})
console.log("first")


app.listen(() => {
    console.log(`Server started on ${PORT}`);
})