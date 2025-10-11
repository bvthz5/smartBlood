import React, { useState } from 'react';
import SeekerLayout from '../../components/seeker/SeekerLayout';
import SeekerNavbar from '../../components/seeker/SeekerNavbar';
import SeekerSidebar from '../../components/seeker/SeekerSidebar';
import seekerService from '../../services/seekerService';
import './CreateRequest.css';

const CreateRequest = () => {
  const [form, setForm] = useState({ patient_ref: '', blood_group: 'A+', units: 1, urgency: 'NORMAL', needed_by: '', ward: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setMsg('');
    try {
      await seekerService.createRequest(form);
      setMsg('Request created successfully');
      setForm({ patient_ref: '', blood_group: 'A+', units: 1, urgency: 'NORMAL', needed_by: '', ward: '' });
    } catch (e1) {
      setMsg(e1?.response?.data?.message || 'Failed to create request');
    } finally { setLoading(false); }
  };

  const onLogout = () => { localStorage.removeItem('seeker_token'); window.location.href = '/seeker/login'; };

  return (
    <SeekerLayout navbar={<SeekerNavbar onLogout={onLogout} />} sidebar={<SeekerSidebar />}>
      <div className="page-wrap">
        <div className="card form-card">
          <h2>Create Request</h2>
          <form className="grid" onSubmit={submit}>
            <label><span>Patient Ref ID</span><input name="patient_ref" value={form.patient_ref} onChange={onChange} required /></label>
            <label><span>Blood Group</span>
              <select name="blood_group" value={form.blood_group} onChange={onChange}>
                {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(bg=> <option key={bg} value={bg}>{bg}</option>)}
              </select>
            </label>
            <label><span>Units</span><input type="number" min="1" name="units" value={form.units} onChange={onChange} /></label>
            <label><span>Urgency</span>
              <select name="urgency" value={form.urgency} onChange={onChange}>
                <option value="NORMAL">Normal</option>
                <option value="URGENT">Urgent</option>
                <option value="EMERGENCY">Emergency</option>
              </select>
            </label>
            <label><span>Needed By</span><input type="datetime-local" name="needed_by" value={form.needed_by} onChange={onChange} /></label>
            <label><span>Ward/Location</span><input name="ward" value={form.ward} onChange={onChange} /></label>
            {msg && <div className="hint">{msg}</div>}
            <div className="actions">
              <button className="btn">Cancel</button>
              <button className="btn btn-primary" disabled={loading}>{loading?'Saving…':'Submit'}</button>
            </div>
          </form>
        </div>
      </div>
    </SeekerLayout>
  );
};

export default CreateRequest;
