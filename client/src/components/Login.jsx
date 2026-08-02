import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react';

const Login = () => {


    const LoginGoogle = async () => {

        window.location.href = "http://localhost:5000/api/auth/google";


    }

    return (
        <div>
            <h1>Login page</h1>

            <button
                onClick={LoginGoogle}
            >
                Login with Google
            </button>


        </div>
    )
}

export default Login