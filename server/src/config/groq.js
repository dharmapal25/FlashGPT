 const { Groq } = require("groq-sdk/client.js");

 
const GROQ_API_KEY = process.env.GROQ_API_KEY;

const groq = new Groq({
    apiKey: GROQ_API_KEY
})

export default groq