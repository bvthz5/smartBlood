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
        <input 
          id="seeker-blood-group"
          name="blood_group"
          type="text"
          className="w-full border rounded p-2 mb-2" 
          placeholder="Blood group (e.g. B+)" 
          value={form.blood_group} 
          onChange={e=>setForm({...form,blood_group:e.target.value})} 
          autoComplete="off"
        />
        <input 
          id="seeker-units"
          name="units_required"
          type="number"
          min="1"
          className="w-full border rounded p-2 mb-2" 
          placeholder="Units" 
          value={form.units_required} 
          onChange={e=>setForm({...form,units_required:parseInt(e.target.value)})} 
        />
        <select 
          id="seeker-urgency"
          name="urgency"
          className="w-full border rounded p-2 mb-2" 
          value={form.urgency} 
          onChange={e=>setForm({...form,urgency:e.target.value})}
        >
          <option value="normal">Normal</option>
          <option value="urgent">Urgent</option>
        </select>
        <input 
          id="seeker-location"
          name="location"
          type="text"
          className="w-full border rounded p-2 mb-2" 
          placeholder="Location/hospital" 
          value={form.location} 
          onChange={e=>setForm({...form,location:e.target.value})} 
          autoComplete="off"
        />
        <button 
          id="seeker-submit"
          type="submit"
          className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700 transition-colors"
        >
          Create Request
        </button>
      </form>
    </div>
  );
}
