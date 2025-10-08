import React, { useState, useContext } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

export default function Signup(){
    const navigate = useNavigate();
    const { saveAuth } = useContext(AuthContext);

    const [form, setForm] = useState({ name: '', email: '', password: ''});
    const [errors, setErrors] = useState({});
    const [busy, setBusy] = useState(false);

    const validate = () => {
        const e = {};
         if (!form.name.trim()) e.name = 'Name is required';
        if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required';
        if (form.password.length < 6) e.password = 'Password must be at least 6 chars';

        return e;
    }

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        const e = validate();
        setErrors(e);
        if(Object.keys(e).length)
            return;
    
        setBusy(true);
        try{
            const res = await api.post('/auth/signup', form);
            if(res.data.token){
                saveAuth({ token: res.data.token, user: res.data.user || { name: form.name, email: form.email }});
                navigate('/');
            }else{
                navigate('/login');
            }
        }catch(err){
           console.error('Signup error:', err);
            const msg = err.response?.data?.message || 'Signup failed. Try again.';
        
            setErrors({ server: msg });
        }finally{
            setBusy(false);
        }
    };

    return(
        <div className='container mt-5' style={{ maxWidth: 520 }}>
            <h2 className='mb-4'>Sign up</h2>
            {errors.server && <div className='alert alert-danger'>{errors.server}/</div>}

            <form onSubmit={handleSubmit} noValidate>
                <div className='mb-3'>
                    <label className='form-label'>Name</label>
                    <input 
                        name="name" 
                        value={form.name} 
                        onChange={handleChange} 
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`} 
                    />
                    <div className='invalid-feedback'>{errors.name}</div>
                </div>


                 <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input 
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange} 
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                     />
                    <div className="invalid-feedback">{errors.email}</div>
                </div>

                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input 
                        type="password"   
                        name="password"
                        value={form.password} 
                        onChange={handleChange} 
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.password}</div>
                </div>

                <button 
                    className='btn btn-primary w-100' 
                    type='submit' 
                    disabled={busy}
                >
                    {busy ? 'Signing up...' : 'Sign up'}
                </button>
            </form>
        </div>
    );
}

