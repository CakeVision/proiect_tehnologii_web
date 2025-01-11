import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const baseApiURL = "https://proiecttehnologiiweb-production.up.railway.app"

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);

        try {
            const response = await fetch(baseApiURL + "/session/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
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
            localStorage.setItem("userId", data.user.id);
            localStorage.setItem("userName", data.user.name);
            localStorage.setItem("userType", data.user.userType);
            console.log("Login successful");
            navigate("/homepage");
        } catch (err: any) {
            setError(err.message || "An error occurred");
        }
    };

    async function handleRegister(event: React.MouseEvent<HTMLButtonElement>): Promise<void> {
        event.preventDefault();
        navigate("/register");
    }

    return (
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
            <h1 className="text-2xl font-bold text-gray-200">Task Management</h1>
            <p className="text-sm text-gray-200 mt-1 mb-4">Manage and track your team's tasks</p>

            <div style={{ maxWidth: "400px", margin: "auto", padding: "16px", border: "1px solid #ddd", borderRadius: "5px" }}>
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
                <h3 className="mt-8 mb-2">
                    Don't have an account?
                </h3>
                <button type="submit" style={{ padding: "10px", width: "100%" }} onClick={handleRegister}>
                    Register
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
