import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./login/LoginPage";
import HomePage from "./homepage/HomePage";
import UsersPage from './users/UsersPage';
import RegisterForm from './login/RegisterForm';
import ManagerPage from './users/ManagerPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/manager" element={<ManagerPage />} />
      </Routes>
    </Router>
  );
}

export default App
