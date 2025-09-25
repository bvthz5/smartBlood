import React, { useState } from "react";
import api from "../../api";

export default function ChangePassword(){
  const [oldPass, setOld] = useState("");
  const [newPass, setNew] = useState("");

  async function submit(e){
    e.preventDefault();
    try{
      // our backend expects token in Authorization header; api client adds it
      const res = await api.post("/api/auth/change-password", { old_password: oldPass, new_password: newPass });
      alert(res.data.message || "Password changed");
    }catch(err){
      alert(err?.response?.data?.error || "Failed");
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 shadow rounded">
      <h2 className="text-lg font-semibold mb-3">Change Password</h2>
      <form onSubmit={submit}>
        <input className="w-full border p-2 rounded mb-2" placeholder="Old password" type="password" value={oldPass} onChange={e=>setOld(e.target.value)} />
        <input className="w-full border p-2 rounded mb-2" placeholder="New password" type="password" value={newPass} onChange={e=>setNew(e.target.value)} />
        <button className="w-full bg-blue-600 text-white p-2 rounded">Change</button>
      </form>
    </div>
  );
}
