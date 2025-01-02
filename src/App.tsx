import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./login/LoginPage";
import HomePage from "./homepage/HomePage";

function App() {
  // const [count, setCount] = useState(0)
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/homepage" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App
