import React, { useEffect, useState} from 'react';
import api from '../api';

export default function Dashboard(){
    const [message, setMessage] = useState();

    useEffect(() => {
        api.get('/user/dashboard')
            .then(res => setMessage(res.data.message || 'Welcome to your dashboard!'))
            .catch(err => setMessage(err.response?.data?.message || 'Unauthorized'));
    }, []);

      return (
            <div className="container mt-5">
            <h2>Dashboard</h2>
            <p>{message}</p>
            </div>
        );
}