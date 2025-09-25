import React, { useEffect, useState } from "react";
import { getDonorProfile, updateDonorProfile } from "../../api";

export default function EditProfile(){
  const [form, setForm] = useState(null);

  useEffect(()=>{ load(); }, []);
  async function load(){
    try{
      const res = await getDonorProfile();
      setForm({ name: res.data.name, email: res.data.email, blood_group: res.data.blood_group });
    }catch(e){ console.error(e); }
  }

  async function submit(e){
    e.preventDefault();
    try{
      await updateDonorProfile(form);
      alert("Profile updated");
    }catch(err){ alert("Failed"); }
  }

  if(!form) return <div>Loading...</div>;
  return (
    <div className="max-w-md mx-auto bg-white p-6 shadow rounded">
      <h2 className="text-lg font-semibold mb-3">Edit Profile</h2>
      <form onSubmit={submit}>
        <input className="w-full border p-2 rounded mb-2" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
        <input className="w-full border p-2 rounded mb-2" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
        <input className="w-full border p-2 rounded mb-2" placeholder="Blood group" value={form.blood_group} onChange={e=>setForm({...form, blood_group:e.target.value})} />
        <button className="w-full bg-blue-600 text-white p-2 rounded">Save</button>
      </form>
    </div>
  );
}
