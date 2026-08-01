import React from 'react'
import { useEffect } from 'react'
import API from '../services/api'
import { useState } from 'react'
import axios from 'axios'

const Chats = () => {

    const [message, setMessage] = useState("")
    const [response, setResponse] = useState("")
    const [loading, setLoading] = useState(false);

    console.log(import.meta.env.VITE_API_URL)

    const inputMessage = (message) => {
        setMessage(message)
    }

    const getReponse = async (msg) => {
        setLoading(true);
        setResponse("");

        API.post("/chat/stream", {
            message: msg
        }).then((res) => {
            const reply = res?.data?.data || res?.data?.reply || "No response received.";
            setResponse(reply);
        }).catch((err) => {
            const errorMessage = err?.response?.data?.error || err?.message || "Request failed.";
            setResponse(errorMessage);
        }).finally(() => {
            setLoading(false);
        })
    }



    console.log(response)


    return (
        <>
            <div>Chats</div>
            {loading ? <h1>Loading...</h1> : <p>{response}</p>}

            <input
                type="text"
                placeholder='Ask something...'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        getReponse(message);
                        // setMessage("");
                    }
                }}
            />

        </>
    )
}

export default Chats