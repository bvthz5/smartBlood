import React, { useState } from "react";
import api from "../../api";

export default function AdminLogin(){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  async function submit(e){
    e.preventDefault();
    try {
      const res = await api.post("/admin/auth/login", { email, password });
      alert("Admin logged (dev): " + res.data.admin_id);
    } catch(err){
      alert("Login failed");
    }
  }
  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-lg font-semibold mb-3">Admin Login</h2>
      <form onSubmit={submit}>
        <input className="w-full border rounded p-2 mb-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" className="w-full border rounded p-2 mb-2" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="w-full bg-indigo-600 text-white p-2 rounded">Login</button>
      </form>
    </div>
  );
}
