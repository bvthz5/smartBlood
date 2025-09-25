import React, { useState } from "react";
import api from "../../api";

export default function ForgotPassword(){
  const [ident, setIdent] = useState("");
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [stage, setStage] = useState(0);

  async function sendOtp(e){
    e.preventDefault();
    try{
      await api.post("/api/auth/forgot-password", { email_or_phone: ident });
      alert("If account exists, OTP sent (dev logs).");
      setStage(1);
    }catch(err){ alert("Failed"); }
  }

  async function reset(e){
    e.preventDefault();
    try{
      // you need user_id (if your backend returned it). Here we prompt user to paste user_id or use other method.
      // For simplicity we assume user provides user_id in ident field or OTP endpoint tells user; adjust as necessary.
      const payload = { user_id: userId, otp, new_password: newPassword };
      await api.post("/api/auth/reset-password", payload);
      alert("Password reset. Please login.");
      window.location.href = "/donor/login";
    }catch(err){ alert(err?.response?.data?.error || "Failed"); }
  }

  if(stage===1){
    return (
      <div className="max-w-md mx-auto bg-white p-6 shadow rounded">
        <h2 className="text-lg font-semibold mb-3">Reset Password</h2>
        <form onSubmit={reset}>
          <input className="w-full border p-2 rounded mb-2" placeholder="User ID" value={userId||''} onChange={e=>setUserId(e.target.value)} />
          <input className="w-full border p-2 rounded mb-2" placeholder="OTP" value={otp} onChange={e=>setOtp(e.target.value)} />
          <input className="w-full border p-2 rounded mb-2" type="password" placeholder="New password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} />
          <button className="w-full bg-green-600 text-white p-2 rounded">Reset</button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 shadow rounded">
      <h2 className="text-lg font-semibold mb-3">Forgot Password</h2>
      <form onSubmit={sendOtp}>
        <input className="w-full border p-2 rounded mb-2" placeholder="Email or Phone" value={ident} onChange={e=>setIdent(e.target.value)} />
        <button className="w-full bg-blue-600 text-white p-2 rounded">Send OTP</button>
      </form>
    </div>
  );
}
