import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import dotenv from 'dotenv';

dotenv.config();

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);

        try {
            const response = await fetch(process.env.BACKEND_URL + "/session/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    //authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ email, password }),
            });
            if (!response.ok) {
                throw new Error("Invalid credentials");
            }

            const data = await response.json();
            localStorage.setItem("token", data.token);
            localStorage.setItem("refreshToken", data.refreshToken);
            localStorage.setItem("userEmail", email);
            console.log("Login successful");
            navigate("/homepage");
        } catch (err: any) {
            setError(err.message || "An error occurred");
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "auto", padding: "20px", border: "1px solid #ddd", borderRadius: "5px", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div style={{ marginBottom: "10px", marginRight: "10px" }}>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                    />
                </div>
                <div style={{ marginBottom: "10px", marginRight: "10px" }}>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                    />
                </div>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button type="submit" style={{ padding: "10px", width: "100%" }}>
                    Login
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
