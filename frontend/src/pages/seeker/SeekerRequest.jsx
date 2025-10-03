import React, { useState } from "react";
import { createRequest } from "../../services/api";

export default function SeekerRequest(){
  const [form, setForm] = useState({ blood_group:"", units_required:1, urgency:"normal", location:"" });

  async function submit(e){
    e.preventDefault();
    try {
      await createRequest(form);
      alert("Request created");
      setForm({ blood_group:"", units_required:1, urgency:"normal", location:"" });
    } catch(err){
      alert(err.response?.data?.error || "Failed");
    }
  }

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-lg font-semibold mb-3">Create Blood Request</h2>
      <form onSubmit={submit}>
        <input className="w-full border rounded p-2 mb-2" placeholder="Blood group (e.g. B+)" value={form.blood_group} onChange={e=>setForm({...form,blood_group:e.target.value})} />
        <input type="number" className="w-full border rounded p-2 mb-2" placeholder="Units" value={form.units_required} onChange={e=>setForm({...form,units_required:parseInt(e.target.value)})} />
        <select className="w-full border rounded p-2 mb-2" value={form.urgency} onChange={e=>setForm({...form,urgency:e.target.value})}>
          <option value="normal">Normal</option>
          <option value="urgent">Urgent</option>
        </select>
        <input className="w-full border rounded p-2 mb-2" placeholder="Location/hospital" value={form.location} onChange={e=>setForm({...form,location:e.target.value})} />
        <button className="w-full bg-red-600 text-white p-2 rounded">Create Request</button>
      </form>
    </div>
  );
}
