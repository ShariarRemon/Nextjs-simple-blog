'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Login(){
  const [form, setForm] = useState({ email:'', password:'' });
  const [err, setErr] = useState('');
  const router = useRouter();
  const params = useSearchParams();
  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    const res = await fetch('/api/auth/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) });
    if(res.ok){ router.push('/'); }
    else { const d = await res.json(); setErr(d.error || 'Failed'); }
  };
  return (
    <div className="max-w-md mx-auto card">
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      {params.get('registered') && <p className="text-green-700 text-sm mb-2">Registered! You can login now.</p>}
      <form onSubmit={submit} className="space-y-3">
        <input className="input" placeholder="Email" type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
        <input className="input" placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button className="btn btn-primary w-full">Login</button>
      </form>
    </div>
  );
}
