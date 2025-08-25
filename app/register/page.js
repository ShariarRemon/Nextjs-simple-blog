'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register(){
  const [form, setForm] = useState({ name:'', email:'', password:'' });
  const [err, setErr] = useState('');
  const router = useRouter();
  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    const res = await fetch('/api/auth/register', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) });
    if(res.ok){ router.push('/login?registered=1'); }
    else { const d = await res.json(); setErr(d.error || 'Failed'); }
  };
  return (
    <div className="max-w-md mx-auto card">
      <h1 className="text-2xl font-semibold mb-4">Create account</h1>
      <form onSubmit={submit} className="space-y-3">
        <input className="input" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
        <input className="input" placeholder="Email" type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
        <input className="input" placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button className="btn btn-primary w-full">Register</button>
      </form>
    </div>
  );
}
