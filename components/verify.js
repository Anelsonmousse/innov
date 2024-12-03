import React, { useState } from 'react';
import axios from 'axios';

const Verify = () => {
    const [formData, setFormData] = useState({
        email: '',
        verificationCode: ''
    });

    const { email, verificationCode } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/auth/verify', { email, verificationCode });
            console.log(res.data);
        } catch (err) {
            console.error(err.response.data);
        }
    };

    return (
        <form onSubmit={e => onSubmit(e)}>
            <div>
                <input type="email" name="email" value={email} onChange={e => onChange(e)} required />
            </div>
            <div>
                <input type="text" name="verificationCode" value={verificationCode} onChange={e => onChange(e)} required />
            </div>
            <button type="submit">Verify</button>
        </form>
    );
};

export default Verify;
