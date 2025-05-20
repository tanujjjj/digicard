import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleLogin = async (e) => {
    e.preventDefault();

    const data = new URLSearchParams();
    data.append("username", form.email);
    data.append("password", form.password);

    try {
      const res = await axios.post("/auth/jwt/login", data, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      });

      const token = res.data.access_token;
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (err) {
      alert("Login failed. Check your credentials.");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4 p-6 max-w-md mx-auto">
      <input
        type="email"
        placeholder="Email"
        className="border p-2 w-full"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        className="border p-2 w-full"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
        Login
      </button>
    </form>
  );
}
