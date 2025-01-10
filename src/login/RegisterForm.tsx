import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

interface UserData {
    email: string;
    password: string;
    name: string;
    userType: 'Executor' | 'Manager' | 'Administrator';
    // Add any other user data fields you want to store
  }
  
interface FormData extends UserData {
confirmPassword: string;
}
//TODO: move to another file
const SESSION_KEY = 'user_session_data';
const saveToSession = (data: any) => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
};

const getFromSession = (): UserData | null => {
    const data = sessionStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
};

const clearSession = () => {
    sessionStorage.removeItem(SESSION_KEY);
};
const baseApiURL = "https://proiecttehnologiiweb-production.up.railway.app"
const RegisterForm = () => {
    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        userType: 'Executor',
    });
    const navigate = useNavigate();
    
    const [errors, setErrors] = useState<Partial<FormData>>({});
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.name) {
      newErrors.name = 'Username is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Username must be at least 3 characters';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
       try {
        const response = await fetch(baseApiURL + "/session/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            //TODO: remove managerId from backend and add the option of allocating users to manager in the admin panel
            body: JSON.stringify(
                {
                    "email": formData.email,
                    "password": formData.password,
                    "name": formData.name,
                    "userType": formData.userType,
                    "managerId": 16
                }
            ) ,
        });

        if(!response.ok){
            throw new Error('oof');
        }

        saveToSession(response.body)
        navigate("/")
       } catch (error: any) {
            setErrors(error.message)
       }
      console.log('Form submitted:', formData);
      setSubmitStatus('success');
    } else {
      setSubmitStatus('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Create an account</h2>
          <p className="mt-2 text-gray-600">Sign up to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 
                px-3 py-2 shadow-sm 
                bg-slate-600
                 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full rounded-md border 
                border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500
                bg-slate-600
                 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="userType" className="block text-sm font-medium text-gray-700">
                User Type
              </label>
              <select
                id="userType"
                name="userType"
                value={formData.userType}
                onChange={(e) => handleChange(e as any)}
                className="mt-1 block w-full rounded-md border border-gray-300
                 px-3 py-2 shadow-sm bg-slate-600
                  focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Executor">Executor</option>
                <option value="Manager">Manager</option>
                <option value="Administrator">Administrator</option>
              </select>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full rounded-md border border-gray-300
                 px-3 py-2 shadow-sm
                bg-slate-600
                  focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="mt-1 block w-full rounded-md border border-gray-300
                 px-3 py-2 shadow-sm
                bg-slate-600
                  focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent
               rounded-md shadow-sm text-sm font-medium text-white bg-cyan-800
                hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            
            >
              Sign up
            </button>
          </div>
        </form>

        {submitStatus === 'success'  }

        {submitStatus === 'error'}
      </div>
    </div>
  );
};

export default RegisterForm;
