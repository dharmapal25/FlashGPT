import app from "./src/app.js";
import env from "./src/config/env.js";
import chooseModel from "./src/utils/setModel.js";

const PORT = env.PORT
let model = chooseModel("llama 3.3")
console.log(model)

app.get("/api", (req, res) => {

    res.json({
        message: "hello"
    })
})


app.listen(PORT,() => {
    console.log(`Server started on ${PORT}`);
})