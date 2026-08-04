import env from "../config/env.js"

const chooseModel = (model) => {

    if (model == "llama 3.3") {
        model = env.LLAMA_MODEL
    }
    else if (model == "deepseek-r1") {
        model = env.DEEPSEEK_MODEL
        console.log("first")
    }
    else if (model == "qwen3.6") {
        model = env.OPENAI_MODEL
    }
    else {
        model = env.OPENAI_MODEL
    }

    return model

}

export default chooseModel
