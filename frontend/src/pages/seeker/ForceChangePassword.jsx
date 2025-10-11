import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import seekerService from '../../services/seekerService';
import SeekerLayout from '../../components/seeker/SeekerLayout';
import SeekerNavbar from '../../components/seeker/SeekerNavbar';
import SeekerSidebar from '../../components/seeker/SeekerSidebar';
import './ForceChangePassword.css';

const ForceChangePassword = () => {
  const [oldPassword, setOld] = useState('');
  const [pass, setPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const canSubmit = pass && confirm && pass === confirm && oldPassword;

  const onLogout = () => {
    localStorage.removeItem('seeker_temp_token');
    navigate('/seeker/login', { replace: true });
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setMsg('');
    try {
      const data = await seekerService.activate(oldPassword, pass);
      if (data?.access_token) localStorage.setItem('seeker_token', data.access_token);
      localStorage.removeItem('seeker_temp_token');
      navigate('/seeker/dashboard', { replace: true });
      // toast placeholder: Password secured
    } catch (err) {
      setMsg(err?.response?.data?.message || 'Activation failed. Check your credentials.');
    } finally { setLoading(false); }
  };

  return (
    <SeekerLayout
      navbar={<SeekerNavbar onLogout={onLogout} />}
      sidebar={<SeekerSidebar />}
    >
      <div className="activation-wrap">
        <div className="activation-card">
          <h2>Account Activation: Secure Your Access</h2>
          <p className="info">Please set a new password to proceed.</p>
          <form onSubmit={submit} className="form-grid">
            <label>
              <span>Temporary Password</span>
              <input type="password" value={oldPassword} onChange={(e)=>setOld(e.target.value)} required />
            </label>
            <label>
              <span>New Password</span>
              <input type="password" value={pass} onChange={(e)=>setPass(e.target.value)} required />
            </label>
            <label>
              <span>Confirm New Password</span>
              <input type="password" value={confirm} onChange={(e)=>setConfirm(e.target.value)} required />
            </label>
            {msg && <div className="error">{msg}</div>}
            <div className="actions">
              <button type="button" className="btn" onClick={onLogout}>Cancel</button>
              <button className="btn btn-primary" disabled={!canSubmit || loading}>{loading?'Saving…':'Secure Password'}</button>
            </div>
          </form>
        </div>
      </div>
    </SeekerLayout>
  );
};

export default ForceChangePassword;
