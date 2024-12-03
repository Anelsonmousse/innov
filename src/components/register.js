import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const { name, email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/auth/register', { name, email, password });
            console.log(res.data);
        } catch (err) {
            console.error(err.response.data);
        }
    };

    return (
        <form onSubmit={e => onSubmit(e)}>
            <div>
                <input type="text" name="name" value={name} onChange={e => onChange(e)} required />
            </div>
            <div>
                <input type="email" name="email" value={email} onChange={e => onChange(e)} required />
            </div>
            <div>
                <input type="password" name="password" value={password} onChange={e => onChange(e)} required />
            </div>
            <button type="submit">Register</button>
        </form>
    );
};

export default Register;
