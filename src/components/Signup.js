import React, { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"


function Login() {
    const history=useNavigate();

    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')

    async function submit(e) {
        e.preventDefault();
    
        try {
            const response = await axios.post("http://localhost:8000/signup", { email, password });
    
            if (response.data === "exist") {
                alert("User already exists");
            } else if (response.data === "notexist") {
                alert("Account created successfully!");
                history("/home", { state: { id: email } });
            } else {
                alert("An unexpected error occurred. Please try again.");
            }
        } catch (error) {
            console.error("Error during signup:", error);
            alert("Failed to connect to the server. Please try again later.");
        }
    }
    


    return (
        <div className="login">

            <h1>Signup</h1>

            <form action="POST">
                <input type="email" onChange={(e) => { setEmail(e.target.value) }} placeholder="Email"  />
                <input type="password" onChange={(e) => { setPassword(e.target.value) }} placeholder="Password" />
                <input type="submit" onClick={submit} />

            </form>

            <br />
            <p>OR</p>
            <br />

            <Link to="/">Login Page</Link>

        </div>
    )
}

export default Login