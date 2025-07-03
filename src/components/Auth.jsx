import { useState } from "react";
import { toast } from "react-toastify";
import { authApi } from '../services/api';

export default function Auth({ setIsAuthenticated }) {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ 
    username: "", 
    email: "",
    password: "" 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.email || !formData.password) {
      toast.error("All fields are required!");
      setIsLoading(false);
      return;
    }

    try {
      if (isLogin) {
        // Login
        const response = await authApi.login({
          email: formData.email,
          password: formData.password
        });
        
        if (response.user && response.token) {
          localStorage.setItem("loggedInUser", JSON.stringify(response.user));
          toast.success("Login successful!");
          setIsAuthenticated(true);
        } else {
          throw new Error("Invalid response from server");
        }
      } else {
        // Register
        if (!formData.username) {
          toast.error("Username is required!");
          setIsLoading(false);
          return;
        }
        
        const response = await authApi.register({
          username: formData.username,
          email: formData.email,
          password: formData.password
        });
        
        if (response.user && response.token) {
          localStorage.setItem("loggedInUser", JSON.stringify(response.user));
          toast.success("Registration successful!");
          setIsAuthenticated(true);
        } else {
          throw new Error("Invalid response from server");
        }
      }
    } catch (error) {
      if (error.response) {
        // Server responded with an error
        toast.error(error.response.data?.message || "Authentication failed");
      } else if (error.request) {
        // Request was made but no response received
        toast.error("Unable to connect to the server. Please check your internet connection.");
      } else {
        // Something else went wrong
        toast.error(error.message || "An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isLogin ? "Login" : "Sign Up"}
        </h2>
        {!isLogin && (
          <input
            type="text"
            placeholder="Enter your username"
            className="w-full p-2 border rounded mb-2"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            disabled={isLoading}
          />
        )}
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-2 border rounded mb-2"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          disabled={isLoading}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded mb-4"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          disabled={isLoading}
        />
        <button
          type="submit"
          className={`w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : (isLogin ? "Login" : "Sign Up")}
        </button>
        <p className="text-sm mt-3 text-center">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => !isLoading && setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      </form>
      <div className="absolute bottom-0 left-0 right-0 text-center bg-gray-200 p-4">
        <p className="text-sm">© 2023 Your Company</p>
        <p className="text-sm">All rights reserved.</p>
      </div>
    </div>
  );
}
