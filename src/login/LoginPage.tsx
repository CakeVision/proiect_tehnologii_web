import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);

        try {
            const response = await fetch("http://localhost:3000/session/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // Authorization: `Bearer ${localStorage.getItem("token")}`, // Send token if available
                    authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ email, password }),
            });
            if (!response.ok) {
                throw new Error("Invalid credentials");
            }

            const data = await response.json();
            localStorage.setItem("token", data.token); // Store token in localStorage
            console.log("Login successful");
            navigate("/homepage");
        } catch (err: any) {
            setError(err.message || "An error occurred");
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div style={{ marginBottom: "10px" }}>
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
                <div style={{ marginBottom: "10px" }}>
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
