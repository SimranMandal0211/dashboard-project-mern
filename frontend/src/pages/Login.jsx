import React, { useState, useContext } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

export default function Login(){
    const navigate = useNavigate();
    const { saveAuth } = useContext(AuthContext);

    const [form, setForm] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [busy, setBusy] = useState(false);

    const validate = () => {
        const e = {};
        if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required';
        if (!form.password) e.password = 'Password is required';

        return e;
    };

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));


    const handleSubmit = async (ev) => {
        ev.preventDefault();
        const e = validate();
        setErrors(e);
        if (Object.keys(e).length) return;

        setBusy(true);
        try {
        const res = await api.post('/auth/login', form);
        const token = res.data.token;
        const user = res.data.user || null; // if server returns user data
        if (!token) throw new Error('No token received');
        saveAuth({ token, user });
        navigate('/');
        } catch (err) {
        setErrors({ server: err.response?.data?.message || err.message || 'Login failed' });
        } finally {
        setBusy(false);
        }
    };


    return(
        <div className="container mt-5" style={{ maxWidth: 520 }}>
            <h2 className="mb-4">Login</h2>
            {errors.server && <div className="alert alert-danger">{errors.server}</div>}
            <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} className={`form-control ${errors.email ? 'is-invalid' : ''}`} />
                <div className="invalid-feedback">{errors.email}</div>
                </div>

                <div className="mb-3">
                <label className="form-label">Password</label>
                <input type="password" name="password" value={form.password} onChange={handleChange} className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
                <div className="invalid-feedback">{errors.password}</div>
                </div>

                <button className="btn btn-primary w-100" type="submit" disabled={busy}>{busy ? 'Logging in...' : 'Login'}</button>
            </form>
    </div>
    );
}